$(function(){
	loadContacts();

	loadDemoMessages();
})


function loadContacts(){
	var count = 5;
	var html = "";
	html += "<div class='customer'>";
	html += "<span class='name'>Jack</span>";
	html += "<button type='button' class='close' >&times;</button>";
	html += "</div>";		

	for(var i=0; i<count; i++){
		$("#dCustomers").append(html);
	}	

	$("#spMsgCount")[0].innerHTML = count;							
}


function loadDemoMessages(){
	var msg = "";
	var timeMsg = "";

	msg += "<div class='{0}'>";
	msg += "	<div class='msg-content'>";
	msg += "		{1}";
	msg += "	</div>";
	msg += "</div>";


	timeMsg += "<div class='msg-time'>";
	timeMsg += "	{0}";
	timeMsg += "</div>";

	//Tag: 0 is mine, 1 is customer
	//Content: the message
	//Time: sendtime
	var data = [
		{"tag":1,"content":"Hi","time":"10:01:34"},
		{"tag":0,"content":"您好","time":"10:01:36"},
		{"tag":1,"content":"请问你明天有空嘛？","time":"10:01:40"},
		{"tag":0,"content":"有啊，怎么了？","time":"10:01:54"},
		{"tag":1,"content":"想请你出去吃个饭，OK?","time":"10:02:02"},
		{"tag":0,"content":"好啊，什么时候，什么地方？","time":"10:02:07"},
		{"tag":1,"content":"晚上6点吧，陆家嘴环线等我","time":"10:02:10"},
		{"tag":0,"content":"可以，那到时候见","time":"10:02:20"},
		{"tag":1,"content":"OK, Bye!","time":"10:02:30"}
	]

	var minute = 0;
	var style = "";
	for(var i=0;i<data.length;i++){
		var tmpMinute = data[i].time.split(":")[1];
		//show time
		if(minute != tmpMinute){
			$("#dMsg").append(timeMsg.replace("{0}",data[i].time));
			minute = tmpMinute;
		}

		switch(data[i].tag){
			case 0: //my message
				style = "mymsg";
				break;
			case 1: //customer message
				style = "yourmsg";
				break;
		}

		$("#dMsg").append(msg.replace("{0}",style).replace("{1}",data[i].content));		

	}
}








