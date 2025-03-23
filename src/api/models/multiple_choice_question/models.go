package multiple_choice_question

type Category string
type Difficulty string

const (
	CategoryGeneralKnowledge    = "General Knowledge"
	CategoryScienceNature       = "Science & Nature"
	CategoryHistoryPolitics     = "History & Politics"
	CategoryGeography           = "Geography"
	CategoryEntertainment       = "Entertainment & Pop Culture"
	CategorySportsGames         = "Sports & Games"
	CategoryComputerScienceTech = "Computer Science & Technology"
	CategoryMathematicsLogic    = "Mathematics & Logic"
	CategoryFoodDrink           = "Food & Drink"
	CategoryMythologyReligion   = "Mythology & Religion"
	CategorySpaceAstronomy      = "Space & Astronomy"
	CategoryArtDesign           = "Art & Design"

	CategoriesList = "General Knowledge, Science & Nature, History & Politics, Geography, Entertainment & Pop Culture, " +
		"Sports & Games, Computer Science & Technology, Mathematics & Logic, Food & Drink, " +
		"Mythology & Religion, Space & Astronomy, Art & Design"

	DifficultyVeryEasy Difficulty = "very_easy"
	DifficultyEasy     Difficulty = "easy"
	DifficultyMedium   Difficulty = "medium"
	DifficultyHard     Difficulty = "hard"
)

type MillionPoundDropQuestion struct {
	Id              string         `json:"id"`
	Category        Category       `json:"category"`
	Difficulty      Difficulty     `json:"difficulty"`
	Text            string         `json:"text"`
	PossibleAnswers map[int]string `json:"possibleAnswers"`
	CorrectAnswer   int            `json:"correctAnswer"`
}

// example
var prompt = `Acting as a content creator for fun and engaging quizzes, 
	you must create a question that conforms to the following JSON model:

	{
		"category": "Geography",
		"difficulty": "very easy",
		"text": "What is the capital of France?",
		"possibleAnswers": {
		"1": "Paris",
		"2": "London",
		"3": "Rome",
		"4": "Berlin"
	},
		"correctAnswer": 1
	}

	The available categories are: General Knowledge, Science & Nature, History & Politics, Geography, Entertainment & Pop Culture, 
	Sports & Games, Computer Science & Technology, Mathematics & Logic, Food & Drink, Mythology & Religion, Space & Astronomy, Art & Design`

/*
  Example:

	  {
		"id": "1d1f9ae2-5c88-4b5c-8bbd-32f5d6243e42",
		"category": "Geography",
		"difficulty": "very easy",
		"text": "What is the capital of France?",
		"possibleAnswers": {
		  "1": "Paris",
		  "2": "London",
		  "3": "Rome",
		  "4": "Berlin"
		},
		"correctAnswer": 1
	  }
*/
