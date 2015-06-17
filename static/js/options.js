/**
 * Created by ansoft on 15/6/17.
 */

$(function(){
    $("#btnSendMsg").click(function () {
       //Check Session
        if(CheckSession()==false)
            return false;

        //Send Msg
        if(SendMessage()==false)
            return false;

    });

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


    $("#btnMessage").click(function(){
        $("#liContact").removeClass("active");
        $("#liMessage").addClass("active");
    });

    $("#btnContact").click(function(){
        $("#liMessage").removeClass("active");
        $("#liContact").addClass("active");

        //load contacts
        loadContacts();
    });


})

