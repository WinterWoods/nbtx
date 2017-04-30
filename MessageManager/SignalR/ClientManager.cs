using MessageManager.Filter;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager.SignalR
{
    [LoginAuthorize]
    public class ClientManager : Hub
    {
        public override Task OnConnected()
        {
            StartClass.log.WriteInfo("一个新用户连接了进来." + Context.ConnectionId);
            return base.OnConnected();
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            StartClass.log.WriteInfo("一个用户断开了." + Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }
        //DeleteGroupSend
        //reloadGroupInfo
        //receiveMsg
        //sendMsg
        //msgReadedList
        //reLogin
        //exceptionHandler
    }
}
