from flask_restful import Resource
from flask import request
from config.extensions import db
from models.wastewatershortage import *
from models.notifications import *
from models.user import Responsible, User
from utils.helpers import token_required

class PostWasteImage(Resource):
    @token_required
    def post(self):
        try:
            data = request.get_json()
            new_waste = Waste(
                image_waste=data['image_waste'],
                longitude=data['longitude'],
                latitude=data['latitude'],
                id_user=data['id_user']
            )
            db.session.add(new_waste)
            db.session.commit()

            # Notify responsible users
            notification = WasteNotification(
                description="New waste image posted",
                id_waste=new_waste.id_waste
            )
            db.session.add(notification)
            db.session.commit()

            return {'message': 'Waste image posted and notification sent'}, 201
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ListUnreadNotifications(Resource):
    @token_required
    def get(self, responsible_id):
        try:
            unread_notifications = WasteNotification.query.join(waste_notification_receivers).filter(
                waste_notification_receivers.c.responsible_id == responsible_id
            ).all()
            return {'message': 'Fetched unread notifications', 'notifications': [notification.to_dict() for notification in unread_notifications]}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ListUncheckedWaste(Resource):
    @token_required
    def get(self):
        try:
            unchecked_waste = Waste.query.filter_by(is_checked=False).all()
            return {'message': 'Fetched unchecked waste', 'wastes': [waste.to_dict() for waste in unchecked_waste]}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class WasteDetails(Resource):
    @token_required
    def get(self, waste_id):
        try:
            waste = Waste.query.get(waste_id)
            if not waste:
                return {'error': 'Waste not found'}, 404
            return {'message': 'Fetched waste details', 'waste': waste.to_dict()}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class CheckWasteAction(Resource):
    @token_required
    def put(self, waste_id):
        try:
            waste = Waste.query.get(waste_id)
            if not waste:
                return {'error': 'Waste not found'}, 404
            waste.is_checked = True
            db.session.commit()
            return {'message': 'Waste checked'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ListWaterShortages(Resource):
    @token_required
    def get(self):
        try:
            water_shortages = WaterShortage.query.all()
            return {'message': 'Fetched water shortages', 'water_shortages': [ws.to_dict() for ws in water_shortages]}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class WaterShortageDetails(Resource):
    @token_required
    def get(self, water_shortage_id):
        try:
            water_shortage = WaterShortage.query.get(water_shortage_id)
            if not water_shortage:
                return {'error': 'Water shortage not found'}, 404
            return {'message': 'Fetched water shortage details', 'water_shortage': water_shortage.to_dict()}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class LeaderboardResponsibles(Resource):
    @token_required
    def get(self):
        try:
            responsibles = Responsible.query.order_by(Responsible.last_subscription.desc()).all()
            return {'message': 'Fetched leaderboard of active responsibles', 'responsibles': [responsible.to_dict() for responsible in responsibles]}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ActivateResponsibleAccount(Resource):
    @token_required
    def put(self, responsible_id):
        try:
            responsible = Responsible.query.get(responsible_id)
            if not responsible:
                return {'error': 'Responsible not found'}, 404
            responsible.is_activated = True
            db.session.commit()
            return {'message': 'Responsible account activated'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class LeaderboardUsers(Resource):
    @token_required
    def get(self):
        try:
            users = User.query.order_by(User.score.desc()).all()
            return {'message': 'Fetched leaderboard of active users', 'users': [user.to_dict() for user in users]}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
