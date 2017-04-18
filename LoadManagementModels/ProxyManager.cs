using Helpers;
using LoadManagementModels;
using Microsoft.AspNet.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LoadManagementModels
{
    public class ProxyManager
    {
        private static Dictionary<string, ProxyManager> proxyList = new Dictionary<string, ProxyManager>();
        HubConnection hub;
        IHubProxy proxy;
        private bool isStart = false;
        ConsoleHelper log = new ConsoleHelper();
        RegeditFileService serverFileInfo;
        RegeditMessageService serverMessageInfo;
        string _url = "";
        string _hubName = "";
        private static object loackProxyList = new object();

        public event Action Hub_Closed;

        public bool IsStart
        {
            get
            {
                return isStart;
            }

            set
            {
                isStart = value;
            }
        }

        public IHubProxy Proxy
        {
            get
            {
                return proxy;
            }

            set
            {
                proxy = value;
            }
        }

        public HubConnection Hub
        {
            get
            {
                return hub;
            }

            set
            {
                hub = value;
            }
        }

        public IHubProxy ProxyInitManager(string url, string hubName)
        {
            Hub = new HubConnection(url);
            if (Hub_Closed != null)
                Hub.Closed += Hub_Closed;
            Proxy = Hub.CreateHubProxy(hubName);
            _url = url;
            _hubName = hubName;
            return Proxy;
        }

        public void RegeditFileService(RegeditFileService ser)
        {
            if (isStart)
            {
                log.WriteInfo("注册信息RegeditService.");
                serverFileInfo = ser;
                Proxy.Invoke("regeditFileService", ser);
                log.WriteInfo("注册信息RegeditService成功.");
            }
        }
        public void UnRegeditFileService(string msg)
        {
            if (isStart)
            {
                log.WriteInfo("卸载服务UnRegeditService.");
                UnRegeditFileService reg = new UnRegeditFileService();
                reg.Key = serverFileInfo.Key;
                reg.UnMessage = msg;
                Proxy.Invoke("unRegeditFileService", reg);
                log.WriteInfo("卸载服务UnRegeditService成功.");
            }
        }
        public void RegeditMessageService(RegeditMessageService ser)
        {
            if (isStart)
            {
                log.WriteInfo("注册信息RegeditService.");
                serverMessageInfo = ser;
                Proxy.Invoke("regeditMessageService", ser);
                log.WriteInfo("注册信息RegeditService成功.");
            }

        }
        public void UnRegeditMessageService(string msg)
        {
            if (isStart)
            {
                log.WriteInfo("卸载服务UnRegeditService.");
                UnRegeditMessageService reg = new UnRegeditMessageService();
                reg.Key = serverMessageInfo.Key;
                reg.UnMessage = msg;
                Proxy.Invoke("unRegediMessageService", reg);
                log.WriteInfo("卸载服务UnRegeditService成功.");
            }
        }
        public FileServiceModel GetPhotoService()
        {
            var fileService = Proxy.Invoke<FileServiceModel>("getPhotoService").Result;
            return fileService;
        }
        public FileServiceModel GetUPFileService()
        {
            var fileService = Proxy.Invoke<FileServiceModel>("getUPFileService").Result;
            return fileService;
        }
        public RegeditFileService GetDownFileService(string serviceKey)
        {
            var fileService = Proxy.Invoke<RegeditFileService>("getDownFileService", serviceKey).Result;
            return fileService;
        }
        public RegeditMessageService GetMessageServiceForKey(string serviceKey)
        {
            var service = Proxy.Invoke<RegeditMessageService>("getMessageService", serviceKey).Result;
            return service;
        }
        public IHubProxy GetMessageProxyForKey(string serviceKey)
        {
            var service = Proxy.Invoke<RegeditMessageService>("getMessageService", serviceKey).Result;
            lock (loackProxyList)
            {
                if (!proxyList.ContainsKey(service.IP + ":" + service.Port))
                {
                    ProxyManager manager = new ProxyManager();
                    var _messageProxy = manager.ProxyInitManager("http://" + service.IP + ":" + service.Port + "/", "serviceMessage");
                    manager.Hub.Closed += () => {
                        //当这个链接断开,需要删除
                        proxyList.Remove(service.IP + ":" + service.Port);
                    };
                    manager.Start();
                    proxyList.Add(service.IP + ":" + service.Port, manager);
                }
            }
            
            var messageProxy = proxyList[service.IP + ":" + service.Port].Proxy;
            return messageProxy;
        }

        public bool IsAuth()
        {
            return true;
        }
        public string SaveFileInfo(FileManagerUPModel model)
        {
            var fileInfo = Proxy.Invoke<string>("saveFileInfo", model).Result;
            return fileInfo;
        }
        public void Start()
        {
            while (true)
            {
                try
                {
                    log.WriteInfo("尝试连接load服务.");
                    if (Hub.Start().Wait(1000 * 30))
                    {
                        isStart = true;
                        log.WriteInfo("连接load服务器成功.");
                        break;
                    }
                    else
                    {
                        isStart = false;
                        log.WriteError("连接超时.");

                    }

                }
                catch (Exception ex)
                {
                    log.WriteError("注册失败.");
                }
                Thread.Sleep(1000);
            }
        }
    }
}
