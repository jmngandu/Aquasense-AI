from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from flask import current_app
from flask import request, jsonify
from functools import wraps
from models.user import User,Responsible
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
    
def generate_responsible_token(user_id):
    return generate_token(user_id,is_simple_user=False,is_superuser=False)

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
        token = token.replace('Bearer ', '')
        print(token)
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        payload = verify_token(token)
        if 'error' in payload:
            return {'error':'token invalid or expired'}, 401
        
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 401
        
        request.user_info = {
            "user_id":payload['user_id'],
            "is_simple_user":payload['is_simple_user']
        }
        return f(*args, **kwargs)
    
    return decorator

def token_responsible_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        payload = verify_token(token)
        if 'error' in payload:
            return {'error':'token invalid or expired'}, 401
        
        user = Responsible.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 401
        
        request.user_info = {
            "user_id":payload['user_id'],
            "is_simple_user":payload['is_simple_user']
        }
        return f(*args, **kwargs)
    
    return decorator

def token_responsible_or_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Try to validate with @token_responsible_required
            token_responsible_required(lambda: None)(*args, **kwargs)
            return f(*args, **kwargs)
        except Exception as e:
            # If @token_responsible_required fails, try @token_required
            try:
                token_required(lambda: None)(*args, **kwargs)
                return f(*args, **kwargs)
            except Exception as e:
                # If both fail, return an unauthorized response
                return jsonify({'error': 'Unauthorized access'}), 401
    return decorated_function

def token_superadmin_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        payload = verify_token(token)
        print(payload)
        if 'error' in payload:
            return {'error':'token invalid or expired'}, 401
        
        superadmin = SuperAdmin.query.get(payload['user_id'])
        if not superadmin:
            return jsonify({'error': 'User not found'}), 401
        
        if not payload.get('is_superuser', False):
            return jsonify({'error': 'Super admin privilege is required'}), 401
        
        request.user_info = {
            "user_id": payload['user_id'],
            "is_superuser": payload['is_superuser']
        }
        print(request.user_info)
        return f(*args, **kwargs)
    
    return decorator

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
