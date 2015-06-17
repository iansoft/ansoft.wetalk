from django.http import HttpResponse,JsonResponse, HttpResponseNotFound
from django.template import RequestContext, loader
import os
import json
from api import user as user_api

def index(request):
    template = loader.get_template('dashboard/index.html')
    base_dir = os.path.dirname(os.path.dirname(__file__))
    PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
    static_path = os.path.join(base_dir, 'static')
    context = RequestContext(request, {"base_dir": base_dir
                                      ,"project_dir": PROJECT_PATH
                                      ,"static_dir": static_path})
    return HttpResponse(template.render(context))

def load_contact(request):
    print "load contact..."
    users = user_api.load_users()
    print users['users']
    users_dict = []
    for user in users['users']:
        tmpuser = {
            "id":user[0],
            "name":user[1]
        }
        users_dict.append(tmpuser)
    resp_data = {"users": users_dict}
    return JsonResponse(resp_data)

def add_user(request,num):
    print "the user num is %s" %num
    user_api.create_user(5)
    vsm_status_dict = {"status": "OK","num":num}
    return JsonResponse(vsm_status_dict)

def reset_user(request):
    user_api.reset_user()
    vsm_status_dict = {"status": "OK","msg":"Reset the database"}
    return JsonResponse(vsm_status_dict)

