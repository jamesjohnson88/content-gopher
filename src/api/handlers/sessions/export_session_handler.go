package sessions

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"github.com/jamesjohnson88/content-gopher/internal/config"
)

type ExportSessionRequest struct {
	SessionName   string         `json:"sessionName"`
	ContentFormat string         `json:"contentFormat"`
	Content       map[string]any `json:"content"`
}

func ExportSessionHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req ExportSessionRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		dir, err := os.Getwd()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Create the output directory if it doesn't exist
		outDir := filepath.Join(dir, cfg.DefaultOutputDirectory)
		if _, err = os.Stat(outDir); os.IsNotExist(err) {
			if err := os.Mkdir(outDir, 0755); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		// Create the question type subdirectory
		typeDir := filepath.Join(outDir, req.ContentFormat)
		if _, err = os.Stat(typeDir); os.IsNotExist(err) {
			if err := os.Mkdir(typeDir, 0755); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		// Create filename with session name in the type directory
		filename := filepath.Join(typeDir, req.SessionName+".json")

		// Extract just the questions array from the content
		questions := req.Content["questions"]
		questionsJson, err := json.MarshalIndent(questions, "", "  ")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := os.WriteFile(filename, questionsJson, 0644); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Return success response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Session exported successfully",
			"file":    filename,
		})
	}
}
