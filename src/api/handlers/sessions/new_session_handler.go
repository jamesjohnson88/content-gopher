package sessions

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/jamesjohnson88/content-gopher/internal/config"
	"github.com/jamesjohnson88/content-gopher/models/sessions"
)

func NewSessionHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var newSession = sessions.Session{}
		err := json.NewDecoder(r.Body).Decode(&newSession)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		rsBody := struct {
			ResponseUrl string `json:"responseUrl"`
		}{
			ResponseUrl: fmt.Sprintf("/content/%s", strings.ReplaceAll(newSession.ContentFormat, "_", "-")),
		}

		err = json.NewEncoder(w).Encode(rsBody)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		return
	}
}
