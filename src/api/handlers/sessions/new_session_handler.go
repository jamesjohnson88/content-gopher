package sessions

import (
	"encoding/json"
	"github.com/davecgh/go-spew/spew"
	"github.com/jamesjohnson88/content-gopher/internal/config"
	"github.com/jamesjohnson88/content-gopher/models/sessions"
	"net/http"
	"os"
	"path/filepath"
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

		// todo - need a filename normalizing function
		err = os.WriteFile(outDir+"/test.json", []byte("{ 'test': true }"), 0644)

		spew.Dump(os.DirFS(outDir))
	}
}

// also todo - prevent file overwrites...

// todo
func filename(input string) string {
	return ""
}
