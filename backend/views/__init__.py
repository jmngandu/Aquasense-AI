from views.user_views import *

def route_users(api):
    api.add_resource(Register, '/api/users', endpoint='register')  # POST only
    api.add_resource(UserProfile, '/api/user/<int:user_id>', endpoint='user_profile')  # GET, PUT, DELETE
    api.add_resource(Login, '/api/login', endpoint='login')  # POST only


def initialize_views(api):
    route_users(api)
