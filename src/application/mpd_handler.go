package main

import (
	"fmt"
	"github.com/google/generative-ai-go/genai"
)

func HandleMillionPoundDrop(client *genai.Client, cfg *Config) {
	gemini := client.GenerativeModel(cfg.GeminiModel)
	gemini.SetTemperature(1)
	gemini.SetTopK(64)
	gemini.SetTopP(0.95)
	gemini.SetMaxOutputTokens(8192)
	gemini.ResponseMIMEType = "application/json"
	fmt.Println("Handle Million Pound Drop")

	// old code from PoC - here atm for reference
	//for {
	//	fmt.Print("> ")
	//	input, err := reader.ReadString('\n')
	//	if err != nil {
	//		fmt.Fprintln(os.Stderr, "Error reading input:", err)
	//		continue
	//	}
	//
	//	// Process the input
	//	if strings.TrimSpace(input) == "exit" {
	//		fmt.Println("Exiting...")
	//		break
	//	}
	//
	//	resp, gemErr := geminiModel.GenerateContent(ctx, genai.Text(input))
	//	if gemErr != nil {
	//		fmt.Fprintln(os.Stderr, "Error generating response:", gemErr.Error())
	//	}
	//
	//	for _, part := range resp.Candidates[0].Content.Parts {
	//		fmt.Printf("%v\n", part)
	//	}
	//}
}
