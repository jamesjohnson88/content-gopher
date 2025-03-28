package sessions

import (
	"encoding/json"
	mcqModel "github.com/jamesjohnson88/content-gopher/models/content_types/multiple_choice_question"
	. "github.com/jamesjohnson88/content-gopher/models/sessions"
	mcqSvc "github.com/jamesjohnson88/content-gopher/services/content_types/multiple_choice_question"
	"net/http"
)

type sessionOptions struct {
	SessionTypes []*SessionOption `json:"session_types"`
}

func NewSessionOptionsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		options := sessionOptions{
			SessionTypes: []*SessionOption{
				{
					Title:         mcqModel.Title,
					ContentFormat: mcqModel.FormatType,
					Options:       mcqSvc.GetSessionConfigOptions(),
				},
			},
		}

		err := json.NewEncoder(w).Encode(options)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
