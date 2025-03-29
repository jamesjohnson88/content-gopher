package sessions

import (
	"encoding/json"
	"fmt"
	"github.com/davecgh/go-spew/spew"
	"github.com/jamesjohnson88/content-gopher/internal/config"
	"github.com/jamesjohnson88/content-gopher/internal/files"
	"github.com/jamesjohnson88/content-gopher/models/sessions"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func NewSessionHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var newSession = sessions.Session{}
		err := json.NewDecoder(r.Body).Decode(&newSession)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		spew.Dump(newSession)

		dir, err := os.Getwd()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		outDir := filepath.Join(dir, cfg.DefaultOutputDirectory)
		if _, err = os.Stat(outDir); os.IsNotExist(err) {
			mdErr := os.Mkdir(outDir, 0755)
			if mdErr != nil {
				http.Error(w, mdErr.Error(), http.StatusInternalServerError)
				return
			}
		}

		filePath, err := createFilename(newSession.SessionName, outDir)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = os.WriteFile(filePath, []byte("{ 'test': true }"), 0644)
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

func createFilename(filename, dir string) (string, error) {
	filename, err := files.SanitizeFileName(filename)
	if err != nil {
		return "", err
	}

	return uniqueFilename(fmt.Sprintf("%s/%s.json", dir, filename)), nil
}

func uniqueFilename(base string) string {
	count := 1
	ext := ""
	name := base

	if dot := strings.LastIndex(base, "."); dot != -1 {
		name = base[:dot]
		ext = base[dot:]
	}

	for {
		if _, err := os.Stat(base); os.IsNotExist(err) {
			return base
		}
		base = fmt.Sprintf("%s_%d%s", name, count, ext)
		count++
	}
}
