from config.extensions import db
from datetime import datetime

class Notification(db.Model):
    __abstract__ = True
    id_notification = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WasteNotification(Notification):
    __tablename__ = 'waste_notification'
    id_responsible = db.Column(db.Integer, db.ForeignKey('responsible.id_user'))
    id_waste = db.Column(db.Integer, db.ForeignKey('waste.id_waste'))

class WaterShortageNotification(Notification):
    __tablename__ = 'water_shortage_notification'
    id_responsible = db.Column(db.Integer, db.ForeignKey('responsible.id_user'))
    id_water_shortage = db.Column(db.Integer, db.ForeignKey('water_shortage.id_water_shortage'))