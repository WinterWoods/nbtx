using Helpers;
using LoadManagementModels;
using Microsoft.AspNet.SignalR.Client;
using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileManager
{
    public class StartClass
    {
        public static ProxyManager manager = new ProxyManager();
        static ConsoleHelper log = null;
        public static void Start()
        {
            try
            {
                Directory.SetCurrentDirectory("C:\\");
                //获取当前文件目录
                FileInfo file = new FileInfo(Process.GetCurrentProcess().MainModule.FileName);
                //设置工作目录为文件目录
                Directory.SetCurrentDirectory(file.DirectoryName);
                log = new ConsoleHelper();
                log.WriteInfo("获取配置端口");
                var port = ConfigurationManager.AppSettings["ThisMachinePort"].ToString();
                log.WriteInfo("端口:" + port);

                if (string.IsNullOrEmpty(port))
                {
                    port = "7777";
                    log.WriteInfo("使用默认端口:" + port);
                }
                string url = "http://*:" + port + "/";

                WebApp.Start<Startup>(url);
                log.WriteInfo("启动成功文件服务管理器:" + url);
                log.WriteInfo("准备连接到文件管理服务器");
                var loadUrl = ConfigurationManager.AppSettings["loadServiceUrl"].ToString();


                var proxy = manager.ProxyInitManager(loadUrl, "ServiceManager");
                RegeditFileService serverInfo = new RegeditFileService();
                serverInfo.Key = ConfigurationManager.AppSettings["ThisMachineKey"].ToString();
                serverInfo.IP = ConfigurationManager.AppSettings["ThisMachineIP"].ToString();
                serverInfo.Port = ConfigurationManager.AppSettings["ThisMachinePort"].ToString();
                serverInfo.IsPhotoService = ConfigurationManager.AppSettings["IsPhotoService"].ToString().ToLower() == "true" ? true : false;
                manager.Hub_Closed += Manager_Hub_Closed;
                manager.Start();
                manager.RegeditFileService(serverInfo);
                log.WriteInfo("启动成功:" + url);
            }
            catch (Exception e)
            {
                log.WriteError("启动失败:" + e.Message);
                //throw e;
            }
        }

        private static void Manager_Hub_Closed()
        {
            manager.Start();
        }

        public static void Stop()
        {
            manager.UnRegeditMessageService("主动停止");
            log.WriteInfo("停止系统");
        }
    }
}
