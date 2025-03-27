package multiple_choice_question

import (
	"fmt"
	"github.com/google/generative-ai-go/genai"
	. "github.com/jamesjohnson88/content-gopher/models/content_types/multiple_choice_question"
	s "github.com/jamesjohnson88/content-gopher/models/sessions"
)

func GetSessionConfigOptions() interface{} {
	return struct {
		FormatType string          `json:"formatType"`
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
		//DifficultyOptions: map[string]s.SessionOptionSelection{
		//	"Difficulty": {
		//		s.NewSessionOptionSelection("Easy", string(DifficultyVeryEasy)),
		//		//string(DifficultyVeryEasy),
		//		//string(DifficultyEasy):   "Easy",
		//		//string(DifficultyMedium): "Medium",
		//		//string(DifficultyHard):   "Hard"},
		//	},
		//},
		//CategoryOptions: map[string]s.SessionOptionSelection{
		//	string(CategoryMixed):               "Mixed",
		//	string(CategoryGeneralKnowledge):    "General Knowledge",
		//	string(CategoryScienceNature):       "Science & Nature",
		//	string(CategoryHistoryPolitics):     "History & Politics",
		//	string(CategoryGeography):           "Geography",
		//	string(CategoryEntertainment):       "Entertainment & Pop Culture",
		//	string(CategorySportsGames):         "Sports & Games",
		//	string(CategoryComputerScienceTech): "Computer Science & Technology",
		//	string(CategoryMathematicsLogic):    "Mathematics & Logic",
		//	string(CategoryFoodDrink):           "Food & Drink",
		//	string(CategoryMythologyReligion):   "Mythology & Religion",
		//	string(CategorySpaceAstronomy):      "Space & Astronomy",
		//	string(CategoryArtDesign):           "Art & Design",
		//},
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
