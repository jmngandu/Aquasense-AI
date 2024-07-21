from flask_mail import Message
from flask import current_app
import datetime


def send_waste_email(mail_receiver, name_receiver, link, button_content_link):
    mail = current_app.extensions['mail']
    subject = "Nouvelle publication de déchet"

    current_year = datetime.datetime.now().year
    html_body = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #333;
                background-color: #e9ecef;
                margin: 0;
                padding: 0;
            }}
            .container {{
                width: 70%;
                margin: auto;
                padding: 20px;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }}
            h1 {{
                color: #17a2b8;
                font-size: 24px;
                border-bottom: 2px solid #17a2b8;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }}
            a {{
                color: #ffffff;
                text-decoration: none;
            }}
            .button {{
                display: inline-block;
                padding: 12px 25px;
                font-size: 16px;
                color: #ffffff;
                background-color: #17a2b8;
                border-radius: 5px;
                text-align: center;
                text-decoration: none;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 12px;
                color: #6c757d;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Bonjour {name_receiver},</h1>
            <p>Un nouveau déchet a été publié sur la plateforme. Vous pouvez consulter les détails en suivant le lien ci-dessous :</p>
            <p><a href="{link}" class="button">{button_content_link}</a></p>
            <p>Merci de votre attention.</p>
            <p>Cordialement,<br>L'équipe de support</p>
        </div>
        <div class="footer">
            &copy; {current_year} Votre Entreprise. Tous droits réservés.
        </div>
    </body>
    </html>
    """

    msg = Message(subject=subject,
                  recipients=[mail_receiver],
                  html=html_body)

    try:
        mail.send(msg)
        print('Email sent successfully...')
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {e}")
        return False
