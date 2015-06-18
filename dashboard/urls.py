from django.conf.urls import patterns,include,url
from dashboard import views

urlpatterns = patterns('',
                       url(r"^$", views.index, name="dashboard"),
                       url(r"^load_contact/$", views.load_contact, name="load_contact"),
                       url(r"^send_message/$", views.send_message, name="send_message"),
                       url(r"^receive_message/$", views.receive_message, name="receive_message"),
                       url(r"^set_message_status/$", views.set_message_status, name="set_message_status"),
                       url(r"^add_user/(?P<num>\d+)/$", views.add_user, name="add_user"),
                       url(r"^reset_user/$", views.reset_user, name="reset_user"),
                    )
