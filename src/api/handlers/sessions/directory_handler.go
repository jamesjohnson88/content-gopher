package sessions

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/jamesjohnson88/content-gopher/internal/config"
)

type SessionInfo struct {
	Filename      string   `json:"filename"`
	Name          string   `json:"name"`
	Type          string   `json:"type"`
	Categories    []string `json:"categories"`
	Difficulties  []string `json:"difficulties"`
	QuestionCount int      `json:"questionCount"`
}

type DirectoryInfo struct {
	Path     string        `json:"path"`
	Sessions []SessionInfo `json:"sessions"`
}

func DirectoryHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dir, err := os.Getwd()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		outDir := filepath.Join(dir, cfg.DefaultOutputDirectory)
		slog.Info("outDir", slog.String("outDir", outDir))

		if _, err = os.Stat(outDir); os.IsNotExist(err) {
			// If directory doesn't exist, return empty list
			info := DirectoryInfo{
				Path:     outDir,
				Sessions: []SessionInfo{},
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(info)
			return
		}

		// Get all subdirectories (question types)
		typeDirs, err := os.ReadDir(outDir)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var sessions []SessionInfo
		for _, typeDir := range typeDirs {
			if !typeDir.IsDir() {
				continue // Skip non-directory entries
			}

			questionType := typeDir.Name()
			typePath := filepath.Join(outDir, questionType)

			// Read all JSON files in this type directory
			entries, err := os.ReadDir(typePath)
			if err != nil {
				continue // Skip directories we can't read
			}

			for _, entry := range entries {
				if !entry.IsDir() && filepath.Ext(entry.Name()) == ".json" {
					// Read and analyze the session file
					filePath := filepath.Join(typePath, entry.Name())
					data, err := os.ReadFile(filePath)
					if err != nil {
						continue // Skip files we can't read
					}

					var questions []map[string]interface{}
					if err := json.Unmarshal(data, &questions); err != nil {
						continue // Skip invalid JSON files
					}

					// Analyze the questions
					categories := make(map[string]bool)
					difficulties := make(map[string]bool)
					for _, q := range questions {
						if cat, ok := q["category"].(string); ok {
							categories[cat] = true
						}
						if diff, ok := q["difficulty"].(string); ok {
							difficulties[diff] = true
						}
					}

					// Convert maps to slices
					var catSlice []string
					for cat := range categories {
						catSlice = append(catSlice, cat)
					}
					var diffSlice []string
					for diff := range difficulties {
						diffSlice = append(diffSlice, diff)
					}

					// Create session info
					sessionName := strings.TrimSuffix(entry.Name(), ".json")
					sessions = append(sessions, SessionInfo{
						Filename:      filepath.Join(questionType, entry.Name()),
						Name:          sessionName,
						Type:          questionType,
						Categories:    catSlice,
						Difficulties:  diffSlice,
						QuestionCount: len(questions),
					})
				}
			}
		}

		info := DirectoryInfo{
			Path:     outDir,
			Sessions: sessions,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(info)
	}
}
