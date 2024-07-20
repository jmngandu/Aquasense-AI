from flask_restful import Resource
from flask import request, current_app
from config.extensions import db
from models.wastewatershortage import *
from models.notifications import *
from models.user import Responsible, User
from utils.helpers import token_required,allowed_file, token_responsible_required
from werkzeug.utils import secure_filename
import os

class PostWasteImage(Resource):
    @token_required
    def post(self):
        try:
            #request.data = ['longitude', 'latitude']
            #request.files = ['file']
            user_id = request.user_info['user_id']
            if 'file' not in request.files:
                return {'error': 'No file part'}, 400
            file = request.files['file']
            if file.filename == '':
                return {'error': 'No selected file'}, 400
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['WASTE_FOLDER'], filename)
                file.save(file_path)
                
                # Extraire les informations JSON
                longitude = request.form.get('longitude')
                latitude = request.form.get('latitude')
                # Créer une nouvelle entrée pour le modèle Waste
                new_waste = Waste(
                    image_waste=filename,  # Stocker seulement le nom du fichier
                    longitude=longitude,
                    latitude=latitude,
                    id_user=user_id
                )
                db.session.add(new_waste)
                db.session.commit()

                # Notifier les utilisateurs responsables
                notification = WasteNotification(
                    description="New waste image posted",
                    id_waste=new_waste.id_waste
                )
                db.session.add(notification)
                db.session.commit()
                
                # Ajouter tous les responsables comme récepteurs de la notification
                all_responsibles = Responsible.query.all()
                for responsible in all_responsibles:
                    db.session.execute(waste_notification_receivers.insert().values(
                        waste_notification_id=notification.id_notification,
                        responsible_id=responsible.id_responsible
                    ))
                db.session.commit()

                return {'message': 'Waste image posted and notification sent'}, 201
            else:
                return {'error': 'File type not allowed'}, 400
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ListUncheckedWaste(Resource):
    @token_responsible_required
    def get(self):
        try:
            unchecked_waste = Waste.query.filter_by(is_checked=False).all()
            return [waste.to_dict() for waste in unchecked_waste], 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class WasteDetails(Resource):
    @token_responsible_required
    def get(self, waste_id):
        try:
            waste = Waste.query.get(waste_id)
            if not waste:
                return {'error': 'Waste not found'}, 404
            return waste.to_dict(), 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class CheckWasteAction(Resource):
    @token_responsible_required
    def put(self, waste_id):
        try:
            id_responsible = request.user_info['user_id']
            waste = Waste.query.get(waste_id)
            if not waste:
                return {'error': 'Waste not found'}, 404

            # Check if the waste is already checked
            if waste.is_checked:
                return {'error': 'Waste already checked'}, 400
            
            # Update the waste status
            waste.is_checked = True
            db.session.commit()
            print('waste is checked.....')

            # Add the record to waste_checkers
            check_record = waste_checkers.insert().values(
                waste_id=waste_id,
                responsible_id=id_responsible
            )
            db.session.execute(check_record)
            db.session.commit()

            return {'message': 'Waste checked and responsible added to checkers'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ListWaterShortages(Resource):
    @token_required
    def get(self):
        try:
            water_shortages = WaterShortage.query.all()
            return {
                'message': 'Fetched water shortages',
                'water_shortages': [ws.to_dict() for ws in water_shortages]
            }, 200
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
            return {
                'message': 'Fetched water shortage details',
                'water_shortage': water_shortage.to_dict()
            }, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class LeaderboardResponsibles(Resource):
    @token_responsible_required
    def get(self):
        try:
            # Query to get all responsibles ordered by last_subscription
            responsibles = Responsible.query.order_by(Responsible.last_subscription.desc()).all()
            
            response_data = []
            for responsible in responsibles:
                # Count the number of checks associated with this responsible
                check_count = db.session.query(waste_checkers).filter_by(responsible_id=responsible.id_responsible).count()
                
                # Convert responsible to dict and add check_count
                responsible_dict = responsible.to_dict()
                responsible_dict['check_count'] = check_count
                response_data.append(responsible_dict)
            
            return response_data, 200
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
            return {
                'message': 'Fetched leaderboard of active users',
                'users': [user.to_dict() for user in users]
            }, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class MarkNotificationAsSeen(Resource):
    @token_responsible_required
    def put(self, notification_id):
        try:
            responsible_id = request.user_info['user_id']
            notification_entry = db.session.query(waste_notification_receivers).filter_by(
                waste_notification_id=notification_id,
                responsible_id=responsible_id
            ).first()

            if not notification_entry:
                return {'error': 'Notification not found or not assigned to this responsible'}, 404

            notification_entry.has_seen = True
            db.session.commit()
            return {'message': 'Notification marked as seen'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400