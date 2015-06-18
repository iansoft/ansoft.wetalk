from django.http import HttpResponse,JsonResponse, HttpResponseNotFound
from django.template import RequestContext, loader
import os
import json

from api import user as user_api
from api import message as msg_api

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

def send_message(request):
    msg = json.loads(request.body)
    #send the msg to server
    vsm_status_dict = {}
    if msg_api.send_msg(msg) == True:
        vsm_status_dict = {"status": "OK","msg":"add msg"}
    else:
        vsm_status_dict = {"status": "Bad","msg":"none"}
    return JsonResponse(vsm_status_dict)


def receive_message(request):
    f_id = request.GET.get('f_id')
    t_id = request.GET.get('t_id')
    messages = msg_api.receive_msg(int(f_id),int(t_id))
    messages_dict = []
    for msg in messages['messages']:
        tmp_msg = {
            "id":msg[0],
            "f":msg[1],
            "t":msg[2],
            "msg":msg[3],
            "time":msg[4],
            "status":msg[5]
        }
        messages_dict.append(tmp_msg)
    resp_data = {"messages": messages_dict}
    return JsonResponse(resp_data)

def receive_session(request):
    current_chat_id = 29
    t_id = 1
    sessions = msg_api.receive_session(current_chat_id,t_id)
    sessions_dict = []
    print "====get the user===="
    for session in sessions['sessions']:
        is_use_exist = False
        for user in sessions_dict:
            if session[2] == user["id"]:
                is_use_exist = True
                break
        if  is_use_exist == True:
            continue
        else:
            tmp_user = {
                "id":session[2],
                "name":session[1],
                "msg":[]
            }
            sessions_dict.append(tmp_user)

    print "====get the message===="
    for session in sessions['sessions']:
        for user in sessions_dict:
            if session[2] == user["id"]:
                tmp_msg = {
                    "id":session[0],
                    "msg":session[4],
                    "time":session[5],
                    "status":session[6]
                }
                user["msg"].append(tmp_msg)

    print sessions_dict

    resp_data = {"sessions": sessions_dict}
    return JsonResponse(resp_data)

def set_message_status(request):
    data = json.loads(request.body)
    #execute update the msg status
    msg_api.set_msg_status(data["msg_id_list"],data["status"])
    vsm_status_dict = {"status": "OK"}
    return JsonResponse(vsm_status_dict)

def set_message_status2(request):
    data = json.loads(request.body)
    #execute update the msg status
    f_id = int(data["f_id"])
    t_id = int(data["t_id"])
    status = int(data["status"])
    msg_api.set_msg_status2(f_id,t_id,status)
    vsm_status_dict = {"status": "OK"}
    return JsonResponse(vsm_status_dict)

def add_user(request,num):
    print "the user num is %s" %num
    user_api.create_user(5)
    vsm_status_dict = {"status": "OK","num":num}
    return JsonResponse(vsm_status_dict)

def reset_user(request):
    user_api.reset()
    vsm_status_dict = {"status": "OK","msg":"Reset the database"}
    return JsonResponse(vsm_status_dict)

