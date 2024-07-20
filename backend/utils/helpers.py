from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from flask import current_app
from flask import request, jsonify
from functools import wraps
from models.user import User
from models.dashboard import SuperAdmin

def generate_token(user_id, is_simple_user=True, is_superuser=False):
    """Generate JWT token."""
    try:
        payload = {
            'user_id': user_id,
            "is_simple_user":True,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
        }
        if is_superuser:
            payload['is_superuser'] = is_superuser
        token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
        return token
    except Exception as e:
        print(e)
        return None
    

def generate_admin_token(user_id, is_superuser=True):
    return generate_token(user_id, is_simple_user=False, is_superuser=is_superuser)


def verify_token(token):
    """Verify JWT token."""
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {'error': 'Token expired'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}

def hash_password(password):
    return generate_password_hash(password)

def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        payload = verify_token(token)
        if 'error' in payload:
            return jsonify(payload), 401
        
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 401
        
        request.user_info = {
            "user_id":payload['user_id'],
            "is_simple_user":payload['is_simple_user']
        }
        return f(*args, **kwargs)
    
    return decorator

def token_superadmin_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        payload = verify_token(token)
        if 'error' in payload:
            return jsonify(payload), 401
        
        superadmin = SuperAdmin.query.get(payload['user_id'])
        if not superadmin:
            return jsonify({'error': 'User not found'}), 401
        
        if payload['user_id'] and payload['is_simple_user']==False and payload['is_superuser']==True:
            return jsonify({'erreur':'Super admin privilège is required'}), 401
        
        request.user_info = {
            "user_id":payload['user_id'],
            "is_simple_user":payload['is_simple_user']
        }
        return f(*args, **kwargs)
    
    return decorator