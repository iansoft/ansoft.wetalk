from django.conf.urls import patterns,include,url
from dashboard import views

urlpatterns = patterns('',
                       url(r"^$", views.index, name="dashboard"),
                    )
