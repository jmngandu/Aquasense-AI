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
            'is_checked': self.is_checked,
            'id_user': self.id_user,
            'longitude': self.longitude,
            'latitude': self.latitude,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
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
            'quality': self.quality,
            'quantity': self.quantity,
            'last_alert': self.last_alert.strftime('%Y-%m-%d %H:%M:%S'),
            'created_at':self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        
class IoTDevice(LocationBase):
    __tablename__ = 'iot_device'
    id_device = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id_user'))

    def to_dict(self):
        return {
            'id_device': self.id_device,
            'id_user': self.id_user,
            'longitude': self.longitude,
            'latitude': self.latitude
        }

class WaterData(db.Model):
    __tablename__ = 'water_data'
    id_water_data = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_device = db.Column(db.Integer, db.ForeignKey('iot_device.id_device'))
    flow_rate = db.Column(db.Float)
    water_level = db.Column(db.Float)
    pump_status = db.Column(db.String(50))  # e.g., Operational, Not Operational
    quantity = db.Column(db.Float)
    rainfall = db.Column(db.Float)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id_water_data': self.id_water_data,
            'id_device': self.id_device,
            'flow_rate': self.flow_rate,
            'water_level': self.water_level,
            'pump_status': self.pump_status,
            'quantity': self.quantity,
            'rainfall': self.rainfall,
            'temperature': self.temperature,
            'humidity': self.humidity,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
        
class WaterQuality(db.Model):
    __tablename__ = 'water_quality'
    id_water_quality = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_device = db.Column(db.Integer, db.ForeignKey('iot_device.id_device'))
    ph = db.Column(db.Float)
    hardness = db.Column(db.Float)
    solids = db.Column(db.Float)
    chloramines = db.Column(db.Float)
    sulfate = db.Column(db.Float)
    conductivity = db.Column(db.Float)
    organic_carbon = db.Column(db.Float)
    trihalomethanes = db.Column(db.Float)
    turbidity = db.Column(db.Float)
    potability = db.Column(db.Integer, default=0)  # 0 for non-potable, 1 for potable
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id_water_quality': self.id_water_quality,
            'ph': self.ph,
            'hardness': self.hardness,
            'solids': self.solids,
            'chloramines': self.chloramines,
            'sulfate': self.sulfate,
            'conductivity': self.conductivity,
            'organic_carbon': self.organic_carbon,
            'trihalomethanes': self.trihalomethanes,
            'turbidity': self.turbidity,
            'potability': self.potability,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'id_device': self.id_device
        }