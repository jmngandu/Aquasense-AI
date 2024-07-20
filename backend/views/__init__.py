from views.user_views import *
from views.dashboard_views import *
from views.wastewatershortage_views import *
from views.notifications_views import *

def route_users(api):
    api.add_resource(Register, '/api/users', endpoint='register')  # POST only
    api.add_resource(UserProfile, '/api/user/<int:user_id>', endpoint='user_profile')  # GET, PUT, DELETE
    api.add_resource(Login, '/api/login', endpoint='login')  # POST only
    
    api.add_resource(RegisterResponsible, '/api/responsible/register', endpoint='register_responsible') #POST
    api.add_resource(ResponsibleProfile, '/api/responsible/profile', endpoint='responsible_profile') #GET , PUT
    api.add_resource(LoginResponsible, '/api/responsible/login', endpoint='login_responsible') #POST

def route_dashboard(api):
    api.add_resource(SuperAdminRegister, '/api/dashboard/admin/register', endpoint='register_admin')  # POST only
    api.add_resource(SuperAdminProfileView, '/api/dashboard/admin/profile', endpoint='admin_profile')  # GET, PUT
    api.add_resource(SuperAdminLogin, '/api/dashboard/admin/login', endpoint='login_admin')  # POST only
    api.add_resource(SubscriptionList, '/api/dashboard/subscriptions', endpoint='subscriptions_list') # GET 
    api.add_resource(NewSubscription, '/api/dashboard/subscription/new',endpoint='new_subscription') # POST
    api.add_resource(SubscriptionDetail, '/api/subscriptions/<int:subscription_id>', endpoint='subscription_profile') # GET, PUT

def route_waste_and_water_shortage(api):
    api.add_resource(PostWasteImage, '/api/waste/post_image', endpoint='post_waste_image')  # POST
    api.add_resource(ListReceivedNotifications, '/api/notifications/received', endpoint='list_received_notifications')  # GET
    api.add_resource(ListUnreadNotifications, '/api/notifications/unread', endpoint='list_unread_notifications')  #   # GET
    api.add_resource(ListUncheckedWaste, '/api/waste/unchecked', endpoint='list_unchecked_waste')  # GET
    api.add_resource(WasteDetails, '/api/waste/details/<int:waste_id>', endpoint='waste_details')  # GET
    api.add_resource(CheckWasteAction, '/api/waste/check/<int:waste_id>', endpoint='check_waste_action')  # PUT
    api.add_resource(ListWaterShortages, '/api/water_shortages', endpoint='list_water_shortages')  # GET
    api.add_resource(WaterShortageDetails, '/api/water_shortage/details/<int:water_shortage_id>', endpoint='water_shortage_details')  # GET
    api.add_resource(LeaderboardResponsibles, '/api/leaderboard/active_responsibles', endpoint='leaderboard_active_responsibles')  # GET
    api.add_resource(ActivateResponsibleAccount, '/api/responsible/activate/<int:responsible_id>', endpoint='activate_responsible_account')  # PUT
    api.add_resource(LeaderboardUsers, '/api/leaderboard/active_users', endpoint='leaderboard_active_users')  # GET


def initialize_views(api):
    route_users(api)
    route_dashboard(api)
    route_waste_and_water_shortage(api)
