package sessions

type FormatDataProvider interface {
	Filename() string
	ContentFormat() string
	MetaData() map[string]string
}

type SessionOption struct {
	Title         string      `json:"title,required"`
	ContentFormat string      `json:"content_format,required"`
	Options       interface{} `json:"options,required"`
}

type SessionOptionSelection struct {
	DisplayName string `json:"displayName,required"`
	Value       string `json:"value,required"`
}

func NewSessionOptionSelection(displayName, value string) *SessionOptionSelection {
	return &SessionOptionSelection{
		DisplayName: displayName,
		Value:       value,
	}
}

type Session struct {
	SessionName   string            `json:"sessionName,required"`
	ContentFormat string            `json:"contentFormat,required"`
	Metadata      map[string]string `json:"metadata"`
}
