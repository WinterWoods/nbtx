using Entitys;
using Helpers;
using LoadManagementModels;
using MessageManager.Filter;
using MessageManager.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager.SignalR
{
    [LoginAuthorize]
    public class FileManager : Hub
    {
        public Task<FileAuthServiceModel> GetUpFileService()
        {
            return Task.Factory.StartNew(() =>
            {
                FileAuthServiceModel result = new FileAuthServiceModel();
                var fileService = StartClass.manager.GetUPFileService();
                if (fileService == null)
                {
                    throw new Exception("头像服务器出错.");
                }
                result.QueryKey = Context.ConnectionId;
                result.ServiceIP = fileService.IP;
                result.ServicePort = fileService.Port;
                result.MessageServiceKey = ConfigurationManager.AppSettings["ThisMachineKey"].ToString();
                return result;
            });
            //获取一个上传文件的服务器信息
        }
        public Task<FileAuthServiceModel> GetPhotoService()
        {
            return Task.Factory.StartNew(() =>
              {
                  FileAuthServiceModel result = new FileAuthServiceModel();
                  var fileService = StartClass.manager.GetPhotoService();
                  if (fileService == null)
                  {
                      throw new Exception("头像服务器出错.");
                  }
                  result.QueryKey = Context.ConnectionId;
                  result.ServiceIP = fileService.IP;
                  result.ServicePort = fileService.Port;
                  result.MessageServiceKey = ConfigurationManager.AppSettings["ThisMachineKey"].ToString();
                  return result;
              });
        }
        public Task<FileAuthServiceModel> GetDownServiceForMsgKey(FileServerQueryModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                using(DB db=new DB())
                {
                    FileAuthServiceModel result = new FileAuthServiceModel();
                    RegeditFileService fileService = null;
                    if (!string.IsNullOrEmpty(model.MsgKey))
                    {
                        var msg = db.MsgInfo.Find(model.MsgKey);
                        if (string.IsNullOrEmpty(msg.FileKey))
                        {
                            if (msg.MsgType == "2")
                            {
                                PicJson json = JSON.parse<PicJson>(msg.Context);
                                msg.FileKey = json.FileKey;

                            }
                            if (msg.MsgType == "3")
                            {
                                FileJson json = JSON.parse<FileJson>(msg.Context);
                                msg.FileKey = json.FileKey;
                            }
                            msg = db.MsgInfo.Edit(msg);
                            db.Save();
                        }
                        var file = db.UpFileInfo.Find(msg.FileKey);
                        
                        fileService = StartClass.manager.GetDownFileService(file.ServiceKey);
                        result.FileKey = msg.FileKey;
                    }
                    else
                    {
                        fileService = StartClass.manager.GetDownFileService("");
                    }
                   
                    if(fileService==null)
                    {
                        throw new Exception("文件服务器出错.");
                    }
                    result.QueryKey = Context.ConnectionId;
                    result.ServiceIP = fileService.IP;
                    result.ServicePort = fileService.Port;
                    result.MessageServiceKey = ConfigurationManager.AppSettings["ThisMachineKey"].ToString();
                    
                    return result;
                }
            });

        }
        
        
        public Task<UPVersionModel> GetVersion()
        {
            return Task.Factory.StartNew(() =>
            {
                UPVersionModel result = new UPVersionModel();
                result.Version = File.ReadAllText("Version/lastVersion.txt");
                result.Msg = File.ReadAllText("Version/lastVersionMsg.txt");
                return result;
            });
        }
    }
}
