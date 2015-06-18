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
    sql = "SELECT id,f,t,msg,time,status FROM message WHERE f=%d AND t=%d AND status!=2" % (f_id,t_id)
    cursor.execute(sql)
    messages = cursor.fetchall()
    messages_dict = {"messages": messages}
    return messages_dict

def receive_session(current_chat_id,t_id):
    cursor = connection.cursor()
    #select the msg that to sb. but except the man who is chatting
    sql = """SELECT m.id,u.name,f,t,msg,time,status
             FROM message m
             LEFT JOIN user u
             WHERE  m.f = u.id AND  t=%d AND f!=%d AND status!=2
             ORDER BY u.id,m.time ASC""" % (t_id,current_chat_id)
    cursor.execute(sql)
    sessions = cursor.fetchall()
    sessions_dict = {"sessions": sessions}
    return sessions_dict


def set_msg_status2(f_id,t_id,status):
    cursor = connection.cursor()
    sql = "UPDATE message SET status = %d WHERE f = %d AND t = %d "%(status,f_id,t_id)
    print sql
    cursor.execute(sql)
    return True

def set_msg_status(msg_id_list,status):
    cursor = connection.cursor()
    for msg_id in msg_id_list:
        sql = "UPDATE message SET status = %d WHERE id = %d"%(status,msg_id)
        print sql
        cursor.execute(sql)
    return True
