package sessions

import (
	"encoding/json"
	"github.com/jamesjohnson88/content-gopher/services/content_types/multiple_choice_question"
	"net/http"
)

type sessionOptions struct {
	SessionTypes map[string]interface{}
}

func NewSessionOptionsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		mcqOptions := multiple_choice_question.GetSessionConfigOptions()

		options := sessionOptions{
			SessionTypes: map[string]interface{}{
				"Multiple Choice Questions": mcqOptions,
			},
		}

		err := json.NewEncoder(w).Encode(options)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
