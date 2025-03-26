package sessions

type FormatDataProvider interface {
	Filename() string
	ContentFormat() string
	MetaData() map[string]string
}

type Session struct {
	SessionFileName string            `json:"sessionFileName"`
	ContentFormat   string            `json:"contentFormat"`
	Metadata        map[string]string `json:"metadata"`
}

func NewSession(cfg FormatDataProvider) *Session {
	return &Session{
		SessionFileName: cfg.Filename(),
		ContentFormat:   cfg.ContentFormat(),
		Metadata:        cfg.MetaData(),
	}
}
