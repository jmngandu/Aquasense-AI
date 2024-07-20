from config.extensions import db 
from datetime import datetime

UPLOAD_FOLDER = 'uploads'
PROFILE_FOLDER = 'uploads/profiles'
DEFAULT_PROFILE_IMAGE = 'default_profile.jpg'

class UserTemplate(db.Model):
    __abstract__ = True
    username = db.Column(db.String(150), unique=True, nullable=False)
    profile = db.Column(db.String(255), default=f'{PROFILE_FOLDER}/{DEFAULT_PROFILE_IMAGE}')
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'username': self.username,
            'profile': self.profile,
            'email': self.email,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class User(UserTemplate):
    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    score = db.Column(db.Integer, default=0)

    def to_dict(self):
        data = super().to_dict()
        data.update({
            'id_user': self.id_user,
            'score': self.score
        })
        return data

class Responsible(UserTemplate):
    __tablename__ = 'responsible'
    id_responsible = db.Column(db.Integer, autoincrement=True, primary_key=True)
    id_subscription = db.Column(db.Integer, db.ForeignKey('subscription.id_subscription'))
    is_activated = db.Column(db.Boolean, default=False)
    activity_type = db.Column(db.String(100), nullable=False)
    activity_domain = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, default='')
    last_subscription = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'responsible',
    }

    def to_dict(self):
        data = super().to_dict()
        data.update({
            'id_responsible': self.id_responsible,
            'id_subscription': self.id_subscription,
            'is_activated': self.is_activated,
            'activity_type': self.activity_type,
            'activity_domain': self.activity_domain,
            'description': self.description,
            'last_subscription': self.last_subscription.strftime('%Y-%m-%d %H:%M:%S')
        })
        return data