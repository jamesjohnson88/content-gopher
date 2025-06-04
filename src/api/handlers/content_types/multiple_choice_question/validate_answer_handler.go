package multiple_choice_question

import (
	"encoding/json"
	"net/http"

	"github.com/google/generative-ai-go/genai"
	"github.com/jamesjohnson88/content-gopher/internal/ai"
	"github.com/jamesjohnson88/content-gopher/internal/config"
	mcqSvc "github.com/jamesjohnson88/content-gopher/services/content_types/multiple_choice_question"
)

func ValidateAnswerHandler(cfg *config.Config, aiClient *genai.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req mcqSvc.ValidateAnswerRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		model := ai.ConfigureForFactChecking(aiClient.GenerativeModel(cfg.GeminiModel))

		response, err := mcqSvc.HandleAnswerValidation(r.Context(), req, model)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
