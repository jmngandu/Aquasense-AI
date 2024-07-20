from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource
from config.database import db_uri
from flask_restful import Api
from dotenv import load_dotenv
import os
from config.extensions import db, migrate
from views import initialize_views

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
app.config['PROFILE_FOLDER'] = os.path.join(app.config['UPLOAD_FOLDER'], 'profiles')
app.config['WASTE_FOLDER'] = os.path.join(app.config['UPLOAD_FOLDER'], 'images/waste')
os.makedirs(app.config['PROFILE_FOLDER'], exist_ok=True)

db.init_app(app)
migrate.init_app(app, db)
api = Api(app)

initialize_views(api)

@app.route('/list_routes', methods=['GET'])
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'rule': rule.rule
        })
    return jsonify(routes)

if __name__ == '__main__':
    host = os.getenv('HOST')
    port = int(os.getenv('PORT'))
    app.run(host=host, port=port, debug=True)
