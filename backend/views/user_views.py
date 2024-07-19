from flask_restful import Resource
from flask import request
from config.extensions import db
from models.user import User
from utils.helpers import hash_password , verify_password, generate_token

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