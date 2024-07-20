from flask_restful import Resource
from flask import request, jsonify
from config.extensions import db
from models.notifications import *
from utils.helpers import token_responsible_required

class ListUnreadNotifications(Resource):
    @token_responsible_required
    def get(self):
        try:
            responsible_id = request.user_info['user_id']
            unread_notifications = WasteNotification.query.join(waste_notification_receivers).filter(
                waste_notification_receivers.c.responsible_id == responsible_id,
                waste_notification_receivers.c.has_seen == False
            ).all()
            return {
                'message': 'Fetched unread notifications',
                'notifications': [notification.to_dict() for notification in unread_notifications]
            }, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ListReceivedNotifications(Resource):
    @token_responsible_required
    def get(self):
        try:
            responsible_id = request.user_info['user_id']
            notifications = db.session.query(
                WasteNotification,
                waste_notification_receivers.c.has_seen
            ).join(waste_notification_receivers).filter(
                waste_notification_receivers.c.responsible_id == responsible_id
            ).all()

            response_data = []
            for notification, has_seen in notifications:
                notification_dict = notification.to_dict()
                notification_dict['has_seen'] = has_seen
                response_data.append(notification_dict)

            return {
                'message': 'Fetched all received notifications',
                'notifications': response_data
            }, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
