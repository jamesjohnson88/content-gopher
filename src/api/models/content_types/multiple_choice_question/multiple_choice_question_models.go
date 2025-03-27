package multiple_choice_question

type Category string
type Difficulty string

const (
	CategoryMixed               Category = "mixed"
	CategoryArtDesign           Category = "art_design"
	CategoryComputerScienceTech Category = "computer_science_tech"
	CategoryEntertainment       Category = "entertainment"
	CategoryFoodDrink           Category = "food_drink"
	CategoryGeneralKnowledge    Category = "general_knowledge"
	CategoryGeography           Category = "geography"
	CategoryHistoryPolitics     Category = "history_politics"
	CategoryMathematicsLogic    Category = "mathematics_logic"
	CategoryMythologyReligion   Category = "mythology_religion"
	CategoryScienceNature       Category = "science_nature"
	CategorySpaceAstronomy      Category = "space_astronomy"
	CategorySportsGames         Category = "sports_games"

	// CategoriesList excludes 'mixed' as it already encompasses the finer grain categories
	CategoriesList = "" +
		"General Knowledge, Science & Nature, History & Politics, Geography, Entertainment & Pop Culture, " +
		"Sports & Games, Computer Science & Technology, Mathematics & Logic, Food & Drink, " +
		"Mythology & Religion, Space & Astronomy, Art & Design"

	DifficultyVeryEasy Difficulty = "very_easy"
	DifficultyEasy     Difficulty = "easy"
	DifficultyMedium   Difficulty = "medium"
	DifficultyHard     Difficulty = "hard"
)

type MultipleChoiceQuestion struct {
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
