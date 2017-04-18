using Helpers;
using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoadManagement
{
    public class StartClass
    {
        static ConsoleHelper log=null;
        static Process process;
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
                var port = ConfigurationManager.AppSettings["port"].ToString();
                log.WriteInfo("端口:"+port);

                if (string.IsNullOrEmpty(port))
                {
                    port = "8888";
                    log.WriteInfo("使用默认端口:" + port);
                }
                string url = "http://*:" + port + "/";

                WebApp.Start(url);
                log.WriteInfo("启动成功:" + url);

                ProcessHelpers.KillProcess("redis-server.exe");

                process = new Process();
                process.StartInfo.FileName = file.DirectoryName+"\\redis\\redis-server.exe";
                process.StartInfo.Arguments = " redis.conf";

                process.StartInfo.CreateNoWindow = true;

                process.StartInfo.WorkingDirectory = file.DirectoryName + @"\redis\";

                process.Start();

                Console.WriteLine();
            }
            catch (Exception e)
            {
                log.WriteError("启动失败:" + e.Message);
            }
        }
        public static void Stop()
        {
        }
    }
}
