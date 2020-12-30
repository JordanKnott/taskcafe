package utils

var (
	version    = "dev"
	commitHash = "none"
	buildDate  = "unknown"
)

type Info struct {
	Version    string
	CommitHash string
	BuildDate  string
}

func Version() Info {
	return Info{
		Version:    version,
		CommitHash: commitHash,
		BuildDate:  buildDate,
	}
}
