from config.extensions import db
from datetime import datetime
class LocationBase(db.Model):
    __abstract__ = True
    longitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Waste(LocationBase):
    __tablename__ = 'waste'
    id_waste = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_waste = db.Column(db.String(255))
    is_checked = db.Column(db.Boolean, default=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id_user'))

class WaterShortage(LocationBase):
    __tablename__ = 'water_shortage'
    id_water_shortage = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flow_rate = db.Column(db.Float)
    quality = db.Column(db.String(50))
    quantity = db.Column(db.Float)
    last_alert = db.Column(db.DateTime, nullable=True)