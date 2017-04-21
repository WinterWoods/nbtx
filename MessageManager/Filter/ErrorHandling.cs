using Helpers;
using MessageManager.SignalR;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager.Filter
{
    public class ErrorHandling : HubPipelineModule
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ClientManager>();
        static ConsoleHelper log = null;
        protected override void OnIncomingError(ExceptionContext exceptionContext, IHubIncomingInvokerContext invokerContext)
        {
            string _sConnectID = invokerContext.Hub.Context.ConnectionId;
            context.Clients.Client(_sConnectID).ExceptionHandler(exceptionContext.Error.Message);
            //invokerContext.Hub.Clients.Caller.ExceptionHandler(exceptionContext.Error.Message);
            if (log == null)
                log = new ConsoleHelper();
            log.WriteError(exceptionContext.Error.Message);
            base.OnIncomingError(exceptionContext, invokerContext);
        }
    }
}
