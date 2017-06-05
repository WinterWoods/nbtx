using Entitys;
using Helpers;
using LoadManagementModels;
using MessageManager.Filter;
using MessageManager.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager.SignalR
{
    [LoginAuthorize]
    public class MsgManager : Hub
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ClientManager>();
        public string GetTicket()
        {
            return Context.ConnectionId;
        }
        public override Task OnConnected()
        {
            var clientId = Context.ConnectionId;
            
            StartClass.manager.Proxy.Invoke("loginOne");
            return base.OnConnected();
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            var user = Context.User();

            if (user != null)
            {
                using (DB db = new DB())
                {
                    var tmp = db.UserInfo.AsQuery().Where(w => w.HubId == Context.ConnectionId || w.PhoneHubId == Context.ConnectionId).FirstOrDefault();
                    if (tmp != null)
                    {
                        if (tmp.HubId == Context.ConnectionId)
                            tmp.HubId = "";
                        if (tmp.PhoneHubId == Context.ConnectionId)
                            tmp.PhoneHubId = "";
                        db.UserInfo.Edit(tmp);
                        db.Save();
                    }
                }
            }
            StartClass.manager.Proxy.Invoke("logoutOne");
            Context.SignOut();
            return base.OnDisconnected(stopCalled);
        }
        /// <summary>
        /// 添加最近联系人
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<OftenList> MyOftenListAdd(OftenList model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    UserInfo my = Context.User();
                    model.UserKey = my.Key;

                    var often = db.OftenList.AsQuery().Where(w => w.UserKey == model.UserKey && w.FriendKey == model.FriendKey).FirstOrDefault();
                    if (often != null)
                    {
                        often.LastTime = DateTime.Now;
                        often.IsRemove = "0";
                        if(!string.IsNullOrEmpty(model.LastMsgContext))
                        often.LastMsgContext = model.LastMsgContext;
                        model = db.OftenList.Edit(often);
                    }
                    else
                    {
                        if (model.Type == "1")
                        {
                            var user = db.UserInfo.Find(model.FriendKey);
                            model.FriendName = user.NickName;
                        }
                        else
                        {
                            //获取群信息
                            var group = db.GroupInfo.Find(model.FriendKey);
                            model.FriendName = group.GroupName;
                        }
                        model.IsRemove = "0";
                        model = db.OftenList.Add(model);
                    }
                    db.Save();
                    return model;
                }
            });
        }
        /// <summary>
        /// 获取我的最近联系人
        /// </summary>
        /// <returns></returns>
        public Task<List<OftenList>> MyOftenList()
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    UserInfo my = Context.User();
                    return db.OftenList.AsQuery().Where(w => w.UserKey == my.Key).OrderByDesc(o => o.EditTime).ToList();
                }
            });
        }
        /// <summary>
        /// 清除最近联系人
        /// </summary>
        /// <param name="model"></param>
        public void MyOftenListReadClear(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var tmp = db.OftenList.Find(model.Key);
                    if (tmp != null)
                    {
                        tmp.MessageCount = 0;
                        db.OftenList.Edit(tmp);
                        db.Save();
                    }
                }
            });
        }
        /// <summary>
        /// 删除最新联系人
        /// </summary>
        /// <param name="model"></param>
        public void MyOftenListDel(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var often = db.OftenList.Find(model.Key);
                    db.OftenList.Remove(model.Key);
                    db.Save();
                }
            });
        }
        /// <summary>
        /// 消息发送
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<MsgInfo> SendMessage(MsgInfo model)
        {
            return Task.Factory.StartNew(() =>
            {
                var myUser = Context.User();
                
                using (DB db = new DB())
                {
                    model.SendKey = myUser.Key;
                    model.SendTime = DateTime.Now;
                    model.ReadPersonCount = 0;
                    model = db.MsgInfo.Add(model);
                    //更新发送人的消息记录
                    var often = db.OftenList.AsQuery().Where(w => w.UserKey == myUser.Key && w.FriendKey == model.ReceivedKey).FirstOrDefault();
                    often.LastMsgContext = model.Context;
                    often.LastTime = DateTime.Now;
                    db.OftenList.Edit(often);
                    if (model.Type == "1")
                    {
                        UserInfo sendUser = db.UserInfo.Find(model.ReceivedKey);
                        //发送消息,如果找不到这个用户,不处理
                        if (sendUser != null)
                        {
                            MsgModel msg = new MsgModel();
                            msg.Key = model.Key;
                            msg.SendKey = myUser.Key;
                            msg.SendName = myUser.NickName;
                            msg.ReceivedKey = model.ReceivedKey;
                            msg.ReceivedName = sendUser.NickName;
                            msg.SendTime = model.SendTime;
                            msg.Context = model.Context;
                            msg.Type = model.Type;
                            msg.MsgType = model.MsgType;

                            SendClientMessageType1(db, sendUser, msg);


                        }

                    }
                    else
                    {
                        var sendGroup = db.GroupInfo.Find(model.ReceivedKey);
                        //群聊

                        //发送消息
                        if (sendGroup != null)
                        {
                            
                            MsgModel msg = new MsgModel();
                            msg.Key = model.Key;
                            msg.SendKey = myUser.Key;
                            msg.SendName = myUser.NickName;
                            msg.ReceivedKey = model.ReceivedKey;
                            msg.ReceivedName = sendGroup.GroupName;
                            msg.SendTime = model.SendTime;
                            msg.Context = model.Context;
                            msg.Type = model.Type;
                            msg.MsgType = model.MsgType;
                            //不在对自己发送
                            SendClientMessageType2(db, msg);



                        }
                    }
                }

                return model;
            });
        }
        private void SendClientMessageType1(DB db,UserInfo sendUser,MsgModel msg)
        {
            var myUser = Context.User();
            //如果找到这个用户,发现没有登陆,记录在待发消息列表
            if (!string.IsNullOrEmpty(sendUser.HubId))
            {
                MsgNoSendLog noSend = new MsgNoSendLog();
                noSend.MsgKey = msg.Key;
                noSend.SendKey = msg.ReceivedKey;
                noSend.Type = "1";
                noSend = db.MsgNoSendLog.Add(noSend);
                msg.NoSendKey = noSend.Key;
                db.Save();
                context.Clients.Client(sendUser.HubId).sendMsg(msg);
            }
            //如果找到这个用户,发现没有登陆,记录在待发消息列表
            if (!string.IsNullOrEmpty(sendUser.PhoneHubId))
            {
                MsgNoSendLog noSend = new MsgNoSendLog();
                noSend.MsgKey = msg.Key;
                noSend.SendKey = msg.ReceivedKey;
                noSend.Type = "2";
                noSend = db.MsgNoSendLog.Add(noSend);
                msg.NoSendKey = noSend.Key;
                db.Save();
                context.Clients.Client(sendUser.PhoneHubId).sendMsg(msg);
            }
            if (myUser.HubId == Context.ConnectionId && !string.IsNullOrEmpty(myUser.PhoneHubId))
            {
                MsgNoSendLog noSend = new MsgNoSendLog();
                noSend.MsgKey = msg.Key;
                noSend.SendKey = msg.SendKey;
                noSend.Type = "2";
                noSend = db.MsgNoSendLog.Add(noSend);
                msg.NoSendKey = noSend.Key;
                db.Save();
                context.Clients.Client(myUser.PhoneHubId).sendMsg(msg);

            }
            if (myUser.PhoneHubId == Context.ConnectionId && !string.IsNullOrEmpty(myUser.HubId))
            {
                MsgNoSendLog noSend = new MsgNoSendLog();
                noSend.MsgKey = msg.Key;
                noSend.SendKey = msg.SendKey;
                noSend.Type = "1";
                noSend = db.MsgNoSendLog.Add(noSend);
                msg.NoSendKey = noSend.Key;
                db.Save();
                context.Clients.Client(myUser.HubId).sendMsg(msg);
            }
        }
        private void SendClientMessageType2(DB db, MsgModel msg)
        {
            Dictionary<string, MsgModel> msgList = new Dictionary<string, MsgModel>();
            var groupUserList = db.GroupUser.AsQuery().Where(w => w.GroupKey == msg.ReceivedKey && w.IsExit == false).ToList();
            var myUser = Context.User();
            if (myUser.HubId == Context.ConnectionId && !string.IsNullOrEmpty(myUser.PhoneHubId))
            {
                MsgNoSendLog noSend = new MsgNoSendLog();
                noSend.MsgKey = msg.Key;
                noSend.SendKey = msg.SendKey;
                noSend.Type = "2";
                noSend = db.MsgNoSendLog.Add(noSend);
                msg.NoSendKey = noSend.Key;
                msgList.Add(myUser.PhoneHubId, msg);
                //context.Clients.Client(myUser.PhoneHubId).sendMsg(msg);

            }
            if (myUser.PhoneHubId == Context.ConnectionId && !string.IsNullOrEmpty(myUser.HubId))
            {
                MsgNoSendLog noSend = new MsgNoSendLog();
                noSend.MsgKey = msg.Key;
                noSend.SendKey = msg.SendKey;
                noSend.Type = "1";
                noSend = db.MsgNoSendLog.Add(noSend);
                msg.NoSendKey = noSend.Key;
                msgList.Add(myUser.HubId, msg);
                //context.Clients.Client(myUser.HubId).sendMsg(msg);
            }

            //查询发送消息用户是否在群中，如果不在则不能发送消息
            if (groupUserList.Any(a => a.UserKey == myUser.Key))
            {
                foreach (var user in groupUserList)
                {

                    if (user.UserKey == myUser.Key) continue;

                    var sendUser = db.UserInfo.Find(user.UserKey);
                    if (sendUser != null)
                    {
                        //如果找到这个用户,发现没有登陆,记录在待发消息列表
                        if (!string.IsNullOrEmpty(sendUser.HubId))
                        {
                            MsgNoSendLog noSend = new MsgNoSendLog();
                            noSend.MsgKey = msg.Key;
                            noSend.SendKey = sendUser.Key;
                            noSend.Type = "1";
                            noSend = db.MsgNoSendLog.Add(noSend);
                            msg.NoSendKey = noSend.Key;
                            msgList.Add(sendUser.HubId, msg);
                            //context.Clients.Client(sendUser.HubId).sendMsg(msg);
                        }
                        //如果找到这个用户,发现没有登陆,记录在待发消息列表
                        if (!string.IsNullOrEmpty(sendUser.PhoneHubId))
                        {
                            MsgNoSendLog noSend = new MsgNoSendLog();
                            noSend.MsgKey = msg.Key;
                            noSend.SendKey = msg.ReceivedKey;
                            noSend.Type = "2";
                            noSend = db.MsgNoSendLog.Add(noSend);
                            msg.NoSendKey = noSend.Key;
                            msgList.Add(sendUser.PhoneHubId, msg);
                            //context.Clients.Client(sendUser.PhoneHubId).sendMsg(msg);
                        }
                    }
                }
                db.Save();
                foreach (var tmp in msgList)
                {
                    context.Clients.Client(tmp.Key).sendMsg(tmp.Value);

                }
            }
        }
        /// <summary>
        /// 接受到消息必须返回,如果不返回,下次登录的时候还会发送.
        /// </summary>
        /// <param name="model"></param>
        public void SendMsgReturn(MsgModel model)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    db.MsgNoSendLog.Remove(model.NoSendKey);
                    db.Save();
                }
            });
        }
        /// <summary>
        /// 消息已读未读,主要是就看这个.
        /// </summary>
        /// <param name="model"></param>
        public void MsgReaded(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                var myUser = Context.User();
                using (DB db = new DB())
                {
                    var msg = db.MsgInfo.Find(model.Key);
                    if (msg.Type == "1")
                    {
                        //个人聊天
                        msg.ReadTime = DateTime.Now;
                        var sendUser = db.UserInfo.Find(msg.SendKey);
                        if (!string.IsNullOrEmpty(sendUser.HubId))
                        {
                            context.Clients.Client(sendUser.HubId).msgReadedList(msg);
                        }
                        if (!string.IsNullOrEmpty(sendUser.PhoneHubId))
                        {
                            context.Clients.Client(sendUser.PhoneHubId).msgReadedList(msg);
                        }
                        else
                        {
                            //如果没有读,必须存起来,将来在告诉手机
                            MsgPhoneReadSend phoneRead = new MsgPhoneReadSend();
                            phoneRead.MsgKey = msg.Key;
                            phoneRead.SendKey = msg.SendKey;
                            db.MsgPhoneReadSend.Add(phoneRead);
                        }
                        db.MsgInfo.Edit(msg);
                    }
                    else
                    {
                        if (db.MsgGroupRead.AsQuery().Where(w => w.UserKey == myUser.Key && w.MsgKey == msg.Key).Count() == 0)
                        {
                            //群聊,如果是群聊,每次阅读一次就在库中添加一条,下次拉去记录,进行判断是否已经读取.
                            MsgGroupRead msgRead = new MsgGroupRead();
                            msgRead.GroupKey = msg.ReceivedKey;
                            msgRead.MsgKey = msg.Key;
                            msgRead.ReadTime = DateTime.Now;
                            msgRead.UserKey = myUser.Key;
                            db.MsgGroupRead.Add(msgRead);
                            msg.ReadTime = DateTime.Now;
                            msg.ReadPersonCount = msg.ReadPersonCount + 1;
                            db.MsgInfo.Edit(msg);
                            var sendUser = db.UserInfo.Find(msg.SendKey);
                            if (!string.IsNullOrEmpty(sendUser.HubId))
                            {
                                context.Clients.Client(sendUser.HubId).msgReadedList(msg);
                            }
                            if (!string.IsNullOrEmpty(sendUser.PhoneHubId))
                            {
                                context.Clients.Client(sendUser.PhoneHubId).msgReadedList(msg);
                            }
                            else
                            {
                                //如果没有读,必须存起来,将来在告诉手机
                                //如果没有读,必须存起来,将来在告诉手机
                                MsgPhoneReadSend phoneRead = new MsgPhoneReadSend();
                                phoneRead.MsgKey = msg.Key;
                                phoneRead.SendKey = msg.SendKey;
                                db.MsgPhoneReadSend.Add(phoneRead);
                            }
                        }

                    }
                    db.Save();
                }
            });
        }
        /// <summary>
        /// 群消息,已经读取的人员
        /// </summary>
        public Task<List<MsgGroupRead>> GroupMsgReadUserList(BasicModels model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var result = db.MsgGroupRead.AsQuery().Where(w => w.MsgKey == model.Key).ToList();
                    return result;
                }
            });
        }
        public class NoSendMsg
        {
            public string Type { get; set; }
        }
        public void NoSendMsgGet(NoSendMsg model)
        {
            Task.Factory.StartNew(() => {
                var myUser = Context.User();
                using (DB db1 = new DB())
                {
                    var noSendMsg = db1.MsgNoSendLog.AsQuery().Where(w => w.SendKey == myUser.Key&&w.Type==model.Type).OrderBy(o=>o.EditTime).ToList();
                    foreach (var _msg in noSendMsg)
                    {
                        var msgInfo = db1.MsgInfo.Find(_msg.MsgKey);

                        var user = db1.UserInfo.Find(myUser.Key);
                        //发送前进行验证是否已经下线
                        if (myUser != null)
                        {
                            MsgModel msg = new MsgModel();
                            msg.Key = msgInfo.Key;
                            msg.SendKey = msgInfo.SendKey;
                            msg.SendName = db1.UserInfo.Find(msgInfo.SendKey).NickName;
                            msg.ReceivedKey = msgInfo.ReceivedKey;
                            msg.ReceivedName= db1.UserInfo.Find(msgInfo.ReceivedKey).NickName;
                            msg.SendTime = msgInfo.SendTime;
                            msg.Context = msgInfo.Context;
                            msg.Type = msgInfo.Type;
                            msg.MsgType = msgInfo.MsgType;
                            msg.NoSendKey = _msg.Key;
                            if (model.Type == "1")
                            {
                                if (!string.IsNullOrEmpty(user.HubId))
                                {
                                    context.Clients.Client(user.HubId).sendMsg(msg);
                                }
                            }
                            else
                            {
                                if (!string.IsNullOrEmpty(user.PhoneHubId))
                                {
                                    context.Clients.Client(user.PhoneHubId).sendMsg(msg);
                                }
                            }
                            
                        }
                    }
                }

            });
            if (model.Type == "2")
            {
                Task.Factory.StartNew(() => {
                    var myUser = Context.User();
                    if (string.IsNullOrEmpty(myUser.PhoneHubId)) return;
                    using (DB db = new DB())
                    {
                        List<MsgPhoneReadSend> list = db.MsgPhoneReadSend.AsQuery().Where(w => w.SendKey == myUser.Key).OrderBy(o => o.EditTime).ToList();
                        foreach(var tmp in list)
                        {
                            var msg = db.MsgInfo.Find(tmp.MsgKey);
                            if (msg!=null)
                            context.Clients.Client(myUser.PhoneHubId).msgReadedList(msg);
                        }
                    }
                });
            }
        }
        /// <summary>
        /// 发送文件
        /// </summary>
        /// <param name="model"></param>
        public Task<UpFileInfo> MessageFileSendMsg(SendFileOverModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var myUser = Context.User();
                    var msg = db.MsgInfo.Find(model.MsgKey);
                    var file = db.UpFileInfo.Find(model.FileKey);
                    msg.FileUpOver = true;
                    //更新发送人的消息记录
                    var often = db.OftenList.AsQuery().Where(w => w.UserKey == myUser.Key && w.FriendKey == msg.ReceivedKey).FirstOrDefault();


                    if (msg.MsgType == "2")
                    {
                        //image.Width
                        PicJson json = new PicJson();
                        json.Width = file.SmallWidth;
                        json.Height = file.SmallHeight;
                        json.BigWidth = file.BigWidth;
                        json.BigHeight = file.BigHeight;
                        json.FileKey = file.Key;
                        string fileInfo = JSON.stringify(json);

                        msg.Context = fileInfo;
                        often.LastMsgContext = "[图片]";
                    }
                    else if (msg.MsgType == "3")
                    {
                        FileJson json = new FileJson();
                        json.Name = file.Name;
                        json.Size = file.FileSize;
                        json.FileKey = file.Key;
                        //文件,获取文件的名字以及
                        string fileInfo = JSON.stringify(json);

                        msg.Context = fileInfo;
                        often.LastMsgContext = "[" + file.Name + "]";
                    }
                    msg = db.MsgInfo.Edit(msg);
                    db.OftenList.Edit(often);
                    //准备给对方发送消息
                    if (msg.Type == "1")
                    {
                        UserInfo sendUser = db.UserInfo.Find(msg.ReceivedKey);
                        //发送消息,如果找不到这个用户,不处理
                        if (sendUser != null)
                        {
                            MsgModel _msg = new MsgModel();
                            _msg.Key = msg.Key;
                            _msg.SendKey = myUser.Key;
                            _msg.SendName = myUser.NickName;
                            _msg.ReceivedKey = msg.ReceivedKey;
                            _msg.SendTime = msg.SendTime;
                            _msg.Context = msg.Context;
                            _msg.Type = msg.Type;
                            _msg.MsgType = msg.MsgType;
                            _msg.FileUpOver = msg.FileUpOver;

                            SendClientMessageType1(db, sendUser, _msg);

                            //MsgNoSendLog noSend = new MsgNoSendLog();
                            //noSend.MsgKey = msg.Key;
                            //noSend.SendKey = msg.ReceivedKey;
                            //noSend = db.MsgNoSendLog.Add(noSend);
                            //_msg.NoSendKey = noSend.Key;
                            //db.Save();
                            ////如果找到这个用户,发现没有登陆,记录在待发消息列表
                            //if (!string.IsNullOrEmpty(sendUser.HubId))
                            //{
                            //    context.Clients.Client(sendUser.HubId).sendMsg(_msg);
                            //}
                            //if (!string.IsNullOrEmpty(sendUser.PhoneHubId))
                            //{
                            //    context.Clients.Client(sendUser.PhoneHubId).sendMsg(_msg);
                            //}
                        }
                    }
                    else
                    {
                        var sendGroup = db.GroupInfo.Find(msg.ReceivedKey);
                        //群聊

                        //发送消息
                        if (sendGroup != null)
                        {
                            MsgModel _msg = new MsgModel();
                            _msg.Key = msg.Key;
                            _msg.SendKey = myUser.Key;
                            _msg.SendName = myUser.NickName;
                            _msg.ReceivedKey = msg.ReceivedKey;
                            _msg.SendTime = msg.SendTime;
                            _msg.Context = msg.Context;
                            _msg.Type = msg.Type;
                            _msg.MsgType = msg.MsgType;
                            _msg.FileUpOver = msg.FileUpOver;
                            SendClientMessageType2(db,  _msg);
                            //var groupUserList = db.GroupUser.Where(w => w.GroupKey == msg.ReceivedKey && w.IsExit == false).ToList();
                            ////查询发送消息用户是否在群中，如果不在则不能发送消息
                            //if (groupUserList.Any(a => a.UserKey == myUser.Key))
                            //{
                            //    Dictionary<string, MsgModel> msgList = new Dictionary<string, MsgModel>();

                            //    foreach (var user in groupUserList)
                            //    {
                                    
                            //        if (user.UserKey == myUser.Key) continue;
                            //        var _user = db.UserInfo.Find(user.UserKey);

                            //        MsgNoSendLog noSend = new MsgNoSendLog();
                            //        noSend.MsgKey = msg.Key;
                            //        noSend.SendKey = user.UserKey;
                            //        noSend = db.MsgNoSendLog.Add(noSend);
                            //        _msg.NoSendKey = noSend.Key;
                            //        if (!string.IsNullOrEmpty(_user.HubId))
                            //        {
                            //            msgList.Add(_user.HubId, _msg);
                            //        }
                            //        if (!string.IsNullOrEmpty(_user.PhoneHubId))
                            //        {
                            //            msgList.Add(_user.PhoneHubId, _msg);
                            //        }
                            //    }
                            //    db.Save();
                            //    foreach (var tmp in msgList)
                            //    {
                            //        context.Clients.Client(tmp.Key).sendMsg(tmp.Value);
                            //    }

                            //}
                        }
                    }
                    return file;
                }
            });
        }
        //删除一个消息,用于文件没有发送成功.
        public void DelUPMessage(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var msg = db.MsgInfo.Find(model.Key);
                    if (msg == null) return;
                    db.MsgNoSendLog.Remove(w => w.MsgKey == model.Key);
                    db.MsgInfo.Remove(msg);
                    if (msg.Type == "1")
                    {
                        //需要判断是群聊还是个人，如果是个人的话直接撤销。如果是群聊需要找到所有人进行撤销
                        var receiveUser = db.UserInfo.Find(msg.ReceivedKey);
                        if (receiveUser != null)
                        {
                            msg.MsgType = "9";
                            msg.Context = "";
                            if (!string.IsNullOrEmpty(receiveUser.HubId))
                            {
                                context.Clients.Client(receiveUser.HubId).receiveMsg(msg);
                            }
                            if (!string.IsNullOrEmpty(receiveUser.PhoneHubId))
                            {
                                context.Clients.Client(receiveUser.PhoneHubId).receiveMsg(msg);
                            }
                        }
                    }
                    else
                    {
                        //如果是群聊,需要找到群成员,进行撤销消息

                        var group = db.GroupInfo.Find(msg.ReceivedKey);
                        var userList = db.GroupUser.AsQuery().Where(w => w.GroupKey == group.Key && w.IsExit == false).ToList();
                        userList.ForEach(f => {
                            var receiveUser = db.UserInfo.Find(f.UserKey);
                            if (receiveUser != null)
                            {
                                msg.MsgType = "9";
                                msg.Context = "";
                                if(!string.IsNullOrEmpty(receiveUser.HubId))
                                {
                                    context.Clients.Client(receiveUser.HubId).receiveMsg(msg);
                                }
                                if (!string.IsNullOrEmpty(receiveUser.PhoneHubId))
                                {
                                    context.Clients.Client(receiveUser.PhoneHubId).receiveMsg(msg);
                                }
                            }
                        });
                    }
                    db.Save();
                }
            });
        }
        public void DelMessage(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var msg = db.MsgInfo.Find(model.Key);
                    if (msg == null) return;
                    if (msg.FileUpOver.HasValue && msg.FileUpOver.Value)
                    {
                        throw new Exception("上传完成的消息不能删除.");
                    }
                    DelUPMessage(model);
                }
            });
        }
        /// <summary>
        /// 撤销消息
        /// </summary>
        /// <param name="model"></param>
        public void RevokeMessage(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var msg = db.MsgInfo.Find(model.Key);
                    if (msg == null) return;
                    if (DateTime.Now - msg.SendTime > new TimeSpan(0, 20, 0))
                    {
                        throw new Exception("撤销失败，已经已经超过20分钟。");
                    }
                    DelUPMessage(model);
                }
            });
        }

        /// <summary>
        /// 文件消息发送
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<MsgInfo> MessageFileSend(SendFileModel model)
        {
            return Task.Factory.StartNew(() =>
            {

                var myUser = Context.User();
                using (DB db = new DB())
                {
                    MsgInfo msg = new MsgInfo();
                    var arr = model.FileName.Split(new char[] { '.' });
                    msg.MsgType = "3";
                    if (arr.Length > 0)
                    {
                        var ext = arr[arr.Length - 1].ToUpper();
                        if (ext == "JPG" || ext == "BMP" || ext == "PNG" || ext == "GIF" || ext == "WEBP")
                        {
                            msg.MsgType = "2";
                        }
                    }
                    msg.ReceivedKey = model.ReceivedKey;
                    msg.SendKey = myUser.Key;
                    msg.SendTime = DateTime.Now;
                    msg.Type = model.Type;
                    msg.FileUpOver = false;
                    msg.ReadPersonCount = 0;
                    msg = db.MsgInfo.Add(msg);
                    db.Save();
                    return msg;
                }
            });
        }
        public Task<UpFileInfo> FileMd5(SendFileMd5Model model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var file = db.UpFileInfo.AsQuery().Where(w => w.MD5 == model.Md5).FirstOrDefault();
                    if (file != null)
                    {
                        //创建一个新的文件
                        UpFileInfo newFile = new UpFileInfo();
                        newFile.MD5 = model.Md5;
                        newFile.Name = model.FileName;
                        newFile.PathName = file.PathName;
                        newFile.FileSize = file.FileSize;
                        newFile.Ext = file.Ext;
                        newFile = db.UpFileInfo.Add(newFile);
                        db.Save();
                        return newFile;
                    }
                    else
                    {
                        return null;
                    }
                }

            });

        }

        /// <summary>
        /// 获取消息列表
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<MessageResultModel<MsgInfo>> MessageList(MessageModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var myUser = this.Context.User();
                    var query = db.MsgInfo.AsQuery();
                    if (!string.IsNullOrEmpty(model.LastMsgKey))
                    {
                        var lastMsgModel = db.MsgInfo.Find(model.LastMsgKey);
                        if (lastMsgModel != null)
                        {
                            query = query.Where(w => w.AddTime < lastMsgModel.AddTime);
                        }
                    }
                    if (model.Type == "1")
                    {
                        query = query.Where(w => (w.SendKey == myUser.Key && w.ReceivedKey == model.SendKey) || (w.ReceivedKey == myUser.Key && w.SendKey == model.SendKey));
                    }
                    else
                    {
                        //如果是群聊，需要找到群聊的配置，查看是否有历史消息查看
                        var groupInfo = db.GroupInfo.Find(model.SendKey);

                        var user = db.GroupUser.AsQuery().Where(w => w.GroupKey == groupInfo.Key && w.UserKey == myUser.Key).FirstOrDefault();
                        if (user == null && user.IsExit)
                        {
                            throw new Exception("您不再群聊,或者已经退出群聊.无法查看群聊天记录");
                        }
                        else
                        {
                            query = query.Where(w => w.ReceivedKey == model.SendKey);
                            //查看群配置是否能查看历史聊天记录
                            if (!groupInfo.LogMsgLook)
                            {
                                query = query.Where(w => w.SendTime >= user.EditTime);
                            }
                        }

                    }
                    query = query.OrderByDesc(o => o.SendTime);
                    query = query.Take(model.PageSize);
                    var aaa = query.ToList().OrderBy(o => o.SendTime).ToList();
                    MessageResultModel<MsgInfo> result = new MessageResultModel<MsgInfo>();
                    result.data = aaa;
                    result.RandomString = model.RandomString;
                    return result;
                }
            });
        }
        public Task<List<FileModel>> MessageListFileQuery(MessageModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var myUser = this.Context.User();
                    var query = db.MsgInfo.AsQuery();
                    if (model.Type == "1")
                    {
                        query = query.Where(w => ((w.SendKey == myUser.Key && w.ReceivedKey == model.SendKey) || (w.ReceivedKey == myUser.Key && w.SendKey == model.SendKey)) && w.MsgType == "3");
                    }
                    else
                    {
                        query = query.Where(w => w.ReceivedKey == model.SendKey && w.MsgType == "3");
                    }
                    query = query.OrderByDesc(o => o.SendTime);
                    var msgList = query.ToList();
                    List<FileModel> result = new List<FileModel>();
                    foreach (var msg in msgList)
                    {
                        if (!string.IsNullOrEmpty(msg.Context))
                        {
                            var fileInfo = JSON.parse<FileJson>(msg.Context);
                            FileModel file = new FileModel();
                            file.AddTime = msg.SendTime;
                            file.AddUser = db.UserInfo.Find(msg.SendKey).NickName;
                            file.FileSize = fileInfo.Size;
                            file.MsgKey = msg.Key;
                            file.FileKey = fileInfo.FileKey;
                            file.Name = fileInfo.Name;
                            result.Add(file);
                        }
                    }
                    return result;
                }
            });
        }
    }
}
