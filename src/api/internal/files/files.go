package files

import (
	"errors"
	"regexp"
	"strings"
)

// SanitizeFileName removes invalid characters and trims spaces
func SanitizeFileName(name string) (string, error) {
	invalidChars := regexp.MustCompile(`[<>:"/\\|?*']`)

	name = invalidChars.ReplaceAllString(name, "")
	name = strings.TrimSpace(name)
	name = strings.ReplaceAll(name, " ", "_")

	if name == "" {
		return "", errors.New("resulting filename contained no valid characters")
	}

	return name, nil
}
