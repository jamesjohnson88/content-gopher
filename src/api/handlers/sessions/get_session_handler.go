package sessions

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"github.com/jamesjohnson88/content-gopher/internal/config"
)

func GetSessionHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		filename := r.PathValue("filename")
		if filename == "" {
			http.Error(w, "Filename is required", http.StatusBadRequest)
			return
		}

		dir, err := os.Getwd()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Construct the full path to the session file
		filePath := filepath.Join(dir, cfg.DefaultOutputDirectory, filename)

		// Read the session file
		data, err := os.ReadFile(filePath)
		if err != nil {
			if os.IsNotExist(err) {
				http.Error(w, "Session not found", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Parse the JSON data
		var questions []map[string]interface{}
		if err := json.Unmarshal(data, &questions); err != nil {
			http.Error(w, "Invalid session file format", http.StatusBadRequest)
			return
		}

		// Return the session data
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"questions": questions,
		})
	}
}
