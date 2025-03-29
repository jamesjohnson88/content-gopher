package sessions

import (
	"encoding/json"
	"github.com/jamesjohnson88/content-gopher/models/sessions"
	"log/slog"
	"net/http"
)

func NewSessionHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var newSession = sessions.Session{}

		err := json.NewDecoder(r.Body).Decode(&newSession)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		slog.Info("Posted object", slog.Any("newSession", newSession))
	}
}
