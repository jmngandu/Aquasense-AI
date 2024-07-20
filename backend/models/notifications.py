from config.extensions import db
from datetime import datetime

waste_notification_receivers = db.Table('waste_notification_receivers',
    db.Column('id', db.Integer, autoincrement=True, primary_key=True),
    db.Column('waste_notification_id', db.Integer, db.ForeignKey('waste_notification.id_notification')),
    db.Column('responsible_id', db.Integer, db.ForeignKey('responsible.id_responsible')),
    db.Column('has_seen', db.Boolean, default=False)
)

water_shortage_notification_receivers = db.Table('water_shortage_notification_receivers',
    db.Column('id', db.Integer, autoincrement=True, primary_key=True),
    db.Column('water_shortage_notification_id', db.Integer, db.ForeignKey('water_shortage_notification.id_notification')),
    db.Column('responsible_id', db.Integer, db.ForeignKey('responsible.id_responsible')),
    db.Column('has_seen', db.Boolean, default=False)
)

class Notification(db.Model):
    __abstract__ = True
    id_notification = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WasteNotification(Notification):
    __tablename__ = 'waste_notification'
    id_waste = db.Column(db.Integer, db.ForeignKey('waste.id_waste'))

    def to_dict(self):
        return {
            'id_notification': self.id_notification,
            'description': self.description,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'id_waste': self.id_waste
        }

class WaterShortageNotification(Notification):
    __tablename__ = 'water_shortage_notification'
    id_water_shortage = db.Column(db.Integer, db.ForeignKey('water_shortage.id_water_shortage'))

    def to_dict(self):
        return {
            'id_notification': self.id_notification,
            'description': self.description,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'id_water_shortage': self.id_water_shortage
        }
