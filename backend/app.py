from flask import Flask, jsonify,request
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_restful import Api
from dotenv import load_dotenv
import os
from config.extensions import db, migrate
from views import initialize_views
from flask_mail import Mail, Message
from config import configure_app

load_dotenv()

app = Flask(__name__)
CORS(app)

configure_app(app)

mail = Mail(app)
app.extensions['mail'] = mail

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
    host = os.getenv('HOST','192.168.210.66')
    port = int(os.getenv('PORT'))
    app.run(host=host, port=port, debug=True)
