from flask_restful import Resource,reqparse
from flask import request, current_app
from config.extensions import db
from models.wastewatershortage import *
from models.notifications import *
from models.user import Responsible, User
from utils.helpers import token_required,allowed_file, token_responsible_required,token_responsible_or_required
from werkzeug.utils import secure_filename
from utils.send_mail import send_waste_email
import os

class PostWasteImage(Resource):
    @token_required
    def post(self):
        try:
            user_id = request.user_info['user_id']
            file, longitude, latitude = self.save_file()
            if file is None:
                return {'error': 'No file part or no selected file'}, 400

            # Create new Waste entry
            filename = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['WASTE_FOLDER'], filename)
            file.save(file_path)
            new_waste = self.create_waste_entry(filename, longitude, latitude, user_id)
            
            # Notify all Responsible users
            self.notify_responsibles(new_waste)

            return {'message': 'Waste image posted, notification sent, and emails dispatched'}, 201
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

    def save_file(self):
        """Validate and save the file from the request."""
        if 'file' not in request.files:
            return None, None, None

        file = request.files['file']
        if file.filename == '':
            return None, None, None

        if file and allowed_file(file.filename):
            longitude = request.form.get('longitude')
            latitude = request.form.get('latitude')
            return file, longitude, latitude

        return None, None, None

    def create_waste_entry(self, filename, longitude, latitude, user_id):
        """Create a new Waste entry in the database."""
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

        return new_waste, notification

    def notify_responsibles(self, new_waste):
        """Broadcast notifications to all Responsible users and send emails."""
        responsibles = Responsible.query.all()
        for responsible in responsibles:
            db.session.execute(waste_notification_receivers.insert().values(
                waste_notification_id=new_waste.id_waste,
                responsible_id=responsible.id_responsible
            ))
            link = f"https://www.google.com/maps/search/?api=1&query={new_waste.latitude},{new_waste.longitude}"
            subject = "New Waste Image Posted"
            button_content_link = "View on Google Maps"
            send_waste_email(
                mail_receiver=responsible.email,
                name_receiver=responsible.name,
                link=link,
                button_content_link=button_content_link
            )
        db.session.commit()
        
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
        
class SubmitWaterData(Resource):
    def post(self):
        #Informations from the IoT devices
        parser = reqparse.RequestParser()
        parser.add_argument('id_device', type=int, required=True, help='Device ID is required')
        parser.add_argument('flow_rate', type=float, required=True, help='Flow rate is required')
        parser.add_argument('water_level', type=float, required=True, help='Water level is required')
        parser.add_argument('pump_status', type=str, required=True, help='Pump status is required')
        parser.add_argument('quantity', type=float, required=True, help='Water quantity is required')
        parser.add_argument('rainfall', type=float, required=True, help='Rainfall is required')
        parser.add_argument('temperature', type=float, required=True, help='Temperature is required')
        parser.add_argument('humidity', type=float, required=True, help='Humidity is required')
        args = parser.parse_args()

        try:
            water_data = WaterData(
                id_device=args['id_device'],
                flow_rate=args['flow_rate'],
                water_level=args['water_level'],
                pump_status=args['pump_status'],
                quantity=args['quantity'],
                rainfall=args['rainfall'],
                temperature=args['temperature'],
                humidity=args['humidity']
            )
            db.session.add(water_data)
            db.session.commit()
            return {'message': 'Data submitted successfully'}, 201
        except Exception as e:
            print(e)
            return {'error': 'Failed to submit data'}, 400
        
class WaterDataDetails(Resource):
    def get(self, water_data_id):
        try:
            water_data = WaterData.query.get(water_data_id)
            if not water_data:
                return {'error': 'Water data not found'}, 404
            return {'message': 'Fetched water data details', 'water_data': water_data.to_dict()}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
        
class ListWaterQualities(Resource):
    def get(self):
        try:
            water_qualities = WaterQuality.query.all()
            return {'message': 'Fetched water qualities', 'water_qualities': [wq.to_dict() for wq in water_qualities]}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class WaterQualityDetails(Resource):
    def get(self, water_quality_id):
        try:
            water_quality = WaterQuality.query.get(water_quality_id)
            if not water_quality:
                return {'error': 'Water quality not found'}, 404
            return {'message': 'Fetched water quality details', 'water_quality': water_quality.to_dict()}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class AddWaterQuality(Resource):
    def post(self):
        #details of water quality from the IoT devices
        data = request.get_json()
        try:
            water_quality = WaterQuality(
                ph=data.get('ph'),
                hardness=data.get('hardness'),
                solids=data.get('solids'),
                chloramines=data.get('chloramines'),
                sulfate=data.get('sulfate'),
                conductivity=data.get('conductivity'),
                organic_carbon=data.get('organic_carbon'),
                trihalomethanes=data.get('trihalomethanes'),
                turbidity=data.get('turbidity'),
                potability=data.get('potability'),
                id_device=data.get('id_device')
            )
            db.session.add(water_quality)
            db.session.commit()
            return {'message': 'Water quality data added successfully', 'water_quality': water_quality.to_dict()}, 201
        except Exception as e:
            print(e)
            db.session.rollback()
            return {'error': 'Failed to add water quality data'}, 400


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