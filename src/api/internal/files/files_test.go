package files

import (
	"testing"
)

func TestSanitizeFileName(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
		hasError bool
	}{
		{
			name:     "Basic valid filename",
			input:    "myfile.txt",
			expected: "myfile.txt",
			hasError: false,
		},
		{
			name:     "Filename with spaces",
			input:    "my file.txt",
			expected: "my_file.txt",
			hasError: false,
		},
		{
			name:     "Filename with invalid characters",
			input:    "my<file>.txt",
			expected: "myfile.txt",
			hasError: false,
		},
		{
			name:     "Filename with all invalid characters",
			input:    "<>:\"/\\|?*'",
			expected: "",
			hasError: true,
		},
		{
			name:     "Filename with leading/trailing spaces",
			input:    "  myfile.txt  ",
			expected: "myfile.txt",
			hasError: false,
		},
		{
			name:     "Empty filename",
			input:    "",
			expected: "",
			hasError: true,
		},
		{
			name:     "Filename with multiple spaces",
			input:    "my  file  name.txt",
			expected: "my__file__name.txt",
			hasError: false,
		},
		{
			name:     "Filename with mixed valid and invalid characters",
			input:    "my*file:name?.txt",
			expected: "myfilename.txt",
			hasError: false,
		},
		{
			name:     "Filename with quotes",
			input:    "my'file\".txt",
			expected: "myfile.txt",
			hasError: false,
		},
		{
			name:     "Filename with backslashes",
			input:    "my\\file/name.txt",
			expected: "myfilename.txt",
			hasError: false,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result, err := SanitizeFileName(test.input)
			if test.hasError && err == nil {
				t.Errorf("Expected an error but got none")
			}
			if !test.hasError && err != nil {
				t.Errorf("Expected no error but got: %v", err)
			}
			if !test.hasError && result != test.expected {
				t.Errorf("Expected %q but got %q", test.expected, result)
			}
		})
	}
}

func TestSanitizeFileName_ErrorMessage(t *testing.T) {
	_, err := SanitizeFileName("<>:\"/\\|?*'")
	expectedErrorMsg := "resulting filename contained no valid characters"
	if err == nil || err.Error() != expectedErrorMsg {
		t.Errorf("Expected error with message %q but got: %v", expectedErrorMsg, err)
	}
}

func BenchmarkSanitizeFileName(b *testing.B) {
	testInput := "my<complicated>:file\"name/with\\many|invalid?characters*.txt'"
	for i := 0; i < b.N; i++ {
		_, _ = SanitizeFileName(testInput)
	}
}
