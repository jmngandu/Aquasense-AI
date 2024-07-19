from config.extensions import db 
from datetime import datetime

UPLOAD_FOLDER = 'uploads'
PROFILE_FOLDER = 'uploads/profiles'
DEFAULT_PROFILE_IMAGE = 'default_profile.jpg'

class User(db.Model):
    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    profile = db.Column(db.String(255), default=f'{PROFILE_FOLDER}/{DEFAULT_PROFILE_IMAGE}')
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.username}>'
