from config.extensions import db
from datetime import datetime

waste_checkers = db.Table('waste_checkers',
    db.Column('id', db.Integer, autoincrement=True, primary_key=True),
    db.Column('waste_id', db.Integer, db.ForeignKey('waste.id_waste'), primary_key=True),
    db.Column('responsible_id', db.Integer, db.ForeignKey('responsible.id_responsible'), primary_key=True)
)

water_shortage_checkers = db.Table('water_shortage_checkers',
    db.Column('id', db.Integer, autoincrement=True, primary_key=True),
    db.Column('water_shortage_id', db.Integer, db.ForeignKey('water_shortage.id_water_shortage'), primary_key=True),
    db.Column('responsible_id', db.Integer, db.ForeignKey('responsible.id_responsible'), primary_key=True)
)

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
    
    def to_dict(self):
        return {
            'id_waste': self.id_waste,
            'image_waste': self.image_waste,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'latitude': self.latitude,
            'longitude': self.longitude
        }

class WaterShortage(LocationBase):
    __tablename__ = 'water_shortage'
    id_water_shortage = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flow_rate = db.Column(db.Float)
    quality = db.Column(db.String(50))
    quantity = db.Column(db.Float)
    last_alert = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id_water_shortage': self.id_water_shortage,
            'flow_rate': self.flow_rate,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'latitude': self.latitude,
            'longitude': self.longitude,
            'quality':self.quality,
            'quantity': self.quantity
        }