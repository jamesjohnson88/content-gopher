package ai

import "github.com/google/generative-ai-go/genai"

func ConfigureForFactualJsonContent(gm *genai.GenerativeModel) *genai.GenerativeModel {
	gm.SetTemperature(1)
	gm.SetTopK(64)
	gm.SetTopP(0.95)
	gm.SetMaxOutputTokens(8192)
	gm.ResponseMIMEType = "application/json"
	return gm
}
