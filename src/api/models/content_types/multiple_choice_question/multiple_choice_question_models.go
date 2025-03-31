package multiple_choice_question

import "github.com/google/uuid"

// todo - this is all quick and dirty and should probably use some form of map instead in future

type Category string
type Difficulty string

type MultipleChoiceQuestion struct {
	Id              uuid.UUID      `json:"id"`
	Category        Category       `json:"category"`
	Difficulty      Difficulty     `json:"difficulty"`
	Text            string         `json:"text"`
	PossibleAnswers map[int]string `json:"possibleAnswers"`
	CorrectAnswer   int            `json:"correctAnswer"`
}

const (
	Title      string = "Multiple Choice Question"
	FormatType string = "multiple_choice_question"

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

	// CategoriesList is for use within prompts to outline the available question categories when creating the content
	CategoriesList = "" +
		"general_knowledge, science_nature, history_politics, geography, entertainment, " +
		"sports_games, computer_science_tech, mathematics_logic, food_drink, " +
		"mythology_religion, space_astronomy, art_design"

	DifficultyMixed    Difficulty = "mixed"
	DifficultyVeryEasy Difficulty = "very_easy"
	DifficultyEasy     Difficulty = "easy"
	DifficultyMedium   Difficulty = "medium"
	DifficultyHard     Difficulty = "hard"
	DifficultyVeryHard Difficulty = "very_hard"

	// DifficultiesList is for use within prompts to outline the available difficulty levels when creating the content
	DifficultiesList = "very_easy, easy, medium, hard, very_hard"
)

func (c *Category) IsValid() bool {
	switch *c {
	case CategoryMixed, CategoryArtDesign, CategoryComputerScienceTech,
		CategoryEntertainment, CategoryFoodDrink, CategoryGeneralKnowledge,
		CategoryGeography, CategoryHistoryPolitics, CategoryMathematicsLogic,
		CategoryMythologyReligion, CategoryScienceNature,
		CategorySpaceAstronomy, CategorySportsGames:
		return true
	}
	return false
}

func (d *Difficulty) IsValid() bool {
	switch *d {
	case DifficultyMixed, DifficultyVeryEasy, DifficultyEasy,
		DifficultyMedium, DifficultyHard, DifficultyVeryHard:
		return true
	}
	return false
}
