using FileManager.Filter;
using Helpers;
using LoadManagementModels;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace FileManager.Api
{
    public class FileManagerController : ApiController
    {
        
        private const int BufferSize = 80 * 1024;
        private const string MimeType = "application/octet-stream";
        /// <summary>
        /// 上传前,先去消息服务器验证是否登录,开启后,不在关闭通道
        /// 完成后.通知消息服务器保存
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<string> Up()
        {
            await StartClass.manager.Proxy.Invoke("addUPOne");
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            Dictionary<string, string> dic = new Dictionary<string, string>();
            string UpPath = ConfigurationManager.AppSettings["UpPath"].ToString();
            if (!Directory.Exists(UpPath))
            {
                Directory.CreateDirectory(UpPath);
            }
            var ticketHeaders = Request.Headers.GetValues("ticket").ToList();
            string ticket = "";
            if (ticketHeaders.Count != 0)
            {
                ticket = ticketHeaders[0];
            }
            if (string.IsNullOrEmpty(ticket)) throw new Exception("错误的上传.");
            //拿到首选后去消息服务器验证,这个用户是否登录.


            var msgKeyHeaders = Request.Headers.GetValues("msgKey").ToList();
            string msgKey = "";
            if (msgKeyHeaders.Count != 0)
            {
                msgKey = msgKeyHeaders[0];
            }
            if (string.IsNullOrEmpty(msgKey)) throw new Exception("错误的上传.");

            var messageServiceKeyHeaders = Request.Headers.GetValues("MessageServiceKey").ToList();
            string messageServiceKey = "";
            if (messageServiceKeyHeaders.Count != 0)
            {
                messageServiceKey = messageServiceKeyHeaders[0];
            }
            if (string.IsNullOrEmpty(messageServiceKey)) throw new Exception("错误的上传.");
            var messageProxy = StartClass.manager.GetMessageProxyForKey(messageServiceKey);
            var provider = new MultipartFormDataStreamProvider(UpPath);
            string fileName = "";
            string filePath = "";

            try
            {
                // Read the form data.  
                await Request.Content.ReadAsMultipartAsync(provider);
                // This illustrates how to get the file names.  
                FileInfo fileInfo = null;

                FileManagerUPModel model = new FileManagerUPModel();
                model.ServiceKey = ConfigurationManager.AppSettings["ThisMachineKey"].ToString();
                foreach (MultipartFileData file in provider.FileData)
                {
                    fileName = provider.FormData["fileName"];
                    //接收文件
                    model.FileName = fileName.Replace("\"", "");
                    fileInfo = new FileInfo(file.LocalFileName);
                    filePath = file.LocalFileName;
                    var aa = model.FileName.Split('.');
                    if (aa.Length > 1)
                        model.FileExt = aa[aa.Length - 1];
                    model.FileMD5 = MD51.FileMD5(file.LocalFileName);
                    model.PathName = file.LocalFileName.Replace(UpPath, "");
                    //up.UserKey = myUser.Key;
                    model.FileSize = fileInfo.Length;
                    //发送到服务器,保存

                }
                if (model.FileExt.ToUpper() == "JPG" || model.FileExt.ToUpper() == "BMP" || model.FileExt.ToUpper() == "PNG" || model.FileExt.ToUpper() == "GIF" || model.FileExt.ToUpper() == "WEBP")
                {
                    ImageHelper.CompressImage(fileInfo.FullName, fileInfo.FullName + "_Small", 400, 273, 80);
                    //图片,获取图片的大小
                    Image smallImg = Image.FromFile(fileInfo.FullName + "_Small");
                    Image bigImg = Image.FromFile(fileInfo.FullName);
                    model.SmallWidth = smallImg.Width;
                    model.SmallHeight = smallImg.Height;
                    model.BigWidth = bigImg.Width;
                    model.BigHeight = bigImg.Height;
                    model.Type = "1";
                }
                else
                {
                    model.FileSize = fileInfo.Length;
                    model.Type = "2";
                }
                model.MsgKey = msgKey;
                await StartClass.manager.Proxy.Invoke("RemoveUPOne");
                var fileKey = messageProxy.Invoke<string>("saveFileInfo", model).Result;
                return fileKey;
            }
            catch (Exception ex)
            {
                //删除数据库信息
                await messageProxy.Invoke("upFileErrorDelMsg", msgKey);
                await StartClass.manager.Proxy.Invoke("RemoveUPOne");
                File.Delete(filePath);
                //推送到服务器删除
                throw;
            }
            
        }
        [HttpGet]
        public HttpResponseMessage GetPicForFileKey(string serviceKey, string key, string big)
        {
            //去消息服务器获取文件的路径
            var messageProxy = StartClass.manager.GetMessageProxyForKey(serviceKey);
            var fileInfo = messageProxy.Invoke<FileManagerUPModel>("getFileInfo", key).Result;
            string UpPath = ConfigurationManager.AppSettings["UpPath"].ToString();
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);


            if (big == "0")
            {
                if (!File.Exists(UpPath + fileInfo.PathName + "_Small"))
                    ImageHelper.CompressImage(UpPath + fileInfo.PathName, UpPath + fileInfo.PathName + "_Small", 400, 273, 80);
                result.Content = new ByteArrayContent(File.ReadAllBytes(UpPath + fileInfo.PathName + "_Small"));
            }
            else
            {
                result.Content = new ByteArrayContent(File.ReadAllBytes(UpPath + fileInfo.PathName));
            }
            if (fileInfo.FileExt.ToUpper() == "PNG")
            {
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");
            }
            else if (fileInfo.FileExt.ToUpper() == "JPG")
            {
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");

            }
            if (fileInfo.FileExt.ToUpper() == "BMP")
            {
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");
            }
            return result;


        }
        public HttpResponseMessage DownLastVersionExe()
        {
            string startUpPath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            string filePath = startUpPath + "\\Version\\lastVersion.exe";
            if (File.Exists(filePath))
            {
                FileInfo fileInfo = new FileInfo(filePath);
                FileProvider file1 = new FileProvider();
                var downFile = this.Request.GetFileInfoFromRequest(fileInfo.Length);
                var stream = File.Open(fileInfo.FullName,
                FileMode.Open, FileAccess.Read, FileShare.Read);
                if (downFile.From > 0)
                {
                    stream.Seek(downFile.From, SeekOrigin.Begin);
                }

                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

                response.Content = new StreamContent(stream, BufferSize);

                //response.Headers.AcceptRanges.Add("bytes");
                response.StatusCode = downFile.IsPartial ? HttpStatusCode.PartialContent
                                          : HttpStatusCode.OK;
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = fileInfo.Name;
                response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeType);
                response.Content.Headers.ContentLength = fileInfo.Length;
                if (downFile.IsPartial)
                {
                    response.Content.Headers.ContentRange
                        = new ContentRangeHeaderValue(downFile.From, downFile.To, fileInfo.Length);
                }
                return response;

            }
            else
            {
                return null;
            }
        }
        public HttpResponseMessage DownForMsgKey(DownFileModel model)
        {
            //从消息服务器获取文件信息
            var messageProxy = StartClass.manager.GetMessageProxyForKey(model.MessageServiceKey);
            var fileInfo = messageProxy.Invoke<FileManagerUPModel>("getFileInfo", model.FileKey).Result;
            string UpPath = ConfigurationManager.AppSettings["UpPath"].ToString();

            FileProvider file1 = new FileProvider();
            var downFile = this.Request.GetFileInfoFromRequest(fileInfo.FileSize);
            var stream = file1.Open(fileInfo.PathName);
            if (downFile.From > 0)
            {
                stream.Seek(downFile.From, SeekOrigin.Begin);
            }


            //var stream = new PartialContentFileStream(,downFile.From, downFile.To);

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);


            response.Content = new StreamContent(stream, BufferSize);

            //response.Headers.AcceptRanges.Add("bytes");
            response.StatusCode = downFile.IsPartial ? HttpStatusCode.PartialContent
                                      : HttpStatusCode.OK;
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = fileInfo.FileName;
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeType);
            response.Content.Headers.ContentLength = fileInfo.FileSize;
            if (downFile.IsPartial)
            {
                response.Content.Headers.ContentRange
                    = new ContentRangeHeaderValue(downFile.From, downFile.To, (long)123);
            }
            return response;
        }
        [HttpGet]
        public HttpResponseMessage GetHeadPic(string userKey, string type, string serviceKey)
        {
            if (!Directory.Exists("Photo"))
            {
                Directory.CreateDirectory("Photo");
            }
            if (!File.Exists("Photo\\" + userKey + ".png"))
            {
                var messageProxy = StartClass.manager.GetMessageProxyForKey(serviceKey);
                if (type == "2")
                {
                    var userList = messageProxy.Invoke<List<string>>("getGroupUserTop4", userKey).Result;
                    //看所有的群成员是否有头像,如果没有的话进行生成
                    List<string> list = new List<string>();
                    foreach (var user in userList)
                    {
                        if (!File.Exists("Photo\\" + user + ".png"))
                        {
                            var userNickName = messageProxy.Invoke<string>("getUserNickName", userKey).Result;
                            CreatePhone.Create(userNickName, "Photo\\" + user + ".png");
                        }
                        else
                        {
                            list.Add("Photo\\" + user + ".png");
                        }
                    }
                    //拉去群成员的前4个
                    CreatePhone.Create(list, "Photo\\" + userKey + ".png");
                }
                else
                {
                    //从消息服务器获取昵称
                    var userNickName = messageProxy.Invoke<string>("getUserNickName", userKey).Result;
                    CreatePhone.Create(userNickName, "Photo\\" + userKey + ".png");
                }
            }
            if (!File.Exists("Photo\\" + userKey + ".png"))
            {
                return null;
            }
            HttpResponseMessage result1 = new HttpResponseMessage(HttpStatusCode.OK);
            result1.Content = new ByteArrayContent(File.ReadAllBytes("Photo\\" + userKey + ".png"));
            result1.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");
            return result1;
        }
    }
}