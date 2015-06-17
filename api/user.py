from django.db import connection

def load_users():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM user WHERE id != 1")
    users = cursor.fetchall()
    users_dict = {"users": users}
    return users_dict

def create_user(num):
    cursor = connection.cursor()
    #get the max id of users
    cursor.execute("SELECT MAX(id) FROM user")
    user_max_id = cursor.fetchall()[0][0]
    start_id = user_max_id + 1
    end_id =start_id + num

    for id in range(start_id,end_id):
        sql = ("INSERT INTO user ('name') VALUES ('%s')" % ("name_"+str(id)))
        print sql
        cursor.execute(sql)


def reset_user():
    cursor = connection.cursor()
    cursor.execute("DELETE FROM user WHERE id != 1")
