from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r"^$", include('dashboard.urls', namespace="dashboard")),
    url(r"^api/", include('dashboard.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
