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
            ],
            funName: [
                "exceptionHandler",
                "reLogin"
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

            ],
            funName: [
                "exceptionHandler",
                "reloadGroupInfo", //重新加载group信息
                "deleteGroupSend"
            ]
        },
        {
            name: "fileManager",
            serFun: [
                "getVersion",
                "getPhotoService",
                "getDownServiceForMsgKey",
                "getUpFileService"
            ],
            funName: [
                "exceptionHandler"
            ]
        }
    ];
    // var i = 0;
    // var aa = setInterval(function () {
    //     i++;
    //     if (i > 1000) {
    //         clearInterval(aa);
    //         aa = null;
    //     }
    //     console.log("尝试连接" + i);
    //     let loadServiceConn1 = $.hubConnection("http://localhost:10156/");
    //     let loadServiceProxy1 = loadServiceConn1.createHubProxy("serviceManager");
    //     loadServiceProxy1.state.ClientType = "HubNonAutoProxy";
    //     loadServiceConn1.start({ xdomain: true }).done(function () {
    //         console.log("连接成功");
    //         loadServiceProxy1.invoke("getMessageService").done(function (result) {
    //             console.log("!!!!!!!!!!!!!!!", result);
    //         });
    //     });
    // }, 10)
    window.GetMessageService = function (data) {
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
            data: {},
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
                //注册回调本地事件
                console.log("装载监听事件");
                $.each(v.funName, function (ii, values) {
                    window["_" + v.name].on(values, function () {
                        console.log(v.name + "------" + values + ":", arguments);
                        if (window["_" + v.name][values]) {
                            window["_" + v.name][values](...arguments);
                        }
                        else {
                            console.log(v.name + "没有注册" + values + "事件");
                        }
                    });
                });

            });
            window._userManager.exceptionHandler = errShow;
            window._fileManager.exceptionHandler = errShow;
            window._orgManager.exceptionHandler = errShow;
            window._msgManager.exceptionHandler = errShow;
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















    //$.connection.hub.url = window.config.signalRUrl + "/signalr";



    // $.connection.msg.client.sendMsg=function(){
    //     console.log(arguments);
    //     console.log("$.connection.msg.client.sendMsg");
    // };
    //循环装载事件
    // $.each(hubList, function (i, v) {
    //     window["_" + v.name] = $.connection[v.name];
    //     window[v.name] = $.connection[v.name].server;
    //     $.each(v.funName, function (ii, values) {
    //         window["_" + v.name].client[values] = function () {
    //             console.log(v.name + "------" + values + ":", arguments);
    //             if (window["_" + v.name][values]) {
    //                 window["_" + v.name][values](...arguments);
    //             }
    //             else {
    //                 console.log(v.name + "没有注册" + values + "事件");
    //             }
    //         };
    //         //console.log(window["_" + v.name].client[values]);
    //     });
    // });
    // $.connection.hub.received(function (data) {
    //     console.log("received", data);
    // });





    // var tttt = [];
    // tttt.push({ key: "123", values: "123" });
    // function test(k) {
    //     for (var i = 0; i < tttt.length; i++) {
    //         if (tttt[i].key == k) {
    //             return tttt[i];
    //         }
    //     }
    // }
    // test("123").values = "!!!!!!!!!!";
    // console.log("!!!!",tttt);


    // //所有上传的文件记录
    // window.downFileList = [];
    // //上传文件
    // window.downFileAdd = function (fileKey, fileSavePath, props) {
    //     window.downFileList.push({ FileKey: fileKey, FileSave: fileSavePath, props: props, state: "wait" });
    // };
    // //启动下载进程
    // var timerDownFile = setInterval(function () {
    //     console.log(window.downFileList)
    //     //查询是否有需要下载的.
    //     if (window.downFileList.length > 0) {
    //         //查询是否有下载中的.
    //         var isStaring = false;
    //         for (var i = 0; i < window.downFileList.length; i++) {
    //             if (window.downFileList[i].state == "starting") {
    //                 isStaring = true;
    //                 break;
    //             }
    //         }
    //         if (isStaring) { return; }
    //         for (var i = 0; i < window.downFileList.length; i++) {
    //             if (window.downFileList[i].state == "wait") {
    //                 window.downFileList[i].state = "starting";
    //                 var data = { Key: window.downFileList[i].FileKey };
    //                 console.log(window.config.ServiceUrl);
    //                 console.log(window.config.ServiceUrl.split(':')[1]);
    //                 data = JSON.stringify(data);
    //                 var options = {
    //                     method: 'POST',
    //                     host: window.config.ServiceUrl.split(':')[1].replace('//',''),
    //                     port:window.config.ServiceUrl.split(':')[2],
    //                     path: "/api/FileManager/Down",
    //                     headers: {
    //                         "invitation": "govnet",
    //                         "ticket": window.ticket,
    //                         "Content-Type": 'application/json',
    //                         "Content-Length": data.length
    //                     }
    //                 };
    //                 console.log(options);
    //                 var req = window.http.request(options, function (res) {
    //                     console.log("11111111111111111111")
    //                     var fileDownSize = 0;
    //                     var fileSize = parseInt(res.headers["content-length"]);
    //                     res.on('data', function (chunk) {

    //                         fileDownSize = fileDownSize + chunk.length;
    //                         console.log("11111111111111111111", parseInt((fileDownSize / fileSize) * 100))
    //                         window.downFileList[i].progress = parseInt((fileDownSize / fileSize) * 100);
    //                     });
    //                     var writestream = window.fs.createWriteStream(savefile);
    //                     writestream.on('data', function (chunk) {
    //                         console.log(chunk);
    //                     });
    //                     writestream.on('close', function () {
    //                         window.downFileList[i].state = "end";
    //                         callback ? callback(null, res) : null;
    //                     });
    //                     res.pipe(writestream);
    //                 });
    //                 req.on('error', function (e) {
    //                     console.log(e);
    //                     window.downFileList[i].state = "error";
    //                 });
    //                 console.log(data);
    //                 req.write(data + "\n");
    //                 req.end();



    //                 // window.xhr = new XMLHttpRequest();
    //                 // xhr.responseType = "arraybuffer";
    //                 // xhr.addEventListener("progress", function (evt) {
    //                 //     console.log("progress", evt);
    //                 //     window.downFileList[i].progress = evt;
    //                 // }, false);
    //                 // xhr.addEventListener("load", function (evt) {
    //                 //     //console.log("测试1", evt);
    //                 //     //var rfile = toBuffer(evt.target.response);
    //                 //     //console.log("开始保存文件", rfile);

    //                 //     // window.fs.writeFile(window.downFileList[i].FileSave, rfile, null, function (err) {
    //                 //     //     window.downFileList[i].state = "end";
    //                 //     //     console.log("下载成功 ");
    //                 //     // });

    //                 //     // var fileReader = new window.FileReader();
    //                 //     // fileReader.readAsDataURL(evt.target.response);
    //                 //     // fileReader.onloadend = function () {
    //                 //     //     console.log(fileReader);
    //                 //     //     //image.src = fileReader.result;
    //                 //     // }

    //                 //     // var writeStream = window.fs.createWriteStream(window.downFileList[i].FileSave);
    //                 //     // rfile.pipe(writeStream);
    //                 //     // writeStream.on('close', function () {
    //                 //     //     window.downFileList[i].state = "end";
    //                 //     //     console.log("下载成功");
    //                 //     // });

    //                 //     // // var readStream=window.fs.createReadStream(evt.target.response);
    //                 //     //  var writeStream = window.fs.createWriteStream(window.downFileList[i].FileSave);
    //                 //     // // readStream.on('data',function(chunk){
    //                 //     // //     console.log("!",chunk);
    //                 //     // //     writeStream.write(chunk);
    //                 //     // // });
    //                 //     // // readStream.on('end',function(){

    //                 //     // // });
    //                 //     // writeStream.on('close', function () {
    //                 //     //     window.downFileList[i].state = "end";
    //                 //     //     console.log("下载成功");
    //                 //     // });
    //                 //     // //writeStream.pipe(evt.target.response)
    //                 //     // evt.target.pipe(writeStream);

    //                 //     // console.log(evt.target.response);
    //                 //     // window.fs.writeFile(window.downFileList[i].FileSave, rfile, function (err) {
    //                 //     //     window.downFileList[i].state = "end";
    //                 //     //     console.log("下载成功 ");
    //                 //     // });

    //                 // }, false);
    //                 // xhr.addEventListener("error", function (evt) {
    //                 //     window.downFileList[i].state = "error";
    //                 // }, false);
    //                 // xhr.addEventListener("abort", function (evt) {
    //                 //     window.downFileList[i].state = "abort";
    //                 // }, false);
    //                 // xhr.open("POST", window.config.ServiceUrl + "/api/FileManager/Down");
    //                 // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //                 // //xhr.setRequestHeader("Content-Type","multipart/form-data;");
    //                 // xhr.setRequestHeader("invitation", "govnet");
    //                 // xhr.setRequestHeader("ticket", window.ticket);
    //                 // console.log(JSON.stringify(fd), window.downFileList[i].FileKey)
    //                 // xhr.send("Key=" + window.downFileList[i].FileKey);
    //                 break;
    //             }
    //         }


    //     }
    // }, 1000);





    // //所有上传的文件记录
    // window.upFileList = [];
    // //上传文件
    // window.upFileAdd = function (data, props) {
    //     console.log(data);
    //     upFileList.push({ MsgKey: props.Key, fileName: data.name, file: data, props: props, state: "wait" });
    // };

    // //启动上传线程
    // var timerUpFile = setInterval(function () {
    //     if (window.upFileList.length > 0) {
    //         var isStaring = false;
    //         for (var i = 0; i < window.upFileList.length; i++) {
    //             if (window.upFileList[i].state == "starting") {
    //                 isStaring = true;
    //                 break;
    //             }
    //         }
    //         if (isStaring) { return; }


    //         for (var i = 0; i < window.upFileList.length; i++) {
    //             if (window.upFileList[i].state == "wait") {
    //                 window.upFileList[i].state = "starting";
    //                 //检测是否能检测md5，如果能检测，进行md5检测，进行秒传。
    //                 if (window.md5) {
    //                     window.md5(window.upFileList[i].file.path, function (err, result) {
    //                         if (err) { console.log(err); return; }
    //                         console.log(result)
    //                     });
    //                 }

    //                 var fd = new FormData();
    //                 fd.append("FileData", window.upFileList[i].file);
    //                 fd.append("fileName", window.upFileList[i].file.name);
    //                 for (var key in window.upFileList[i].props) {
    //                     fd.append(key, window.upFileList[i].props[key]);
    //                 }
    //                 window.xhr = new XMLHttpRequest();

    //                 xhr.upload.addEventListener("progress", function (evt) {
    //                     console.log("progress", evt);
    //                     window.upFileList[i].progress = evt;
    //                 }, false);
    //                 xhr.addEventListener("load", function (evt) {
    //                     window.upFileList[i].state = "end";
    //                     window.upFileList[i].fileKey = evt.currentTarget.responseText.replace('"', '').replace('"', '');
    //                     window.msgManager.messageFileSendMsg({ MsgKey: window.upFileList[i].MsgKey, FileKey: evt.currentTarget.responseText });
    //                 }, false);
    //                 xhr.addEventListener("error", function (evt) {
    //                     window.upFileList[i].state = "error";
    //                 }, false);
    //                 xhr.addEventListener("abort", function (evt) {
    //                     window.upFileList[i].state = "abort";
    //                 }, false);
    //                 xhr.open("POST", window.config.ServiceUrl + "/api/FileManager/Up");
    //                 //xhr.setRequestHeader("Content-Type","multipart/form-data;");
    //                 xhr.setRequestHeader("invitation", "govnet");
    //                 xhr.setRequestHeader("ticket", window.ticket);
    //                 xhr.send(fd);
    //                 break;
    //             }
    //         }

    //     }
    // }.bind(this), 1000);

    //发送系统文件
    // window.send = function () {
    //     if (arguments.length > 1) {
    //         for (var key in arguments[1]) {
    //             if (arguments[1][key] instanceof Date) {
    //                 arguments[1][key] = Util.timeFormat(arguments[1][key], 'yyyy-MM-dd hh:mm:ss');
    //             }
    //             if (arguments[1][key] instanceof Array) {
    //                 arguments[1][key] = arguments[1][key].join(",");
    //             }
    //         }
    //     }
    //     var url = window.config.ServiceUrl + "/api/" + arguments[0];
    //     var data = arguments[1];
    //     return $.ajax({
    //         url: url,
    //         data: JSON.stringify(data),
    //         dataType: "json",
    //         type: "post",
    //         contentType: "application/json",
    //         headers: {
    //             invitation: "nbtx"
    //         },
    //     }).fail(function (e) {
    //         var json = $.parseJSON(e.responseText);
    //         if (json.ExceptionMessage) {
    //             message.error(json.ExceptionMessage);
    //         }
    //         else {
    //             message.error(json.Message);
    //         }
    //     });
    // };

}
catch (e) {

}