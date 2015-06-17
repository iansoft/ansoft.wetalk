from django.conf.urls import patterns,include,url
from dashboard import views

urlpatterns = patterns('',
                       url(r"^$", views.index, name="dashboard"),
                       url(r"^load_contact/$", views.load_contact, name="load_contact"),
                       url(r"^add_user/(?P<num>\d+)/$", views.add_user, name="add_user"),
                       url(r"^reset_user/$", views.reset_user, name="reset_user"),
                    )
