package multiple_choice_question

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"github.com/jamesjohnson88/content-gopher/internal/ai"
)

type ValidateAnswerRequest struct {
	Question        string         `json:"question"`
	PossibleAnswers map[int]string `json:"possibleAnswers"`
	CorrectAnswer   int            `json:"correctAnswer"`
}

type ValidateAnswerResponse struct {
	IsValid       bool   `json:"isValid"`
	Message       string `json:"message"`
	ShouldDiscard bool   `json:"shouldDiscard"`
}

func HandleAnswerValidation(ctx context.Context, req ValidateAnswerRequest, model *genai.GenerativeModel) (ValidateAnswerResponse, error) {
	prompt := `Please validate the following multiple choice question and its answer. 
	Question: ` + req.Question + `
	Possible Answers:
	` + formatAnswers(req.PossibleAnswers) + `
	Marked Correct Answer: ` + req.PossibleAnswers[req.CorrectAnswer] + `

	Please provide a concise response (max 3 sentences) indicating:
	1. Whether the marked answer is correct
	2. If incorrect, what the correct answer should be
	3. Whether the question should be discarded due to factual inaccuracies or ambiguity

	Format your response as a JSON object with the following structure:
	{
		"isValid": boolean,
		"message": "string (max 3 sentences)",
		"shouldDiscard": boolean
	}
	`

	content, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return ValidateAnswerResponse{}, fmt.Errorf("error generating content: %w", err)
	}

	responseText := ai.GetContentFromCandidates(content.Candidates)
	if responseText == "" {
		return ValidateAnswerResponse{}, fmt.Errorf("empty response from AI")
	}

	var response ValidateAnswerResponse
	if err := json.Unmarshal([]byte(responseText), &response); err != nil {
		// Try to extract JSON if it's embedded in other text
		jsonStart := strings.Index(responseText, "{")
		jsonEnd := strings.LastIndex(responseText, "}")
		if jsonStart >= 0 && jsonEnd > jsonStart {
			jsonStr := responseText[jsonStart : jsonEnd+1]
			if err := json.Unmarshal([]byte(jsonStr), &response); err != nil {
				return ValidateAnswerResponse{}, fmt.Errorf("error parsing AI response: %w\nResponse text: %s", err, responseText)
			}
		} else {
			return ValidateAnswerResponse{}, fmt.Errorf("could not find valid JSON in response: %s", responseText)
		}
	}

	return response, nil
}

func formatAnswers(answers map[int]string) string {
	var result string
	for i := 1; i <= len(answers); i++ {
		result += string(rune('A'+i-1)) + ") " + answers[i] + "\n"
	}
	return result
}
