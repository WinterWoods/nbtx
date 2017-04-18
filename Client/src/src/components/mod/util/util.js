
import { message } from 'antd';
var messageAudio = require('../../../assets/audio/message.mp3');

export default class Util {
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    static timeFormat(strdate, fmt) {
        var daytime;
        if (strdate instanceof Date) {
            daytime = strdate;
        }
        else {
            if (strdate == null) return "";
            if (!fmt) fmt = "hh:mm:ss";
            var _time = Date.parse(strdate.replace(/-/g, "/").replace("T", " "));
            daytime = new Date(_time);
        }

        var o = {
            "M+": daytime.getMonth() + 1,                 //月份
            "d+": daytime.getDate(),                    //日
            "h+": daytime.getHours(),                   //小时
            "m+": daytime.getMinutes(),                 //分
            "s+": daytime.getSeconds(),                 //秒
            "q+": Math.floor((daytime.getMonth() + 3) / 3), //季度
            "S": daytime.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (daytime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    static getLastTime(time) {

        if (Util.timeFormat(time, "yyyy-MM-dd") == Util.timeFormat(new Date(), "yyyy-MM-dd")) {
            return Util.timeFormat(time, "hh:mm");
        }
        else if (Util.timeFormat(time, "yyyy") == Util.timeFormat(new Date(), "yyyy")) {
            return Util.timeFormat(time, "MM-dd");
        }
        else {
            return Util.timeFormat(time, "yyy-MM-dd");
        }
    }
    static getLastDateTime(time) {

        if (Util.timeFormat(time, "yyyy-MM-dd") == Util.timeFormat(new Date(), "yyyy-MM-dd")) {
            return Util.timeFormat(time, "hh:mm");
        }
        else if (Util.timeFormat(time, "yyyy") == Util.timeFormat(new Date(), "yyyy")) {
            return Util.timeFormat(time, "MM-dd  hh:mm");
        }
        else {
            return Util.timeFormat(time, "yyy-MM-dd hh:mm");
        }
    }



    /**
     * download('http://weibo.com/', '/tmp/downfile.html', function(err, res,progress) {
        *console.log(res.statusCode, res.headers);
        *});
     */
    static download(key, msgKey, savefile, data, urlPath) {
        window.downUpList.abort(key);
        window.downUpList.clear(key);
        window.downUpList.push({ key: key, type: "down", msgKey: msgKey, filePath: savefile, props: data, state: "wait", req: null, progress: 0, err: null, downPath: null });
        var _downUpList = window.downUpList.getDownUpFile(key);
        if (urlPath == null) {
            urlPath = "/api/FileManager/DownForMsgKey";
        }
        _downUpList.state = "getService";
        window.fileManager.getDownServiceForMsgKey({ MsgKey: msgKey }).done(function (result) {
            console.log(result);
            data.MessageServiceKey = result.MessageServiceKey;
            data.QueryKey = result.QueryKey;
            data.FileKey = result.FileKey;
            data = JSON.stringify(data);
            var options = {
                method: 'POST',
                host: result.ServiceIP,
                port: result.ServicePort,
                path: urlPath,
                headers: {
                    "invitation": "nbtx",
                    "ticket": result.QueryKey,
                    "Content-Type": 'application/json',
                    "Content-Length": data.length
                }
            };
            _downUpList.req = window.http.request(options, function (res) {
                var fileDownSize = 0;
                console.log(res);
                var fileSize = parseInt(res.headers["content-length"]);
                _downUpList.size = fileSize;
                res.on('data', function (chunk) {
                    fileDownSize = fileDownSize + chunk.length;
                    _downUpList.progress = parseInt((fileDownSize / fileSize) * 100);
                });
                var writestream = window.fs.createWriteStream(savefile);
                writestream.on('close', function () {
                    if (_downUpList.progress == 100) {
                        _downUpList.state = "end";
                        _downUpList.downPath = savefile;
                        message.info("下载成功!");
                    }
                });
                res.pipe(writestream);
            });
            _downUpList.req.on('error', function (e) {
                _downUpList.state = "error";
            });
            console.log(data);
            _downUpList.req.write(data + "\n");
            _downUpList.req.end();
            _downUpList.state = "begin";
        });
    }
    static UpLoadSend(_downUpList, callback) {
        //上传前去服务器拉去一个能上传的服务器
        window.fileManager.getUpFileService()
            .done(function (result) {
                console.log(result);
                var fd = new FormData();
                fd.append("FileData", _downUpList.file);
                fd.append("fileName", _downUpList.file.name);
                for (var k in _downUpList.props) {
                    fd.append(k, _downUpList.props[k]);
                }

                _downUpList.xhr = new XMLHttpRequest();
                _downUpList.xhr.upload.addEventListener("progress", function (evt) {
                    _downUpList.progress = parseInt((evt.loaded / evt.total) * 100);
                }, false);
                _downUpList.xhr.addEventListener("load", function (evt) {

                    var fileKey = evt.currentTarget.responseText.replace('"', '').replace('"', '');
                    console.log(fileKey);
                    _downUpList.FileKey = fileKey;
                    window.msgManager.messageFileSendMsg({ MsgKey: _downUpList.msgKey, FileKey: fileKey }).done(function () {
                        _downUpList.state = "end";
                        _downUpList.progress = 100;
                        callback ? callback() : null;
                    });
                }, false);
                _downUpList.xhr.addEventListener("error", function (evt) {
                    _downUpList.state = "error";
                    console.log(evt);
                }, false);
                _downUpList.xhr.addEventListener("abort", function (evt) {
                    _downUpList.state = "abort";
                    console.log(evt);
                }, false);
                _downUpList.xhr.open("POST", "http://" + result.ServiceIP + ":" + result.ServicePort + "/api/FileManager/Up");
                _downUpList.xhr.setRequestHeader("invitation", "nbtx");
                _downUpList.xhr.setRequestHeader("ticket", result.QueryKey);
                _downUpList.xhr.setRequestHeader("msgKey", _downUpList.msgKey);
                _downUpList.xhr.setRequestHeader("MessageServiceKey", result.MessageServiceKey);
                _downUpList.xhr.send(fd);
                _downUpList.state = "begin";
            }).fail(function (err) {
                _downUpList.state = "error";
            });

    }
    /**
     * upload('http://weibo.com/', '/tmp/bigfile.pdf', function(err, res,progress) {
            console.log(res.statusCode, res.headers);
        });
     * 
     * 
     */
    static upload(key, msgKey, fileName, fileSize, uploadfile, props, callback) {
        //添加window变量进行记录该上传,
        window.downUpList.push({ key: key, type: "up", msgKey: msgKey, fileName: fileName, fileSize: fileSize, file: uploadfile, props: props, state: "wait", xhr: null, progress: 0, err: null });

        var _downUpList = window.downUpList.getDownUpFile(key);

        if (window.crypto1) {
            _downUpList.state = "md5";
            var start = new Date().getTime();
            var md5sum = window.crypto1.createHash('md5');
            if (uploadfile.path) {
                var stream = window.fs.createReadStream(uploadfile.path);
                stream.on('data', function (chunk) {
                    md5sum.update(chunk);
                });
                stream.on('end', function () {
                    var str = md5sum.digest('hex').toUpperCase();
                    //查询后将md5发送到后台,如果有的话,直接完成
                    //name
                    console.log('!文件:' + uploadfile + ',MD5签名为:' + str + '.耗时:' + (new Date().getTime() - start) / 1000.00 + "秒");
                    window.msgManager.fileMd5({ Md5: str, FileName: uploadfile.name })
                        .done(function (result) {
                            console.log(result);
                            //return;
                            if (_downUpList.state == "abort") {
                                return;
                            }
                            if (result) {

                                window.msgManager.messageFileSendMsg({ MsgKey: msgKey, FileKey: result.Key }).done(function () {
                                    _downUpList.state = "end";
                                });
                            }
                            else {
                                if (_downUpList.state == "md5") {
                                    Util.UpLoadSend(_downUpList, callback);
                                }
                            }
                        });


                });
            }
            else {
                Util.UpLoadSend(_downUpList, callback);
            }



            console.log("!!", window.crypto);
            // window.md5(uploadfile, function (err, result) {
            //     console.log("!!", err, result);
            //     if (err) { console.log("!", err); return; }
            //     console.log("!!!!!!!!!!!!!", result)
            // });
        }

    }
    static getFileExt(name) {
        var result = "default";
        if (name) {
            var arr = name.split('.');
            if (arr.length > 0) {
                var ext = arr[arr.length - 1];
                switch (ext.toLowerCase()) {
                    case "rar":
                        result = "rar";
                        break;
                    case "zip":
                        result = "zip";
                        break;
                    case "txt":
                        result = "txt";
                        break;
                    case "pdf":
                        result = "pdf";
                        break;
                    case "ppt":
                        result = "ppt";
                        break;
                    case "html":
                    case "htm":
                        result = "share";
                        break;
                    case "doc":
                    case "docx":
                        result = "word";
                        break;
                    case "xls":
                    case "xlsx":
                        result = "excel";
                        break;
                    case "rmvb":
                    case "mp4":
                    case "avi":
                    case "rm":
                    case "asf":
                    case "divx":
                    case "mpg":
                    case "mpeg":
                    case "mpe":
                    case "mkv":
                    case "vob":
                        result = "video";
                        break;
                    case "jpg":
                    case "png":
                    case "bmp":
                    case "gif":
                        result = "pic";
                        break;

                    default:
                        result = "default";
                        break;
                }
            }
        }

        return result;
    }
    static getFileSize(size) {
        if (size === 0) return '0 B';
        var k = 1000, // or 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(size) / Math.log(k));
        return (size / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
    static toBuffer(ab) {
        var buf = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    }
    static toArrayBuffer(buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }
    static PlayMap3() {
        //方式1
        var myAudio = new Audio();
        myAudio.setAttribute('src', messageAudio);
        myAudio.volume = 0.5;
        myAudio.play();
    }
    static requestAttention() {
        nw.Window.get().requestAttention(true);
    }
    /**
     * title:标题
     * options:消息内容
     * closeTime:如果为0不关闭,否则为多少毫秒
     * handleClick:点击事件
     * hanldeShow:显示后事件
     */
    static notification(title, options, closeTime, handleClick, hanldeShow) {
        if (window.notification != null) {
            window.notification.close();
        }
        window.notification = new Notification(title, options);
        notification.onclick = function () {
            window.notification.close();
            handleClick ? handleClick() : null;

        }

        window.notification.onshow = function () {
            if (closeTime) {
                setTimeout(function () { window.notification.close(); }, closeTime);
            }
            hanldeShow ? hanldeShow() : null;
        }
    }
    static newMessage(item) {
        console.log(item, window.winIsFocus);
        if (!window.winIsFocus) {
            this.requestAttention();
            this.PlayMap3();
            var content = item.Context;
            if (item.MsgType == "2") {
                content = "[图片]";
            }
            else if (item.MsgType == "3") {
                content = "[文件]";
            }
            var headImg = "";
            if (item.Type == "1") {
                //个人聊天
                headImg = window.headPic(item.SendKey, item.Type);
            }
            else {
                //群聊
                headImg = window.headPic(item.ReceivedKey, item.Type);
            }
            var options = {
                icon: headImg,
                body: content
            };
            this.notification(item.SendName, options, 10000, function () {
                nw.Window.get().show();
            }, function () {

            });
        }
    }

    static AutoRunGet(callback) {
        var regeditpath = "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run";
        //HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
        window.regedit.list(regeditpath, function (err, result) {
            if (err) {
                callback ? callback(false) : null;
            }
            else {
                if (result[regeditpath].values["nbtx"] && result[regeditpath].values["nbtx"].value != "") {
                    callback ? callback(true) : null;
                }
                else {
                    callback ? callback(false) : null;
                }
            }
        });
    }
    static AutoRunSet(flag, callback) {
        var regeditpath = "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run";
        //添加自动启动
        if (flag) {
            var valuesToPut = {};
            valuesToPut[regeditpath] = {
                'nbtx': {
                    value: window.process.cwd() + "\\nw.exe",
                    type: 'REG_SZ'
                }
            }

            window.regedit.putValue(valuesToPut, function (err) {
                if (!err) {
                    callback ? callback() : null;
                }
            });
        }
        else {
            //如果要删除,就暂时注册为空
            var valuesToPut = {};
            valuesToPut[regeditpath] = {
                'nbtx': {
                    value: '',
                    type: 'REG_SZ'
                }
            }
            window.regedit.putValue(valuesToPut, function (err) {
                callback ? callback() : null;
            });
        }
    }
    static configUnSet() {
        if (window.showWinShortcut) {
            nw.App.unregisterGlobalHotKey(window.showWinShortcut);
        }
        if (window.copyShortcut) {
            nw.App.unregisterGlobalHotKey(window.copyShortcut);
        }
    }
    static configSet(config) {

        console.log("准备注册快捷键", config);
        Util.AutoRunSet(config.AutoRun);
        if (window.showWinShortcut) {
            nw.App.unregisterGlobalHotKey(window.showWinShortcut);
        }
        var showWinOption = {
            key: config.ShowWin
        };

        // Create a shortcut with |option|.
        window.showWinShortcut = new nw.Shortcut(showWinOption);

        // Register global desktop shortcut, which can work without focus.
        nw.App.registerGlobalHotKey(window.showWinShortcut);

        // If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
        // will get an "active" event.

        // You can also add listener to shortcut's active and failed event.
        window.showWinShortcut.on('active', function () {
            if (window.isHide)
                nw.Window.get().show();
            else
                nw.Window.get().hide();
            window.isHide = !window.isHide;
        });

        window.showWinShortcut.on('failed', function (msg) {
            message.error('快捷键:"' + config.ShowWin + '"冲突');
        });


        //截图
        if (window.copyShortcut) {
            nw.App.unregisterGlobalHotKey(window.copyShortcut);
        }
        //截图快捷键
        var copyOption = {
            key: config.CopySc
        };

        window.copyShortcut = new nw.Shortcut(copyOption);

        nw.App.registerGlobalHotKey(window.copyShortcut);
        window.copyShortcut.on('active', function () {
            window.child_process.exec("screenshot.exe", null, function (err) { });
        });

        window.copyShortcut.on('failed', function (msg) {
            message.error('快捷键:"' + config.ShowWin + '"冲突');
        });





        // Unregister the global desktop shortcut.
        //nw.App.unregisterGlobalHotKey(shortcut);
    }
    static trayUnRegedit() {
        console.log("干掉右下角图标");
        if (window.tray) {
            window.tray.remove();
            window.tray = null;
        }

    }
    static trayRegedit() {
        console.log("添加右下角图标");
        window.tray = new nw.Tray({ title: '内部安全通讯', icon: 'logo.png' });
        window.menu = new nw.Menu();
        window.menu.append(new nw.MenuItem({
            label: '打开', click: function () {
                console.log("打开");
                nw.Window.get().show(false);
            }
        }));
        window.menu.append(new nw.MenuItem({
            label: '退出', click: function () {
                console.log("退出");
                window.isClose = true;
                nw.Window.get().close();
            }
        }));
        window.tray.menu = menu;
        window.tray.tooltip = '点此打开';
        window.tray.on('click',
            function () {
                console.log("点此打开");
                nw.Window.get().show(false);
            }
        );
    }
    static encrypt(str, pwd) {
        if (pwd == null || pwd.length <= 0) {
            pwd = window.password1;
        }
        else {
            pwd = Util.decrypt(window.password);
        }
        var prand = "";
        for (var i = 0; i < pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
        var incr = Math.ceil(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        if (mult < 2) {
            return null;
        }
        var salt = Math.round(Math.random() * 1000000000) % 100000000;
        prand += salt;
        while (prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for (var i = 0; i < str.length; i++) {
            enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
            if (enc_chr < 16) {
                enc_str += "0" + enc_chr.toString(16);
            } else enc_str += enc_chr.toString(16);
            prand = (mult * prand + incr) % modu;
        }
        salt = salt.toString(16);
        while (salt.length < 8) salt = "0" + salt;
        enc_str += salt;
        return enc_str;
    }

    static decrypt(str, pwd) {

        if (str == null || str.length < 8) {
            return "";
        }
        if (pwd == null || pwd.length <= 0) {
            pwd = window.password1;
        }
        else {
            pwd = Util.decrypt(window.password);
        }
        var prand = "";
        for (var i = 0; i < pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
        var incr = Math.round(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        var salt = parseInt(str.substring(str.length - 8, str.length), 16);
        str = str.substring(0, str.length - 8);
        prand += salt;
        while (prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for (var i = 0; i < str.length; i += 2) {
            enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
            enc_str += String.fromCharCode(enc_chr);
            prand = (mult * prand + incr) % modu;
        }
        return enc_str;
    }
}