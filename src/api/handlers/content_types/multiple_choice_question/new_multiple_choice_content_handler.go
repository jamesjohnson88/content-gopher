package multiple_choice_question

import (
	"encoding/json"
	"github.com/google/generative-ai-go/genai"
	"github.com/jamesjohnson88/content-gopher/internal/config"
	mcqMod "github.com/jamesjohnson88/content-gopher/models/content_types/multiple_choice_question"
	mcqSvc "github.com/jamesjohnson88/content-gopher/services/content_types/multiple_choice_question"
	"net/http"
)

type multipleChoiceQuestionFetchParams struct {
	Category       mcqMod.Category
	Difficulty     mcqMod.Difficulty
	AdditionalInfo string
}

func NewMultipleChoiceContentHandler(cfg *config.Config, ai *genai.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var params multipleChoiceQuestionFetchParams
		err := json.NewDecoder(r.Body).Decode(&params)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if !params.Category.IsValid() || !params.Difficulty.IsValid() {
			http.Error(w, "category or difficulty value was invalid", http.StatusBadRequest)
			return
		}

		questions, err := mcqSvc.HandleContentGeneration(
			params.AdditionalInfo,
			params.Category,
			params.Difficulty,
			ai.GenerativeModel(cfg.GeminiModel))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = json.NewEncoder(w).Encode(questions)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
	}
}
