package multiple_choice_question

import (
	"github.com/google/generative-ai-go/genai"
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

func HandleContentGeneration(c Category, d Difficulty, gemini *genai.GenerativeModel) ([]MultipleChoiceQuestion, error) {
	questions := make([]MultipleChoiceQuestion, 0)

	_ = ai.ConfigureForFactualContent(gemini)

	return questions, nil
}

// example
var prompt = `Acting as a content creator for fun and engaging quizzes, 
	you must create a question that conforms to the following JSON model:

	{
		"category": "Geography",
		"difficulty": "very easy",
		"text": "What is the capital of France?",
		"possibleAnswers": {
		"1": "Paris",
		"2": "London",
		"3": "Rome",
		"4": "Berlin"
	},
		"correctAnswer": 1
	}

	The available categories are: General Knowledge, Science & Nature, History & Politics, Geography, Entertainment & Pop Culture, 
	Sports & Games, Computer Science & Technology, Mathematics & Logic, Food & Drink, Mythology & Religion, Space & Astronomy, Art & Design`

/*
  Example:

	  {
		"id": "1d1f9ae2-5c88-4b5c-8bbd-32f5d6243e42",
		"category": "Geography",
		"difficulty": "very easy",
		"text": "What is the capital of France?",
		"possibleAnswers": {
		  "1": "Paris",
		  "2": "London",
		  "3": "Rome",
		  "4": "Berlin"
		},
		"correctAnswer": 1
	  }
*/
