package million_pound_drop

type Difficulty string

const (
	VeryEasy Difficulty = "very_easy"
	Easy     Difficulty = "easy"
	Medium   Difficulty = "medium"
	Hard     Difficulty = "hard"
)

type MillionPoundDropQuestion struct {
	Id              string         `json:"id"`
	Category        string         `json:"category"`
	Difficulty      Difficulty     `json:"difficulty"`
	Text            string         `json:"text"`
	PossibleAnswers map[int]string `json:"possibleAnswers"`
	CorrectAnswer   int            `json:"correctAnswer"`
}

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
