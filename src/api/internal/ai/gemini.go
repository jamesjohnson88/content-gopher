package ai

import "github.com/google/generative-ai-go/genai"

func ConfigureForCreativeQuizContent(gm *genai.GenerativeModel) *genai.GenerativeModel {
	gm.SetTemperature(1.5)
	gm.SetTopK(100)
	gm.SetTopP(0.95)
	gm.SetMaxOutputTokens(8192)
	gm.ResponseMIMEType = "application/json"
	return gm
}

func ConfigureForFactChecking(gm *genai.GenerativeModel) *genai.GenerativeModel {
	gm.SetTemperature(0.1)
	gm.SetTopK(40)
	gm.SetTopP(0.8)
	gm.SetMaxOutputTokens(8192)
	gm.ResponseMIMEType = "application/json"
	return gm
}

func GetContentFromCandidates(c []*genai.Candidate) string {
	var contentText string
	if len(c) > 0 && len(c[0].Content.Parts) > 0 {
		if textValue, ok := c[0].Content.Parts[0].(genai.Text); ok {
			contentText = string(textValue)
		}
	}
	return contentText
}
