from django.db import connection
import datetime


def send_msg(msg):
    cursor = connection.cursor()
    time_now = str(datetime.datetime.now())
    sql = ("INSERT INTO message ('f','t','msg','time','status') VALUES ('%d','%d','%s','%s','%d')"
           % (msg['f'],msg['t'],msg['msg'],time_now,msg['status']))
    cursor.execute(sql)
    return True

def receive_msg(f_id, t_id):
    cursor = connection.cursor()
    sql = "SELECT id,f,t,msg,time,status FROM message WHERE f=%d AND t=%d AND status=0" % (f_id,t_id)
    cursor.execute(sql)
    messages = cursor.fetchall()
    messages_dict = {"messages": messages}
    return messages_dict

def set_msg_status(msg_id_list,status):
    cursor = connection.cursor()
    for msg_id in msg_id_list:
        sql = "UPDATE message SET status = %d WHERE id = %d"%(status,msg_id)
        print sql
        cursor.execute(sql)
    return True
