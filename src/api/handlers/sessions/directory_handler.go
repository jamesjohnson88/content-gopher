package sessions

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"github.com/jamesjohnson88/content-gopher/internal/config"
)

type DirectoryInfo struct {
	Path  string   `json:"path"`
	Files []string `json:"files"`
}

func DirectoryHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dir, err := os.Getwd()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		outDir := filepath.Join(dir, cfg.DefaultOutputDirectory)
		if _, err = os.Stat(outDir); os.IsNotExist(err) {
			// If directory doesn't exist, return empty list
			info := DirectoryInfo{
				Path:  outDir,
				Files: []string{},
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(info)
			return
		}

		entries, err := os.ReadDir(outDir)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var files []string
		for _, entry := range entries {
			if !entry.IsDir() && filepath.Ext(entry.Name()) == ".json" {
				files = append(files, entry.Name())
			}
		}

		info := DirectoryInfo{
			Path:  outDir,
			Files: files,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(info)
	}
}
