from flask_restful import Resource
from flask import request
from config.extensions import db
from models.dashboard import Subscription, SuperAdmin
from utils.helpers import token_superadmin_required, hash_password, verify_password, generate_admin_token

class SuperAdminRegister(Resource):
    def post(self):
        #request.data = ['username','email','password']
        try:
            data = request.get_json()
            if any(attr not in data for attr in ['username', 'email', 'password']):
                return {'error': 'All attributes are required'}, 400
            
            hashed_password = hash_password(data['password'])

            new_superadmin = SuperAdmin(
                username=data['username'],
                email=data['email'],
                password_hash=hashed_password
            )
            db.session.add(new_superadmin)
            db.session.commit()
            return {'message': 'SuperAdmin created successfully'}, 201
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class SuperAdminLogin(Resource):
    def post(self):
        try:
            data = request.get_json()
            if 'email' not in data or 'password' not in data:
                return {'error': 'Email and password are required'}, 400
            
            superadmin = SuperAdmin.query.filter_by(email=data['email']).first()
            if superadmin and verify_password(data['password'], superadmin.password_hash):
                token = generate_admin_token(superadmin.id_user)
                return {'message': 'Login successful', 'token': token}, 200
            return {'message': 'Invalid credentials'}, 401
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class SuperAdminProfileView(Resource):
    @token_superadmin_required
    def get(self, admin_id):
        try:
            super_admin = SuperAdmin.query.get(admin_id)
            if super_admin:
                return {
                    'id_user': super_admin.id_user,
                    'username': super_admin.username,
                    'email': super_admin.email,
                    'profile': super_admin.profile,
                    'is_superuser': super_admin.is_superuser
                }, 200
            return {'message': 'SuperAdmin not found'}, 404
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

    @token_superadmin_required
    def put(self, admin_id):
        try:
            super_admin = SuperAdmin.query.get(admin_id)
            if not super_admin:
                return {'message': 'SuperAdmin not found'}, 404

            data = request.get_json()
            if 'username' in data:
                super_admin.username = data['username']
            if 'email' in data:
                super_admin.email = data['email']
            if 'password' in data:
                super_admin.password_hash = hash_password(data['password'])
            db.session.commit()
            return {'message': 'SuperAdmin updated successfully'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class SubscriptionList(Resource):
    @token_superadmin_required
    def get(self):
        try:
            subscriptions = Subscription.query.all()
            return [sub.to_dict() for sub in subscriptions], 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class NewSubscription(Resource):
    @token_superadmin_required
    def post(self):
        #request.data = ['name', 'version','description','amount', 'validity']
        try:
            data = request.get_json()
            new_subscription = Subscription(
                version=data.get('version'),
                name=data.get('name'),
                description=data.get('description'),
                amount=data.get('amount'),
                validity=data.get('validity')
            )
            db.session.add(new_subscription)
            db.session.commit()
            return {'message': 'Subscription created successfully'}, 201
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

class SubscriptionDetail(Resource):
    @token_superadmin_required
    def get(self, subscription_id):
        try:
            subscription = Subscription.query.get(subscription_id)
            if subscription:
                return subscription.to_dict(), 200
            return {'message': 'Subscription not found'}, 404
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

    @token_superadmin_required
    def put(self, subscription_id):
        try:
            subscription = Subscription.query.get(subscription_id)
            if not subscription:
                return {'message': 'Subscription not found'}, 404
            
            data = request.get_json()
            subscription.version = data.get('version', subscription.version)
            subscription.name = data.get('name', subscription.name)
            subscription.description = data.get('description', subscription.description)
            subscription.amount = data.get('amount', subscription.amount)
            subscription.validity = data.get('validity', subscription.validity)
            db.session.commit()
            return {'message': 'Subscription updated successfully'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

    @token_superadmin_required
    def delete(self, subscription_id):
        try:
            subscription = Subscription.query.get(subscription_id)
            if not subscription:
                return {'message': 'Subscription not found'}, 404
            db.session.delete(subscription)
            db.session.commit()
            return {'message': 'Subscription deleted successfully'}, 200
        except Exception as e:
            print(e)
            return {'error': 'External error'}, 400

