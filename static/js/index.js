
//========config=========
var _is_seesion_panel = true;
var _my_id = 1;   //login id
var _user_id = 0; //current talking to ...0 is nobody
var _Message_Interval_ID = 0; //单次对话到轮询id
var _Message_Interval_Time = 1000;//1秒刷新一次
var _Session_Interval_ID = 0; //获取Session轮询的id
var _Session_Interval_Time = 5000;//5秒刷新一次
var _Is_Remove_Session = false;

//=======html===========
 var _SendMsgHtml = "";
     _SendMsgHtml += "<div class='mymsg'>";
	 _SendMsgHtml += "	<div class='msg-content'>";
 	 _SendMsgHtml += "		{0}";
	 _SendMsgHtml += "	</div>";
	 _SendMsgHtml += "</div>";

var _ReceiveMsgHtml = "";
	_ReceiveMsgHtml += "<div id='{0}' class='yourmsg'>";
	_ReceiveMsgHtml += "	<div class='msg-content'>";
	_ReceiveMsgHtml += "		{1}";
	_ReceiveMsgHtml += "	</div>";
	_ReceiveMsgHtml += "</div>";

var _TimeMsg = "";
	_TimeMsg += "<div class='msg-time'>";
	_TimeMsg += "	{0}";
	_TimeMsg += "</div>";


$(function(){
    //每隔5秒搜索Session
    ReceiveSession();
    SessionInterval();

    //点击按钮发送信息
    $("#btnSendMsg").click(function () {
       //Check Session
        if(CheckSession()==false)
            return false;
        //Send Msg
        SendMessage();
    });

    //加载会话信息(session)
    $("#btnSession").click(function(){
        $("#dCustomers").empty();
        $("#liContact").removeClass("active");
        $("#liMessage").addClass("active");
        _is_seesion_panel = true;
        //获取最最新的Session
        ReceiveSession();
    });

    //加载联系人信息
    $("#btnContact").click(function(){
        $("#dCustomers").empty();
        $("#liMessage").removeClass("active");
        $("#liContact").addClass("active");
        _is_seesion_panel = false;
        //load contacts
        LoadContacts();
    });

    //添加联系人
	$("#btnAddUser").click(function(){
        $.ajax({
            type: "get",
            url: "/api/add_user/5/",
            data: {},
            dataType: "json",
            success: function (data) {
               console.log(data);
            }
        });
 	});

    //重置数据库
    $("#btnReset").click(function(){
 		$.ajax({
            type: "get",
            url: "/api/reset_user/",
            data: {},
            dataType: "json",
            success: function (data) {
               console.log(data);
            }
        });
 	});
})

//检查会话状态是否合法
//联系人不能为空，消息不能为空
function CheckSession(){
    if(_user_id == 0){
        ShowWarning("请选择联系人");
        return false;
    }
    else{
        CloseWarning();
    }

    var msg = $("#txtMsg").val();
    msg = msg.replace(/\n/gm,"<br/>");
    if(msg == ""){
        ShowWarning("内容不能为空");
        return false;
    }
    else{
        CloseWarning();
    }
}

//执行信息发送
function SendMessage(){
    //the msg json
    _my_id = parseInt($("#txtMyID").val());//using test
    var msg = $("#txtMsg").val();
    var msg_json = {"f":_my_id,"t":_user_id,"msg":msg,"status":0}
    console.log(msg_json)

    //Send the message to server
    var token = $("input[name='csrfmiddlewaretoken']").val();
    $.ajax({
        type: "post",
        url: "/api/send_message/",
        data: JSON.stringify(msg_json),
        dataType: "json",
        success: function (data) {
            $("#dMsg").append(_SendMsgHtml.replace("{0}",$("#txtMsg").val()));
            $("#dMsg").scrollTop($("#dMsg")[0].scrollHeight);
            $("#txtMsg").val("");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

		},
		headers: {
			"X-CSRFToken": token
		},
		complete: function(){

		}
    });
}

//会话时候，每隔一秒刷新信息
function ReceiveMessage(){
    _Message_Interval_ID = setInterval(function () {
        console.log("Refresh Message")
        $.ajax({
            type: "get",
            url: "/api/receive_message/",
            data: {"f_id":_user_id,"t_id":_my_id},
            dataType: "json",
            success: function (data) {
                if(_user_id!=0){
                    $("#lblCustomerName")[0].innerHTML = $("#"+_user_id+">.name")[0].innerHTML;
                }

                var messages = data.messages;
                //Receive message and show on the page
                ShowMessages(messages);

                //collect the msg id list
                var msg_id_list = new Array();
                for(var i=0;i<messages.length;i++){
                    msg_id_list.push(messages[i].id);
                }

                //change the msg status
                //status=2: 已经读了
                SetMessagesStatus(msg_id_list,2)
            }
        });
    },_Message_Interval_Time)
}

//每隔5秒搜索Session
function SessionInterval(){
    _Session_Interval_ID = setInterval(function(){
        //执行搜索信息
        ReceiveSession();
        console.log("refresh  session")
    },_Session_Interval_Time);
}

//获取Session信息
function ReceiveSession() {
     $.ajax({
            type: "get",
            url: "/api/receive_session/",
            data: {},
            dataType: "json",
            success: function (data) {
                var sessions = data.sessions;
                //Mark how many sessions
                $("#spMsgCount")[0].innerHTML = sessions.length;

                if(_is_seesion_panel == true){
                    LoadSessions(sessions)
                }
            }
     });
}

//获取信息后显示
function ShowMessages(messages){
    var minute = 0;
	var style = "";

	for(var i=0;i<messages.length;i++){
        //获取分钟，然后划分割线
		var tmpMinute = messages[i].time.split(":")[1];
		//show time
		if(minute != tmpMinute){
            var showTime =messages[i].time.substring(10,18);
			$("#dMsg").append(_TimeMsg.replace("{0}",showTime));
			minute = tmpMinute;
		}
        //加载信息
		$("#dMsg").append(_ReceiveMsgHtml.replace("{0}",messages[i].id).replace("{1}",messages[i].msg));
	}
    //设置滚动条到最后端
    $("#dMsg").scrollTop($("#dMsg")[0].scrollHeight);
}

//获取信息后设置信息状态，一般改为已读
function SetMessagesStatus(msg_id_list,status){
    //organize the data
    var data_json = {
        "msg_id_list":msg_id_list,
        "status":status
    }

    //Send the message to server
    var token = $("input[name='csrfmiddlewaretoken']").val();
    $.ajax({
        type: "post",
        url: "/api/set_message_status/",
        data: JSON.stringify(data_json),
        dataType: "json",
        success: function (data) {

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

		},
		headers: {
			"X-CSRFToken": token
		},
		complete: function(){

		}
    });
}

//获取信息后设置信息状态，一般改为已读
function SetMessagesStatus2(f_id,t_id,status){
    //organize the data
    var data_json = {
        "f_id":f_id,
        "t_id":t_id,
        "status":status
    }
    console.log(data_json);

    //Send the message to server
    var token = $("input[name='csrfmiddlewaretoken']").val();
    $.ajax({
        type: "post",
        url: "/api/set_message_status2/",
        data: JSON.stringify(data_json),
        dataType: "json",
        success: function (data) {
            _Is_Remove_Session = false;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

		},
		headers: {
			"X-CSRFToken": token
		},
		complete: function(){

		}
    });
}

//在联系人中选择人物进行会话
function SelecteUser(obj){
    if(_Is_Remove_Session == false) {
        var user_id = obj.id;
        var user_name = obj.children[0].innerHTML;

        //获取当前对话人的id
        _user_id = parseInt(user_id);
        $(".selectedUser").removeClass("selectedUser");
        $("#" + user_id).addClass("selectedUser");

        //移除图章信息,如果存在的话
        $("#" + user_id + ">.badge").hide();

        //开始会话并且获取信息
        //停止曾经的对话，清空以前的会话信息
        $("#dMsg").empty();
        $("#txtMsg").empty();
        window.clearInterval(_Message_Interval_ID)
        ReceiveMessage();
    }
}

//移除会话
function RemoveUser(user_id){
    _Is_Remove_Session = true;
    //set no body
    _user_id = 0;
    $("#"+user_id).remove();

    //开始会话并且获取信息
    //停止曾经的对话，清空以前的会话信息
    $("#dMsg").empty();
    $("#txtMsg").empty();
    window.clearInterval(_Message_Interval_ID);

     //Set the message has read
    console.log($("#txtMyID").val());
    _my_id = parseInt($("#txtMyID").val());//using test
    SetMessagesStatus2(user_id,_my_id,2);
}

//加载联系人信息
function LoadContacts() {
    var html = "";
    html += "<div id='{0}' class='customer' onclick='SelecteUser(this)'>";
    html += "<span class='name'>{1}_{2}</span>";
    html += "</div>";

    $.ajax({
        type: "get",
        url: "/api/load_contact/",
        data: {},
        dataType: "json",
        success: function (data) {
            var users = data.users;
            for (var i = 0; i < users.length; i++) {
                var user_html = html.replace("{0}", users[i].id).replace("{1}", users[i].name).replace("{2}", users[i].id);
                $("#dCustomers").append(user_html);
            }
        }
    });
}

//加载Session
function LoadSessions(users){
    var html = "";
    html += "<div id='{0}' class='customer' onclick='SelecteUser(this)'>";
    html += "<span class='name'>{1}</span>";
    html += "<span class='badge'>{2}</span>"
    html += "<button type='button' class='close' onclick='RemoveUser({3})' >&times;</button>";
    html += "</div>";

    for (var i = 0; i < users.length; i++) {
        var user_id = users[i].id;
        //如果当前联系人已经存在，并且此人不在会话时候，那么就仅仅跟新其新的信息
        if($("#"+user_id) && $("#"+user_id).length == 1 && parseInt(user_id) != _user_id){
             $("#"+user_id+">.badge").show();
             $("#"+user_id+">.badge")[0].innerHTML = users[i].msg.length;
        }
        else if(parseInt(user_id) != _user_id){
            var user_html = html.replace("{0}", user_id).replace("{1}", users[i].name).replace("{2}", users[i].msg.length).replace("{3}", user_id);
            $("#dCustomers").append(user_html);
        }
    }

}

//显示错误提示信息
function ShowWarning(msg){
    var warnTip = "<div id='divWarning' class='alert alert-warning' role='alert'>{0}</div>";
    $("#dMsg").append(warnTip.replace("{0}",msg));
}

//关闭错误提示信息
function CloseWarning(){
    $("#divWarning").remove();
}




