from views.user_views import *
from views.dashboard_views import *

def route_users(api):
    api.add_resource(Register, '/api/users', endpoint='register')  # POST only
    api.add_resource(UserProfile, '/api/user/<int:user_id>', endpoint='user_profile')  # GET, PUT, DELETE
    api.add_resource(Login, '/api/login', endpoint='login')  # POST only

def route_dashboard(api):
    api.add_resource(SuperAdminRegister, '/api/dashboard/login', endpoint='register')  # POST only
    api.add_resource(SuperAdminProfileView, '/api/dashboard/admin/<int:admin_id>', endpoint='user_profile')  # GET, PUT
    api.add_resource(SuperAdminLogin, '/api/dashboard/admin/login', endpoint='login')  # POST only
    api.add_resource(SubscriptionList, '/api/dashboard/subscriptions') # GET 
    api.add_resource(NewSubscription, '/api/dashboard/subscription/new') # POST
    api.add_resource(SubscriptionDetail, '/api/subscriptions/<int:subscription_id>') # GET, PUT

def initialize_views(api):
    route_users(api)
