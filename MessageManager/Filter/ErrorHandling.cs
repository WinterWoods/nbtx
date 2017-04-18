using Helpers;
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
        static ConsoleHelper log = null;
        protected override void OnIncomingError(ExceptionContext exceptionContext, IHubIncomingInvokerContext invokerContext)
        {
            string _sConnectID = invokerContext.Hub.Context.ConnectionId;
            invokerContext.Hub.Clients.Caller.ExceptionHandler(exceptionContext.Error.Message);
            if (log == null)
                log = new ConsoleHelper();
            log.WriteError(exceptionContext.Error.Message);
            base.OnIncomingError(exceptionContext, invokerContext);
        }
    }
}
