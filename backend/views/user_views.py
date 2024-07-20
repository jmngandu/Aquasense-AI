from flask_restful import Resource
from flask import request
from config.extensions import db
from models.user import User, Responsible
from utils.helpers import hash_password , verify_password, generate_token, token_required

class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            if any(attr not in data for attr in ['username', 'email', 'password']):
                return {'error': 'All attributes are required'}, 400
            
            hashed_password = hash_password(data['password'])

            new_user = User(
                username=data['username'],
                email=data['email'],
                password_hash=hashed_password
            )
            db.session.add(new_user)
            db.session.commit()
            return {'message': 'User created successfully'}, 201
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class UserProfile(Resource):
    def get(self, user_id):
        try:
            user = User.query.get(user_id)
            if user:
                return {'username': user.username, 'email': user.email, 'profile': user.profile}
            return {'message': 'User not found'}, 404
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

    def put(self, user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return {'message': 'User not found'}, 404
            
            data = request.get_json()
            if 'username' in data:
                user.username = data['username']
            if 'email' in data:
                user.email = data['email']
            if 'password' in data:
                user.password_hash = hash_password(data['password'])
            db.session.commit()
            return {'message': 'User updated successfully'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

    def delete(self, user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return {'message': 'User not found'}, 404
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted successfully'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
        
class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            if 'email' not in data or 'password' not in data:
                return {'error': 'Email and password are required'}, 400
            
            user = User.query.filter_by(email=data['email']).first()
            if user and verify_password(data['password'], user.password_hash):
                token = generate_token(user.id_user)
                return {'message': 'Login successful', 'token': token}, 200
            return {'message': 'Invalid credentials'}, 401
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
        
class RegisterResponsible(Resource):
    def post(self):
        #request.data = ['username', 'email', 'password', 'description', 'activity_type', 'activity_domain']
        try:
            data = request.get_json()
            if any(attr not in data for attr in ['username', 'email', 'password', 'activity_type', 'activity_domain']):
                return {'error': 'All attributes are required'}, 400
            
            hashed_password = hash_password(data['password'])

            new_responsible = Responsible(
                username=data['username'],
                email=data['email'],
                password_hash=hashed_password,
                activity_type=data['activity_type'],
                activity_domain=data['activity_domain'],
                description=data.get('description', ''),
            )
            db.session.add(new_responsible)
            db.session.commit()
            return {'message': 'Responsible created successfully'}, 201
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class ResponsibleProfile(Resource):
    @token_required
    def get(self):
        try:
            user_id = request.user_info['user_id']
            responsible = Responsible.query.get(user_id)
            user_responsible = User.query.get(user_id)
            if responsible:
                return {
                    'id_user':responsible.id_user,
                    'username': responsible.username,
                    'email': responsible.email,
                    'activity_type': responsible.activity_type,
                    'activity_domain': responsible.activity_domain,
                    'description': responsible.description,
                    'is_activated': responsible.is_activated,
                    'last_subscription': responsible.last_subscription,
                    'score':user_responsible.score
                }
            return {'message': 'Responsible not found'}, 404
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
        
    @token_required
    def put(self):
        try:
            user_id = request.user_info['user_id']
            responsible = Responsible.query.get(user_id)
            if not responsible:
                return {'message': 'Responsible not found'}, 404
            
            data = request.get_json()
            allowed_fields = ['username', 'email', 'password', 'activity_type', 'activity_domain', 'description', 'is_activated', 'last_subscription']
            for field in allowed_fields:
                if field in data:
                    if field == 'password':
                        setattr(responsible, 'password_hash', hash_password(data['password']))
                    else:
                        setattr(responsible, field, data[field])
            db.session.commit()
            return {'message': 'Responsible updated successfully'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
        
class LoginResponsible(Resource):
    def post(self):
        try:
            data = request.get_json()
            if 'email' not in data or 'password' not in data:
                return {'error': 'Email and password are required'}, 400
            
            responsible = Responsible.query.filter_by(email=data['email']).first()
            if responsible and verify_password(data['password'], responsible.password_hash):
                token = generate_token(responsible.id_user)
                return {'message': 'Login successful', 'token': token}, 200
            return {'message': 'Invalid credentials'}, 401
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
        
class LeaderboardResponsibles(Resource):
    @token_required
    def get(self):
        try:
            # Logic to fetch a leaderboard of the most active responsibles
            return {'message': 'Fetched active responsibles leaderboard'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class LeaderboardUsers(Resource):
    @token_required
    def get(self):
        try:
            # Logic to fetch a leaderboard of the most active users
            return {'message': 'Fetched active users leaderboard'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400
        
class ActivateResponsibleAccount(Resource):
    def put(self, responsible_id):
        try:
            # Logic to handle account activation for responsibles
            return {'message': 'Responsible account activated'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400