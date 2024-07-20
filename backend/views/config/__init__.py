import os
from dotenv import load_dotenv
from config.database import db_uri

load_dotenv()

def configure_app(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
    app.config['PROFILE_FOLDER'] = os.path.join(app.config['UPLOAD_FOLDER'], 'profiles')
    app.config['WASTE_FOLDER'] = os.path.join(app.config['UPLOAD_FOLDER'], 'images/waste')
    os.makedirs(app.config['PROFILE_FOLDER'], exist_ok=True)
    os.makedirs(app.config['WASTE_FOLDER'], exist_ok=True)
    # Configure Flask-Mail
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
