from flask_restful import Resource
from flask import request, jsonify
from config.extensions import db
from models.notifications import *
from models.user import User
from utils.helpers import token_required

class ListReceivedNotifications(Resource):
    @token_required
    def get(self):
        try:
            user_id = request.user_info['user_id']
            
            # Fetch notifications received by the responsible user
            waste_notifications = db.session.query(WasteNotification).join(
                waste_notification_receivers
            ).filter(waste_notification_receivers.c.responsible_id == user_id).all()
            
            water_shortage_notifications = db.session.query(WaterShortageNotification).join(
                water_shortage_notification_receivers
            ).filter(water_shortage_notification_receivers.c.responsible_id == user_id).all()

            # Format the response
            response = {
                "waste_notification_list": [
                    {
                        "id_notification": n.id_notification,
                        "description": n.description,
                        "created_at": n.created_at
                    } for n in waste_notifications
                ],
                "water_shortage_notification_list": [
                    {
                        "id_notification": n.id_notification,
                        "description": n.description,
                        "created_at": n.created_at
                    } for n in water_shortage_notifications
                ]
            }

            return jsonify(response), 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ListUnreadNotifications(Resource):
    @token_required
    def get(self):
        try:
            user_id = request.user_info['user_id']
            
            # Fetch notifications that are not viewed by the responsible user
            waste_notifications = db.session.query(WasteNotification).join(
                waste_notification_views
            ).filter(waste_notification_views.c.responsible_id == user_id).filter(
                waste_notification_views.c.views == 0
            ).all()
            
            water_shortage_notifications = db.session.query(WaterShortageNotification).join(
                water_shortage_notification_views
            ).filter(water_shortage_notification_views.c.responsible_id == user_id).filter(
                water_shortage_notification_views.c.views == 0
            ).all()

            # Format the response
            response = {
                "waste_notification_list": [
                    {
                        "id_notification": n.id_notification,
                        "description": n.description,
                        "created_at": n.created_at
                    } for n in waste_notifications
                ],
                "water_shortage_notification_list": [
                    {
                        "id_notification": n.id_notification,
                        "description": n.description,
                        "created_at": n.created_at
                    } for n in water_shortage_notifications
                ]
            }

            return jsonify(response), 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
