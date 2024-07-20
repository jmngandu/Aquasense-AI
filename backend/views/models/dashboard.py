from config.extensions import db 
from datetime import datetime
from sqlalchemy.ext.declarative import declared_attr
from models.user import UserTemplate

class SuperAdmin(UserTemplate):
    __tablename__ = 'super_admin'
    id_superadmin = db.Column(db.Integer, primary_key=True, autoincrement=True)
    is_superuser = db.Column(db.Boolean, default=True)

    __mapper_args__ = {
        'polymorphic_identity': 'super_admin',
    }
    
class Subscription(db.Model):
    __tablename__ = 'subscription'

    id_subscription = db.Column(db.Integer, primary_key=True, autoincrement=True)
    version = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    amount = db.Column(db.Float, nullable=False)
    validity_in_month = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Subscription {self.name}>'

    def to_dict(self):
        return {
            'id_subscription': self.id_subscription,
            'version': self.version,
            'name': self.name,
            'description': self.description,
            'amount': self.amount,
            'validity_in_month': self.validity_in_month
        }