using Helpers;
using LoadManagementModels;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoadManagement.SignalR
{
    public class ServiceManager:Hub
    {
        public static List<string> Users = new List<string>();
        public override Task OnConnected()
        {
            return base.OnConnected();
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            Context.DisconnectedService();
            //有一个断开
            return base.OnDisconnected(stopCalled);
        }
        public void RegeditFileService(RegeditFileService model)
        {
            Context.RegeditFileService(model);
        }
        public void UnRegeditFileService(UnRegeditFileService model)
        {
            Context.UnRegeditFileService(model);
        }
        public void RegeditMessageService(RegeditMessageService model)
        {
            Context.RegeditMessageService(model);
        }
        public void UnRegediMessageService(UnRegeditMessageService model)
        {
            Context.UnRegediMessageService(model);
        }
        public void AddUPOne()
        {
            Context.AddUPOne();
        }
        public void RemoveUPOne()
        {
            Context.RemoveUPOne();
        }
        public void LoginOne()
        {
            Context.LoginOne();
        }
        public void LogoutOne()
        {
            Context.LogoutOne();
        }
        /// <summary>
        /// 获取一个下浮文件的服务器
        /// </summary>
        /// <param name="serviceKey"></param>
        /// <returns></returns>
        public FileServiceModel GetDownFileService(string serviceKey)
        {
            return Context.GetDownFileService(serviceKey);
        }
        /// <summary>
        /// 获取头像服务器
        /// </summary>
        /// <returns></returns>
        public FileServiceModel GetPhotoService()
        {
            return Context.GetPhotoService();
        }
        /// <summary>
        /// 获取消息服务器,必须要有serviceKey
        /// </summary>
        /// <param name="serviceKey"></param>
        /// <returns></returns>
        public MessageServiceModel GetMessageService(string serviceKey)
        {
            return RegeditServices.GetMessageServiceForKey(serviceKey);
        }
        /// <summary>
        /// 获取一个上传的服务器
        /// </summary>
        /// <returns></returns>
        public FileServiceModel GetUPFileService()
        {
            return Context.GetUPFileService();
        }
    }
}
