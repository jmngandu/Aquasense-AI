from flask_restful import Resource
from flask import request, current_app
from config.extensions import db
from models.wastewatershortage import *
from models.notifications import *
from models.user import Responsible, User
from utils.helpers import token_required,allowed_file, token_responsible_required,token_responsible_or_required
from werkzeug.utils import secure_filename
import os

class PostWasteImage(Resource):
    @token_required
    def post(self):
        try:
            user_id = request.user_info['user_id']

            # Check if file is part of the request
            if 'file' not in request.files:
                return {'error': 'No file part'}, 400

            file = request.files['file']

            # Check if the file is selected
            if file.filename == '':
                return {'error': 'No selected file'}, 400

            # Validate file type and save it
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['WASTE_FOLDER'], filename)
                file.save(file_path)

                # Extract JSON data
                longitude = request.form.get('longitude')
                latitude = request.form.get('latitude')

                # Create new Waste entry
                new_waste = Waste(
                    image_waste=filename,  # Store only the filename
                    longitude=longitude,
                    latitude=latitude,
                    id_user=user_id
                )
                db.session.add(new_waste)
                db.session.commit()

                # Update the user's score
                user = User.query.get(user_id)
                if user:
                    user.score += 1
                    db.session.commit()

                # Create and add notification
                notification = WasteNotification(
                    description="New waste image posted",
                    id_waste=new_waste.id_waste
                )
                db.session.add(notification)
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
    @token_required
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
    @token_responsible_required
    def get(self):
        try:
            water_shortages = WaterShortage.query.all()
            return {'message': 'Fetched water shortages', 'water_shortages': [ws.to_dict() for ws in water_shortages]}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class WaterShortageDetails(Resource):
    @token_responsible_required
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
    @token_responsible_required
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
            users_query = User.query.order_by(User.score.desc())
            
            return {
                'leaderboard': [user.to_dict()for user in users_query],
                'total': users_query.count()
            }, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400