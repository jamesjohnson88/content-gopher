package multiple_choice_question

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"github.com/jamesjohnson88/content-gopher/internal/ai"
	"github.com/jamesjohnson88/content-gopher/internal/config"
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

func ValidateAnswerHandler(cfg *config.Config, aiClient *genai.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req ValidateAnswerRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		model := ai.ConfigureForFactChecking(aiClient.GenerativeModel(cfg.GeminiModel))

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

		content, err := model.GenerateContent(r.Context(), genai.Text(prompt))
		if err != nil {
			http.Error(w, fmt.Sprintf("Error generating content: %v", err), http.StatusInternalServerError)
			return
		}

		responseText := ai.GetContentFromCandidates(content.Candidates)
		if responseText == "" {
			http.Error(w, "Empty response from AI", http.StatusInternalServerError)
			return
		}

		var response ValidateAnswerResponse
		if err := json.Unmarshal([]byte(responseText), &response); err != nil {
			jsonStart := strings.Index(responseText, "{")
			jsonEnd := strings.LastIndex(responseText, "}")
			if jsonStart >= 0 && jsonEnd > jsonStart {
				jsonStr := responseText[jsonStart : jsonEnd+1]
				if err := json.Unmarshal([]byte(jsonStr), &response); err != nil {
					http.Error(w, fmt.Sprintf("Error parsing AI response: %v\nResponse text: %s", err, responseText), http.StatusInternalServerError)
					return
				}
			} else {
				http.Error(w, fmt.Sprintf("Could not find valid JSON in response: %s", responseText), http.StatusInternalServerError)
				return
			}
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
			return
		}
	}
}

func formatAnswers(answers map[int]string) string {
	var result string
	for i := 1; i <= len(answers); i++ {
		result += string(rune('A'+i-1)) + ") " + answers[i] + "\n"
	}
	return result
}
