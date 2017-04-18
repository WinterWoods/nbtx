using Helpers;
using LoadManagementModels;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoadManagement
{
    public static class RegeditServices
    {
       static Random random = new Random();
        private static ConsoleHelper log = new ConsoleHelper();
        private static List<RegeditFileService> fileList;
        private static Dictionary<string, string> fileHubList;
        /// <summary>
        /// 服务器已经上传数量
        /// </summary>
        private static Dictionary<string, int> fileUPLoad = new Dictionary<string, int>();

        private static List<RegeditMessageService> messageList;
        private static Dictionary<string, string> messageHubList;
        /// <summary>
        /// 存储服务器Key,以及登录数量
        /// </summary>
        private static Dictionary<string, int> messageLoad = new Dictionary<string, int>();

        private static object LockObjectFile = new object();
        private static object LockObjectMessage = new object();

        static RegeditServices()
        {
            fileList = new List<RegeditFileService>();
            fileHubList = new Dictionary<string, string>();
            messageList = new List<RegeditMessageService>();
            messageHubList = new Dictionary<string, string>();
        }


        public static Dictionary<string, string> FileHubList
        {
            get
            {
                return fileHubList;
            }

            set
            {
                fileHubList = value;
            }
        }

        public static List<RegeditFileService> FileList
        {
            get
            {
                return fileList;
            }

            set
            {
                fileList = value;
            }
        }

        public static List<RegeditMessageService> MessageList
        {
            get
            {
                return messageList;
            }

            set
            {
                messageList = value;
            }
        }

        public static Dictionary<string, string> MessageHubList
        {
            get
            {
                return messageHubList;
            }

            set
            {
                messageHubList = value;
            }
        }
        public static void DisconnectedService(this HubCallerContext Context)
        {
            if (fileHubList.ContainsKey(Context.ConnectionId))
            {
                lock (LockObjectFile)
                {
                    var hub = fileHubList[Context.ConnectionId];
                    var value = fileList.First(f => f.Key == hub);
                    log.WriteInfo("断开文件服务器." + value.Key + ",IP:" + value.IP + ",端口:" + value.Port);
                    fileList.Remove(value);
                    fileHubList.Remove(Context.ConnectionId);
                }
            }
            if (messageHubList.ContainsKey(Context.ConnectionId))
            {
                log.WriteInfo("消息服务器断开");
                lock (LockObjectMessage)
                {
                    var hub = messageHubList[Context.ConnectionId];
                    var value = messageList.First(f => f.Key == hub);
                    log.WriteInfo("断开消息服务器." + value.Key + ",IP:" + value.IP + ",端口:" + value.Port);
                    messageList.Remove(value);
                    messageHubList.Remove(Context.ConnectionId);
                }
            }
        }
        public static void RegeditFileService(this HubCallerContext Context, RegeditFileService model)
        {
            lock (LockObjectFile)
            {
                Context.UnRegeditFileService(new UnRegeditFileService { Key = model.Key, UnMessage = "重新注册" });

                log.WriteInfo("文件服务器注册成功:" + model.Key + "-" + model.IP + ":" + model.Port + "," + Context.ConnectionId);
                model.ConnHubId = Context.ConnectionId;
                FileList.Add(model);
                FileHubList.Add(Context.ConnectionId, model.Key);
                fileUPLoad.Add(model.Key, 1);
                log.WriteInfo("文件服务器当前已经注册:" + FileList.Count);
            }

        }
        public static void UnRegeditFileService(this HubCallerContext Context, UnRegeditFileService model)
        {
            lock (LockObjectFile)
            {
                //取消一个文件服务器
                if (FileList.Any(a => a.Key == model.Key))
                {
                    FileList.RemoveAll(r => r.Key == model.Key);
                    FileHubList.Remove(Context.ConnectionId);
                    fileUPLoad.Remove(model.Key);
                }
            }

        }
        public static void RegeditMessageService(this HubCallerContext Context, RegeditMessageService model)
        {
            lock (LockObjectMessage)
            {
                //注册一个聊天服务
                //注册一个文件服务器
                Context.UnRegediMessageService(new UnRegeditMessageService { Key = model.Key, UnMessage = "重新注册" });

                log.WriteInfo("消息服务器注册成功:" + model.Key + "-" + model.IP + ":" + model.Port + "," + Context.ConnectionId);
                model.ConnHubId = Context.ConnectionId;
                MessageList.Add(model);
                MessageHubList.Add(Context.ConnectionId, model.Key);
                messageLoad.Add(model.Key, 1);
                log.WriteInfo("消息服务器当前已经注册:" + MessageList.Count);
            }
        }
        public static void UnRegediMessageService(this HubCallerContext Context, UnRegeditMessageService model)
        {
            lock (LockObjectMessage)
            {
                //取消一个服务器
                //取消一个文件服务器
                //取消一个文件服务器
                if (MessageList.Any(a => a.Key == model.Key))
                {
                    MessageList.RemoveAll(r => r.Key == model.Key);
                    MessageHubList.Remove(Context.ConnectionId);
                    messageLoad.Remove(model.Key);
                }
            }

        }
        public static MessageServiceModel GetMessageService(string Code)
        {
            MessageServiceModel result = new MessageServiceModel();
            if (MessageList.Count > 0)
            {
                var list = MessageList.FindAll(f => f.Code.IndexOf(Code)>-1);
                if (list.Count == 0)
                {
                    list = MessageList.FindAll(f => f.Code == "");
                }
                var msgOrder = messageLoad.OrderBy(o => o.Value);
                foreach (var msg in msgOrder)
                {
                    var msgSer = list.Find(a => a.Key == msg.Key);
                    if (msgSer != null)
                    {
                        result.IP = msgSer.IP;
                        result.Port = msgSer.Port;
                        result.ConnHubId = msgSer.ConnHubId;
                        return result;
                    }
                }
                return null;
            }
            else
            {
                return null;
            }
        }
        /// <summary>
        /// 获取一个消息服务器,从服务器key获取.
        /// </summary>
        /// <param name="Key"></param>
        /// <returns></returns>
        public static MessageServiceModel GetMessageServiceForKey(string serviceKey)
        {
            MessageServiceModel result = new MessageServiceModel();
            if (MessageList.Count > 0)
            {
                var list = MessageList.FindAll(f => f.Key == serviceKey);
                if (list.Count == 0)
                {
                    return null;
                }
                var msgSer = list.First();
                result.IP = msgSer.IP;
                result.Port = msgSer.Port;
                result.ConnHubId = msgSer.ConnHubId;
                return result;
            }
            else
            {
                return null;
            }
        }
        public static FileServiceModel GetUPFileService(this HubCallerContext Context)
        {
            FileServiceModel result = new FileServiceModel();
            if (FileList.Count > 0)
            {
                var fileUP = fileUPLoad.OrderBy(o => o.Value);
                foreach (var file in fileUP)
                {
                    var ser = FileList.Find(a => a.Key == file.Key);
                    if (ser != null)
                    {
                        result.IP = ser.IP;
                        result.Port = ser.Port;
                        result.ConnHubId = ser.ConnHubId;
                        return result;
                    }

                }
                return null;
            }
            else
            {
                return null;
            }
        }
        public static FileServiceModel GetDownFileService(this HubCallerContext Context, string serviceKey)
        {
            FileServiceModel result = new FileServiceModel();
            if (FileList.Count > 0)
            {
                RegeditFileService ser = null;
                if (string.IsNullOrEmpty(serviceKey))
                {
                    ser = FileList[random.Next(FileList.Count)];
                }
                else
                {
                    var list = FileList.FindAll(f => f.Key == serviceKey);
                    if (list.Count == 0)
                    {
                        return null;
                    }
                    ser = list.First();

                }
                
                result.IP = ser.IP;
                result.Port = ser.Port;
                result.ConnHubId = ser.ConnHubId;
                return result;
            }
            else
            {
                return null;
            }
        }
        public static FileServiceModel GetPhotoService(this HubCallerContext Context)
        {
            if (FileList.Count > 0)
            {
                FileServiceModel result = new FileServiceModel();
                if (FileList.Any(f => f.IsPhotoService == true))
                {
                    var photoService = FileList.Find(f => f.IsPhotoService == true);
                    result.IP = photoService.IP;
                    result.Port = photoService.Port;
                    return result;
                }

            }
            return null;
        }
        public static RegeditFileService GetFileServiceKey(this HubCallerContext Context)
        {
            var hub = fileHubList[Context.ConnectionId];
            var value = fileList.First(f => f.Key == hub);
            return value;
        }
        public static RegeditMessageService GetMessageServiceKey(this HubCallerContext Context)
        {
            var hub = messageHubList[Context.ConnectionId];
            var value = messageList.First(f => f.Key == hub);
            return value;
        }
        public static void AddUPOne(this HubCallerContext Context)
        {
            var serv = Context.GetFileServiceKey();
            if (fileUPLoad.ContainsKey(serv.Key))
            {
                fileUPLoad[serv.Key]++;
            }
        }
        public static void RemoveUPOne(this HubCallerContext Context)
        {
            var serv = Context.GetFileServiceKey();
            if (fileUPLoad.ContainsKey(serv.Key))
            {
                fileUPLoad[serv.Key]--;
            }
        }
        public static void LoginOne(this HubCallerContext Context)
        {
            var serv = Context.GetMessageServiceKey();
            if (messageLoad.ContainsKey(serv.Key))
            {
                messageLoad[serv.Key]++;
            }
            else
            {
                messageLoad.Add(serv.Key, 1);
            }
        }
        public static void LogoutOne(this HubCallerContext Context)
        {
            var serv = Context.GetMessageServiceKey();
            if (messageLoad.ContainsKey(serv.Key))
            {
                messageLoad[serv.Key]--;
            }
        }
    }
}