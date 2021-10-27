package utils

import (
	"crypto/tls"

	"github.com/jordanknott/taskcafe/internal/config"
	hermes "github.com/matcornic/hermes/v2"
	gomail "gopkg.in/mail.v2"
)

type EmailInvite struct {
	ConfirmToken string
	FullName     string
	To           string
}

func SendEmailInvite(cfg config.EmailConfig, invite EmailInvite) error {
	h := hermes.Hermes{
		Product: hermes.Product{
			Name: "Taskscafe",
			Link: cfg.SiteURL,
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
						Link:      cfg.SiteURL + "/register?confirmToken=" + invite.ConfirmToken,
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
	m.SetHeader("From", cfg.From)

	// Set E-Mail receivers
	m.SetHeader("To", invite.To)

	// Set E-Mail subject
	m.SetHeader("Subject", "You have been invited to Taskcafe")

	// Set E-Mail body. You can set plain text or html with text/html
	m.SetBody("text/html", emailBody)
	m.AddAlternative("text/plain", emailBodyPlain)

	// Settings for SMTP server
	d := gomail.NewDialer(cfg.Host, cfg.Port, cfg.Username, cfg.Password)

	// This is only needed when SSL/TLS certificate is not valid on server.
	// In production this should be set to false.
	d.TLSConfig = &tls.Config{InsecureSkipVerify: cfg.InsecureSkipVerify}

	// Now send E-Mail
	if err := d.DialAndSend(m); err != nil {
		return err
	}
	return nil
}
