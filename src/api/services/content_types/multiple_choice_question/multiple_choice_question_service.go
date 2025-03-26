package multiple_choice_question

import (
	"fmt"
	"github.com/google/generative-ai-go/genai"
	. "github.com/jamesjohnson88/content-gopher/models/content_types/multiple_choice_question"
)

func GetSessionConfigOptions() interface{} {
	return struct {
		FormatType        string            `json:"formatType"`
		DifficultyOptions map[string]string `json:"difficultyOptions"`
		CategoryOptions   map[string]string `json:"categoryOptions"`
	}{
		FormatType: "multiple_choice_question",
		DifficultyOptions: map[string]string{
			string(DifficultyVeryEasy): "Very Easy",
			string(DifficultyEasy):     "Easy",
			string(DifficultyMedium):   "Medium",
			string(DifficultyHard):     "Hard",
		},
		CategoryOptions: map[string]string{
			CategoryGeneralKnowledge:    "General Knowledge",
			CategoryScienceNature:       "Science & Nature",
			CategoryHistoryPolitics:     "History & Politics",
			CategoryGeography:           "Geography",
			CategoryEntertainment:       "Entertainment & Pop Culture",
			CategorySportsGames:         "Sports & Games",
			CategoryComputerScienceTech: "Computer Science & Technology",
			CategoryMathematicsLogic:    "Mathematics & Logic",
			CategoryFoodDrink:           "Food & Drink",
			CategoryMythologyReligion:   "Mythology & Religion",
			CategorySpaceAstronomy:      "Space & Astronomy",
			CategoryArtDesign:           "Art & Design",
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
