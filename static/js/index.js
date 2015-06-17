
//========config=========
var _my_id = 1;   //login id
var _user_id = 0; //current talking to ...

$(function(){
	//loadContacts();

	//loadDemoMessages();
})

function loadContacts(){
    var html = "";
	html += "<div id='{0}' class='customer' onclick='SelecteUser(this)'>";
	html += "<span class='name'>{1}</span>";
	//html += "<button type='button' class='close' >&times;</button>";
	html += "</div>";

    $.ajax({
        type: "get",
        url: "/api/load_contact/",
        data: {},
        dataType: "json",
        success: function (data) {
            //clear the div
            $("#dCustomers").empty();

            console.log(data.users)
            var users = data.users;
            for(var i=0; i<users.length; i++){
                var user_html = html.replace("{0}",users[i].id).replace("{1}",users[i].name);
		        $("#dCustomers").append(user_html);
	        }
        }
    });
	//$("#spMsgCount")[0].innerHTML = count;
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

function SelecteUser(obj){
    var user_id = obj.id;
    var user_name = obj.children[0].innerHTML;

    _user_id = user_id;
    $("#lblCustomerName")[0].innerHTML = user_name;

    $(".selectedUser").removeClass("selectedUser");
    $("#"+user_id).addClass("selectedUser");
}

function CheckSession(){
    if(_user_id == 0){
        showWarning("请选择联系人");
        return false;
    }
    else{
        closeWarning();
    }
}

function SendMessage(){
    var msg = $("#txtMsg").val();
    msg = msg.replace(/\n/gm,"<br/>");
    if(msg == ""){
        showWarning("内容不能为空");
        return false;
    }
    else{
        closeWarning();
    }

    var msgHtml = "";
    msgHtml += "<div class='mymsg'>";
	msgHtml += "	<div class='msg-content'>";
	msgHtml += "		{0}";
	msgHtml += "	</div>";
	msgHtml += "</div>";

    console.log(msg);
    $("#dMsg").append(msgHtml.replace("{0}",msg));
    $("#txtMsg").val("");
}

function showWarning(msg){
    var warnTip = "<div id='divWarning' class='alert alert-warning' role='alert'>{0}</div>";
    $("#dMsg").append(warnTip.replace("{0}",msg));
}

function closeWarning(){
    $("#divWarning").remove();
}




