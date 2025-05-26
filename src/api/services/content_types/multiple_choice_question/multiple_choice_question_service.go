package multiple_choice_question

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/google/generative-ai-go/genai"
	"github.com/google/uuid"
	"github.com/jamesjohnson88/content-gopher/internal/ai"
	. "github.com/jamesjohnson88/content-gopher/models/content_types/multiple_choice_question"
	s "github.com/jamesjohnson88/content-gopher/models/sessions"
)

func GetSessionConfigOptions() []s.SessionOption {
	return []s.SessionOption{
		{
			Title:         "Difficulty",
			ContentFormat: "difficulty",
			Options: []s.SessionOptionSelection{
				*s.NewSessionOptionSelection("Mixed", string(DifficultyMixed)),
				*s.NewSessionOptionSelection("Very Easy", string(DifficultyVeryEasy)),
				*s.NewSessionOptionSelection("Easy", string(DifficultyEasy)),
				*s.NewSessionOptionSelection("Medium", string(DifficultyMedium)),
				*s.NewSessionOptionSelection("Hard", string(DifficultyHard)),
				*s.NewSessionOptionSelection("Very Hard", string(DifficultyVeryHard)),
			},
		},
		{
			Title:         "Category",
			ContentFormat: "category",
			Options: []s.SessionOptionSelection{
				*s.NewSessionOptionSelection("Mixed", string(CategoryMixed)),
				*s.NewSessionOptionSelection("Art & Design", string(CategoryArtDesign)),
				*s.NewSessionOptionSelection("Computer Science & Technology", string(CategoryComputerScienceTech)),
				*s.NewSessionOptionSelection("Entertainment & Pop Culture", string(CategoryEntertainment)),
				*s.NewSessionOptionSelection("Food & Drink", string(CategoryFoodDrink)),
				*s.NewSessionOptionSelection("General Knowledge", string(CategoryGeneralKnowledge)),
				*s.NewSessionOptionSelection("Geography", string(CategoryGeography)),
				*s.NewSessionOptionSelection("History & Politics", string(CategoryHistoryPolitics)),
				*s.NewSessionOptionSelection("Mathematics & Logic", string(CategoryMathematicsLogic)),
				*s.NewSessionOptionSelection("Mythology & Religion", string(CategoryMythologyReligion)),
				*s.NewSessionOptionSelection("Science & Nature", string(CategoryScienceNature)),
				*s.NewSessionOptionSelection("Space & Astronomy", string(CategorySpaceAstronomy)),
				*s.NewSessionOptionSelection("Sports & Games", string(CategorySportsGames)),
			},
		},
	}
}

// todo - accept a ctx from calling function
func HandleContentGeneration(ctx context.Context, additional string, c Category, d Difficulty, gemini *genai.GenerativeModel) ([]MultipleChoiceQuestion, error) {
	model := ai.ConfigureForFactualJsonContent(gemini)
	prompt := getPrompt(additional, c, d)

	ctx, cancel := context.WithTimeout(ctx, 60*time.Second)
	defer cancel()

	result, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("gemini API error: %w", err)
	}

	content := ai.GetContentFromCandidates(result.Candidates)

	var rsQuestions []MultipleChoiceQuestion
	err = json.Unmarshal([]byte(content), &rsQuestions)
	if err != nil {
		return nil, fmt.Errorf("json unmarshal error: %w", err)
	}

	// Add UUIDs to each question
	for i := range rsQuestions {
		rsQuestions[i].Id = uuid.New()
	}

	return rsQuestions, nil
}

func getPrompt(additional string, c Category, d Difficulty) string {
	catText := ""
	if c == CategoryMixed {
		catText = fmt.Sprintf("Please select questions using a mixture of the following categories: %s.", CategoriesList)
	} else {
		catText = fmt.Sprintf("Please select questions that all align with the category of %q.", c)
	}

	diffText := ""
	if d == DifficultyMixed {
		diffText = fmt.Sprintf("Please select questions using a mixture of the following difficulties: %s.", DifficultiesList)
	} else {
		diffText = fmt.Sprintf("Please select questions that all have an estimated difficulty of %q.", d)
	}

	prompt := basePrompt
	prompt = strings.Replace(prompt, "{additionalInstructions}", additional, 1)
	prompt = strings.Replace(prompt, "{catText}", catText, 1)
	prompt = strings.Replace(prompt, "{diffText}", diffText, 1)

	return prompt
}

var basePrompt = `Acting as a content creator for fun and engaging quizzes, 
	you must create an array of exactly 10 **multiple-choice questions**. Each question must strictly adhere to this JSON structure:

	{
		"category": "<string>",
		"difficulty": "<string>",
		"text": "<string>",
		"possibleAnswers": {
			"1": "<string>",
			"2": "<string>",
			"3": "<string>",
			"4": "<string>"
		},
		"correctAnswer": <integer>
	}

	DO NOT include any extra fields or explanations.

	The response must be a valid JSON array with no additional commentary, explanations, or escape sequences.
	All categories and difficulties should exactly match ones from the options specified below.

	{catText}

	{diffText}

	Further detail: {additionalInstructions}`
