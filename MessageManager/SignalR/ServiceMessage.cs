using Entitys;
using Helpers;
using LoadManagementModels;
using MessageManager.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager.SignalR
{
    /// <summary>
    /// 专门用于服务器之间传输消息的Hub
    /// </summary>
    public class ServiceMessage:Hub
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ClientManager>();
        public Task<List<string>> GetGroupUserTop4(string groupKey)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    return db.GroupUser.Where(w => w.GroupKey == groupKey).Take(4).ToList().Select(s => s.UserKey).ToList();
                }
            });
        }
        public Task<string> GetUserNickName(string userKey)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var user = db.UserInfo.Find(userKey);
                    if (user == null)
                        return "";
                    return user.NickName;
                }
            });
        }
        public Task<bool> AuthQuery(string hubId)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var user = db.UserInfo.Where(w => w.HubId == hubId||w.PhoneHubId==hubId).ToEntity();
                    if (user == null)
                        return false;
                    else return true;
                }
            });
        }
        public Task<string> SaveFileInfo(FileManagerUPModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var file = new UpFileInfo();
                    file.Name = model.FileName;
                    file.PathName = model.PathName;
                    file.MD5 = model.FileMD5;
                    file.Ext = model.FileExt;
                    file.FileSize = model.FileSize;
                    file.ServiceKey = model.ServiceKey;
                    file.BigWidth = model.BigWidth;
                    file.BigHeight = model.BigHeight;
                    file.SmallWidth = model.SmallWidth;
                    file.SmallHeight = model.SmallHeight;
                    file = db.UpFileInfo.Add(file);
                    db.Save();
                    return file.Key;
                }
            });
        }
        public void UpFileErrorDelMsg(string msgKey)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    db.MsgInfo.Remove(msgKey);
                    db.Save();
                }
            });
        }
        /// <summary>
        /// 文件服务器用来获取文件的存储信息
        /// </summary>
        /// <param name="msgKey"></param>
        /// <returns></returns>
        public Task<FileManagerUPModel> GetFileInfo(string fileKey)
        {
            return Task.Factory.StartNew(() =>
            {

                using (DB db = new DB())
                {

                    UpFileInfo upFile = db.UpFileInfo.Find(fileKey);
                    if (upFile == null)
                        return null;

                    FileManagerUPModel result = new FileManagerUPModel();
                    result.FileExt = upFile.Ext;
                    result.FileMD5 = upFile.MD5;
                    result.FileName = upFile.Name;
                    result.FileSize = (long)upFile.FileSize;
                    result.PathName = upFile.PathName;
                    result.ServiceKey = upFile.ServiceKey;
                    return result;
                }
            });
        }
    }
}
