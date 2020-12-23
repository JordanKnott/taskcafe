package utils

import (
	"crypto/tls"

	hermes "github.com/matcornic/hermes/v2"
	gomail "gopkg.in/mail.v2"
)

type EmailConfig struct {
	Host               string
	Port               int
	From               string
	Username           string
	Password           string
	SiteURL            string
	InsecureSkipVerify bool
}

type EmailInvite struct {
	ConfirmToken string
	FullName     string
	To           string
}

func SendEmailInvite(config EmailConfig, invite EmailInvite) error {
	h := hermes.Hermes{
		Product: hermes.Product{
			Name: "Taskscafe",
			Link: config.SiteURL,
			Logo: "https://github.com/JordanKnott/taskcafe/raw/master/.github/taskcafe-full.png",
		},
	}

	email := hermes.Email{
		Body: hermes.Body{
			Name: invite.FullName,
			Intros: []string{
				"You have been invited to join Taskcafe",
			},
			Actions: []hermes.Action{
				{
					Instructions: "To get started with Taskcafe, please click here:",
					Button: hermes.Button{
						Color:     "#7367F0", // Optional action button color
						TextColor: "#FFFFFF",
						Text:      "Register your account",
						Link:      config.SiteURL + "/register?confirmToken=" + invite.ConfirmToken,
					},
				},
			},
			Outros: []string{
				"Need help, or have questions? Just reply to this email, we'd love to help.",
			},
		},
	}

	emailBody, err := h.GenerateHTML(email)
	if err != nil {
		return err
	}
	emailBodyPlain, err := h.GeneratePlainText(email)
	if err != nil {
		return err
	}

	m := gomail.NewMessage()

	// Set E-Mail sender
	m.SetHeader("From", config.From)

	// Set E-Mail receivers
	m.SetHeader("To", invite.To)

	// Set E-Mail subject
	m.SetHeader("Subject", "You have been invited to Taskcafe")

	// Set E-Mail body. You can set plain text or html with text/html
	m.SetBody("text/html", emailBody)
	m.AddAlternative("text/plain", emailBodyPlain)

	// Settings for SMTP server
	d := gomail.NewDialer(config.Host, config.Port, config.Username, config.Password)

	// This is only needed when SSL/TLS certificate is not valid on server.
	// In production this should be set to false.
	d.TLSConfig = &tls.Config{InsecureSkipVerify: config.InsecureSkipVerify}

	// Now send E-Mail
	if err := d.DialAndSend(m); err != nil {
		return err
	}
	return nil
}
