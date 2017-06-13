// // Proxy created on the fly
import { message } from 'antd';
import Util from 'components/mod/util/util.js'
try {
    window.downUpList = [];
    function getDownUpFile(key) {
        for (var i = 0; i < window.downUpList.length; i++) {
            if (window.downUpList[i].key == key) {
                return window.downUpList[i];
            }
        }
        return null;
    }
    function abort(key) {
        for (var i = 0; i < window.downUpList.length; i++) {
            if (window.downUpList[i].key == key) {
                if (window.downUpList[i].type == "up") {
                    if (window.downUpList[i].xhr != null)
                        window.downUpList[i].xhr.abort();
                    window.downUpList[i].state = "abort";
                    if (window.deleteMsg != null)
                        window.deleteMsg(key);
                }
                else {
                    if (window.downUpList[i].req != null)
                        window.downUpList[i].req.abort();
                    window.downUpList[i].state = "abort";
                }
            }
        }
    }
    function clearList() {
        for (var i = window.downUpList.length - 1; i >= 0; i--) {
            if (window.downUpList[i].state != "begin") {
                window.downUpList.splice(i, 1);
            }
        }
    }
    function clear(key) {
        for (var i = window.downUpList.length - 1; i >= 0; i--) {
            if (window.downUpList[i].key == key) {
                window.downUpList.splice(i, 1);
                break;
            }
        }
    }
    window.downUpList["getDownUpFile"] = getDownUpFile;
    window.downUpList["abort"] = abort;
    window.downUpList["clearList"] = clearList;
    window.downUpList["clear"] = clear;

    var hubList = [
        {
            name: "msgManager",
            serFun: [
                "getTicket",
                "myOftenList",
                "noSendMsgGet",
                "messageListFileQuery",
                "messageList",
                "myOftenListReadClear",
                "msgReaded",
                "myOftenListAdd",
                "myOftenListDel",
                "sendMessage",
                "messageFileSend",
                "revokeMessage",
                "delMessage",
                "messageFileSendMsg",
                "fileMd5",
                "sendMsgReturn",
                "groupMsgReadUserList"
            ],
            funName:
            [
                "exceptionHandler",
                "sendMsg",//接受到新消息
                "receiveMsg",//撤销消息
                "msgReadedList" //消息被阅读了
            ]
        },
        {
            name: "userManager",
            serFun: [
                "signIn",
                "settingConfigGet",
                "editPassword",
                "settingConfigSet"
            ]
        },
        {
            name: "orgManager",
            serFun: [
                "myOrgList",
                "userInfo",
                "getGroupInfoForGroupKey",
                "getGroupUsersFormGroupKey",
                "getGroupUsersHaveExitUserFormGroupKey",
                "editGroupNameForGroupKey",
                "editGroupOnlyManagerForKey",
                "editGroupLookLogMsg",
                "search",
                "upBrief",
                "editGroupMainUserForGroupKey",
                "exitGroup",
                "delGroup",
                "addFriend",
                "friendList",
                "groupList",
                "removeFriend",
                "delteGroupUser"
            ]
        },
        {
            name: "fileManager",
            serFun: [
                "getVersion",
                "getPhotoService",
                "getDownServiceForMsgKey",
                "getUpFileService"
            ]
        }
    ];
    var hubClientList = ["deleteGroupSend", "reloadGroupInfo", "reLogin", "sendMsg", "receiveMsg", "msgReadedList"];
    window.GetMessageService = function (data) {
        data.Type="1";
        var url = window.config.ServiceUrl + "/api/AuthorizationManager/LoginService";
        return $.ajax({
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            type: "post",
            contentType: "application/json",
            headers: {
                invitation: "nbtx"
            },
        }).fail(function (e) {
            var json = $.parseJSON(e.responseText);
            if (json.ExceptionMessage) {
                message.error(json.ExceptionMessage);
            }
            else {
                message.error(json.Message);
            }
        });
    };
    window.testNet = function () {
        var url = window.config.ServiceUrl + "/api/AuthorizationManager/TestConnService";
        return $.ajax({
            url: url,
            data: {Typ:"1"},
            dataType: "json",
            type: "post",
            contentType: "application/json",
            headers: {
                invitation: "nbtx"
            },
        });
    }
    window.headPic = function (userKey, type = "1") {
        return "http://" + window.HeadPhotoService.ServiceIP + ":" + window.HeadPhotoService.ServicePort + "/api/FileManager/GetHeadPic?invitation=nbtx&serviceKey=" + window.HeadPhotoService.MessageServiceKey + "&ticket=" + window.HeadPhotoService.QueryKey + "&type=" + type + "&userKey=" + userKey;
    }
    window.img = function (key, big = "0") {
        return window.config.picUrl + "/api/FileManager/GetPicForMsgKey?invitation=govnet&ticket=" + window.ticket + "&key=" + key + "&big=" + big;
    }

    window.myStart = function (okCallBack, errCallBack, stateChangedCallBack, disconnectedCallBack) {
        try {
            window.messageServiceConn = $.hubConnection("http://" + window.MessageServiceInfo.ConnServiceIP + ":" + window.MessageServiceInfo.ConnServicePort + "/");
            console.log("准备装载事件");
            $.each(hubList, function (i, v) {
                var proxy = window.messageServiceConn.createHubProxy(v.name);
                proxy.ClientType = "HubNonAutoProxy";

                window["_" + v.name] = proxy;
                window[v.name] = proxy;
                //注册服务端事件
                console.log("装载服务端事件");
                $.each(v.serFun, function (ii, values) {
                    window[v.name][values] = function () {
                        console.log(values);
                        return window[v.name].invoke(values, ...arguments);
                    };
                });
            });
            //注册回调本地事件
            console.log("装载监听事件");
            window.clientHub=window.messageServiceConn.createHubProxy("clientManager");
            $.each(hubClientList, function (i, value) {
                window.clientHub.on(value, function () {
                    console.log(value + ":", arguments);
                    if (window.clientHub[value]) {
                        window.clientHub[value](...arguments);
                    }
                    else {
                        console.log("没有注册" + value + "事件");
                    }
                });
            });
            window.clientHub.exceptionHandler=errShow;
            console.log(window.messageServiceConn);
            window.messageServiceConn.stateChanged(function (change) {
                console.log("object");
                if (change.newState == 2) {
                    window.messageTimerConn = setInterval(function () {
                        message.error("与服务器断开连接,正在连接中....");
                    }, 3000)
                }
                else {
                    if (change.newState == 1 && change.oldState == 2) {
                        message.info("重新连接成功....");
                    }
                    if (window.messageTimerConn) {
                        clearInterval(window.messageTimerConn);
                        window.messageTimerConn == null;
                    }

                }

                stateChangedCallBack ? stateChangedCallBack(change) : null;
            });
            window.messageServiceConn.disconnected(function (error) {
                message.error("与服务器断开连接,请重新登录.");
                disconnectedCallBack ? disconnectedCallBack(error) : null;
            })
            window.messageServiceConn.start({ xdomain: true }).done(okCallBack).fail(errCallBack);


        }
        catch (e) {
            console.log("出现异常", e);
        }
    };
    //注册所有异常助理
    function errShow(msg) {
        message.error(msg);
    }
}
catch (e) {

}