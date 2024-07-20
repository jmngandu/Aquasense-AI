from config.extensions import db
from datetime import datetime

# Association table for receivers in WasteNotification
waste_notification_receivers = db.Table('waste_notification_receivers',
    db.Column('id', db.Integer, autoincrement=True, primary_key=True),
    db.Column('waste_notification_id', db.Integer, db.ForeignKey('waste_notification.id_notification')),
    db.Column('responsible_id', db.Integer, db.ForeignKey('responsible.id_responsible'))
)

# Association table for views in WasteNotification
waste_notification_views = db.Table('waste_notification_views',
    db.Column('id', db.Integer, autoincrement=True, primary_key=True),
    db.Column('waste_notification_id', db.Integer, db.ForeignKey('waste_notification.id_notification')),
    db.Column('responsible_id', db.Integer, db.ForeignKey('responsible.id_responsible'))
)

# Association table for receivers in WaterShortageNotification
water_shortage_notification_receivers = db.Table('water_shortage_notification_receivers',
    db.Column('id', db.Integer, autoincrement=True, primary_key=True),
    db.Column('water_shortage_notification_id', db.Integer, db.ForeignKey('water_shortage_notification.id_notification')),
    db.Column('responsible_id', db.Integer, db.ForeignKey('responsible.id_responsible'))
)

# Association table for views in WaterShortageNotification
water_shortage_notification_views = db.Table('water_shortage_notification_views',
    db.Column('id', db.Integer, autoincrement=True, primary_key=True),
    db.Column('water_shortage_notification_id', db.Integer, db.ForeignKey('water_shortage_notification.id_notification')),
    db.Column('responsible_id', db.Integer, db.ForeignKey('responsible.id_responsible'))
)


class Notification(db.Model):
    __abstract__ = True
    id_notification = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WasteNotification(Notification):
    __tablename__ = 'waste_notification'
    id_waste = db.Column(db.Integer, db.ForeignKey('waste.id_waste'))

class WaterShortageNotification(Notification):
    __tablename__ = 'water_shortage_notification'
    id_water_shortage = db.Column(db.Integer, db.ForeignKey('water_shortage.id_water_shortage'))
