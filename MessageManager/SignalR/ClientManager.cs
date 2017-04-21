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
        //DeleteGroupSend
        //reloadGroupInfo
        //receiveMsg
        //sendMsg
        //msgReadedList
        //reLogin
        //exceptionHandler
    }
}
