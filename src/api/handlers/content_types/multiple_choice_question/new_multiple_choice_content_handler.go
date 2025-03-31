package multiple_choice_question

import (
	"encoding/json"
	"github.com/google/generative-ai-go/genai"
	"github.com/jamesjohnson88/content-gopher/internal/config"
	mcqMod "github.com/jamesjohnson88/content-gopher/models/content_types/multiple_choice_question"
	mcqSvc "github.com/jamesjohnson88/content-gopher/services/content_types/multiple_choice_question"
	"net/http"
)

func NewMultipleChoiceContentHandler(cfg *config.Config, ai *genai.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		catParam := r.URL.Query().Get("cParam")
		diffParam := r.URL.Query().Get("dParam")
		if catParam == "" || diffParam == "" {
			http.Error(w, "required parameters were not present", http.StatusBadRequest)
			return
		}

		category := mcqMod.Category(catParam)
		difficulty := mcqMod.Difficulty(diffParam)
		if !category.IsValid() || !difficulty.IsValid() {
			http.Error(w, "category or difficulty value was invalid", http.StatusBadRequest)
			return
		}

		questions, err := mcqSvc.HandleContentGeneration(category, difficulty, ai.GenerativeModel(cfg.GeminiModel))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = json.NewEncoder(w).Encode(questions)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
