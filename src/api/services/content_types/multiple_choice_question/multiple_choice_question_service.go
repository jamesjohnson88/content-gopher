package multiple_choice_question

import (
	"fmt"
	"github.com/google/generative-ai-go/genai"
	. "github.com/jamesjohnson88/content-gopher/models/content_types/multiple_choice_question"
	s "github.com/jamesjohnson88/content-gopher/models/sessions"
)

func GetSessionConfigOptions() interface{} {
	return struct {
		FormatType string          `json:"formatType"` // todo - move this into model above - then this return type can also be strongly typed
		Difficulty s.SessionOption `json:"difficulty"`
		Category   s.SessionOption `json:"category"`
	}{
		FormatType: "multiple_choice_question",
		Difficulty: s.SessionOption{
			Title: "Difficulty",
			Options: []s.SessionOptionSelection{
				*s.NewSessionOptionSelection("Very Easy", string(DifficultyVeryEasy)),
				*s.NewSessionOptionSelection("Easy", string(DifficultyEasy)),
				*s.NewSessionOptionSelection("Medium", string(DifficultyMedium)),
				*s.NewSessionOptionSelection("Hard", string(DifficultyHard)),
			},
		},
		Category: s.SessionOption{
			Title: "Category",
			Options: []s.SessionOptionSelection{
				*s.NewSessionOptionSelection("Mixed", string(CategoryMixed)),
				*s.NewSessionOptionSelection("Art & Design", string(CategoryArtDesign)),
				*s.NewSessionOptionSelection("Computer Science & Technology", string(CategoryComputerScienceTech)),
				*s.NewSessionOptionSelection("Entertainment & Pop Culture", string(CategoryEntertainment)),
				*s.NewSessionOptionSelection("Food & Drink", string(CategoryFoodDrink)),
				*s.NewSessionOptionSelection("General Knowledge", string(CategoryGeneralKnowledge)),
				*s.NewSessionOptionSelection("Geography", string(CategoryGeography)),
				*s.NewSessionOptionSelection("History & Politics", string(CategoryHistoryPolitics)),
				*s.NewSessionOptionSelection("Mathematics & Logic", string(CategoryMathematicsLogic)),
				*s.NewSessionOptionSelection("Mythology & Religion", string(CategoryMythologyReligion)),
				*s.NewSessionOptionSelection("Science & Nature", string(CategoryScienceNature)),
				*s.NewSessionOptionSelection("Space & Astronomy", string(CategorySpaceAstronomy)),
				*s.NewSessionOptionSelection("Sports & Games", string(CategorySportsGames)),
			},
		},
	}
}

func HandleContentGeneration(gemini *genai.GenerativeModel) {
	gemini.SetTemperature(1)
	gemini.SetTopK(64)
	gemini.SetTopP(0.95)
	gemini.SetMaxOutputTokens(8192)
	gemini.ResponseMIMEType = "api/json"
	fmt.Println("handle multiple_choice question")
}
