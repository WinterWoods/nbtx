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

namespace MessageManager
{
    public class StartClass
    {
        public static ConsoleHelper log = null;
        public static ProxyManager manager = new ProxyManager();
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
                log.WriteInfo("设置工作目录为:" + file.DirectoryName);
                log.WriteInfo("获取程序端口");
                var port = ConfigurationManager.AppSettings["ThisMachinePort"].ToString();
                log.WriteInfo("端口"+port);
                if (string.IsNullOrEmpty(port))
                {
                    port = "8888";
                }
                string url = "http://*:" + port + "/";
                log.WriteInfo("准备启动");
                WebApp.Start(url);

                //准备注册到服务器
                log.WriteInfo("准备连接到管理服务器");
                var loadUrl = ConfigurationManager.AppSettings["loadServiceUrl"].ToString();

                ClientCallBack client = new ClientCallBack();
                IHubProxy proxy = manager.ProxyInitManager(loadUrl, "ServiceManager");
                //注册所有回调的事件
                client.RegeditClientEvent(proxy);
                
                RegeditMessageService serverInfo = new RegeditMessageService();
                serverInfo.Key = ConfigurationManager.AppSettings["ThisMachineKey"].ToString();
                serverInfo.IP = ConfigurationManager.AppSettings["ThisMachineIP"].ToString();
                serverInfo.Port = ConfigurationManager.AppSettings["ThisMachinePort"].ToString();
                serverInfo.Code = ConfigurationManager.AppSettings["ThisMachineOrgCode"].ToString();


                manager.Start();
                manager.RegeditMessageService(serverInfo);
                Console.WriteLine("启动成功:" + url);
            }
            catch (Exception e)
            {
                Console.WriteLine("启动失败:" + e.Message);
                //throw e;

            }
        }
        public static void Stop()
        {
            manager.UnRegeditMessageService("主动停止");
            log.WriteInfo("停止系统");
        }
    }
}
