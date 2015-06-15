
import socket
import threading
import sys
import os
import base64
import hashlib
import struct

#======config=======
connectionlist = {}
HOST = "localhost"
PORT = 10097
MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
HANDSHAKE_STRING = "HTTP/1.1 101 Switching Protocols\r\n" \
      "Upgrade:websocket\r\n" \
      "Connection: Upgrade\r\n" \
      "Sec-WebSocket-Accept: {1}\r\n" \
      "WebSocket-Location: ws://{2}/chat\r\n" \
      "WebSocket-Protocol:chat\r\n\r\n"


def sendMessage(msg):
	if msg:
		msg = str(msg)
	else:
		return False

	token = "\x81"
	length = len(msg)
	if length < 126:
		token += struct.pack("B", length)
	elif length <= 0xFFFF:
		token += struct.pack("!BH", 126, length)
	else:
		token += struct.pack("!BQ", 127, length)

	msg = '%s%s' % (token, msg)
	print "====finally data======"
	print msg

	global connectionlist
	for index,conn in connectionlist.iteritems():
		conn.send(msg)


def deleteconnection(item):
	global connectionlist
	del connectionlist["connection"+item]


#send data
def send_data(conn,data):
	if data:
		data = str(data)
	else:
		return False

	token = "\x81"
	length = len(data)
	if length < 126:
		token += struct.pack("B", length)
	elif length <= 0xFFFF:
		token += struct.pack("!BH", 126, length)
	else:
		token += struct.pack("!BQ", 127, length)

	data = '%s%s' % (token, data)
	print "====finally data======"
	print data
	conn.send(data)


# handshake
def handshake(conn):
	headers = {}
	shake = conn.recv(1024)

	if not len(shake):
		return False

	header, data = shake.split('\r\n\r\n', 1)
	for line in header.split('\r\n')[1:]:
		key, val = line.split(': ', 1)
		headers[key] = val

	if 'Sec-WebSocket-Key' not in headers:
		print 'This socket is not websocket, client close.'
		conn.close()
		return False

	sec_key = headers['Sec-WebSocket-Key']
	res_key = base64.b64encode(hashlib.sha1(sec_key + MAGIC_STRING).digest())

	str_handshake = HANDSHAKE_STRING.replace('{1}', res_key).replace('{2}', HOST + ':' + str(PORT))
	print str_handshake
	conn.send(str_handshake)
	return True


class WebSocket(threading.Thread):
	"""docstring for  WebSocket"""
	def __init__(self, conn, index, name, remote, path="/"):
  		threading.Thread.__init__(self)
  		self.conn = conn
 		self.index = index
 		self.name  = name 
 		self.remote = remote
 		self.path = path
 		self.buffer = ""


  	def run(self):
 		print "socket %s start!" %self.index
 		headers = {}
 		self.handshaken = False

 		while True:
 			if self.handshaken == False:
 				#handshake
 				if handshake(self.conn):
 					self.handshaken = True
 					sendMessage("Welcome, "+self.name+" !")
 			else:
 				raw_str = self.recv_data(1024)
 				print "=====raw_str====="
 				print raw_str

 			# 	back_str = []
 			# 	back_str.append('\x81')
 			# 	data_length = len(raw_str)
 			# 	if data_length < 125:
				# 	back_str.append(chr(data_length))
				# else:
				# 	back_str.append(chr(126))
				# 	back_str.append(chr(data_length >> 8))
				# 	back_str.append(chr(data_length & 0xFF))

				# back_str = "".join(back_str) + raw_str
				# print "=====back_str====="
 			# 	print back_str

 				sendMessage(raw_str)
 				


	#the num is how many character
	def recv_data(self, num):
		raw_str = ""
		msg = self.conn.recv(num)
		if not len(msg):
			print "[ERROR]:Receive nothing..."
			return ""
		else:
			code_len = ord(msg[1]) & 127
			if code_len == 126:
				masks = msg[4:8]
				data = msg[8:]
			elif code_len == 127:
				masks = msg[10:14]
				data = msg[14:]
			else:
				masks = msg[2:6]
				data = msg[6:]

			i = 0
			for d in data:
				raw_str += chr(ord(d) ^ ord(masks[i % 4]))
				i = i + 1

		print "[raw data]:%s"%raw_str
		return raw_str





class WebSocketServer(object): 
	def __init__(self):
		self.socket = None  

	def begin(self):
		print "WebSocketServer Start!"
		self.socket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
		self.socket.bind((HOST,PORT))
		#the count of connections
		self.socket.listen(50)

		global connectionlist

		i = 0
		while True:
			connection, reomte = self.socket.accept()
			username = reomte[0] 

			#Add new threading into the pool
			newSocket = WebSocket(connection, i, username, reomte) 
			newSocket.start()
			connectionlist['connection'+str(i)] = connection
			i = i + 1





if __name__ == '__main__':
	server = WebSocketServer()
	server.begin()









  
