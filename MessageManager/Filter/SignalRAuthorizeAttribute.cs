using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager.Filter
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false, AllowMultiple = false)]
    public class LoginAuthorizeAttribute : AuthorizeAttribute
    {
        public override bool AuthorizeHubConnection(HubDescriptor hubDescriptor, IRequest request)
        {
            return true;
        }

        public override bool AuthorizeHubMethodInvocation(IHubIncomingInvokerContext hubIncomingInvokerContext, bool appliesToMethod)
        {
            //return true;
            if (hubIncomingInvokerContext.MethodDescriptor.Hub.Name == "UserManager" && hubIncomingInvokerContext.MethodDescriptor.Name == "SignIn")
            {
                return true;
            }
            if (hubIncomingInvokerContext.Hub.Context.IsAuthenticated())
            {
                return true;
            }
            else
            {
                hubIncomingInvokerContext.Hub.Clients.Caller.reLogin();
            }
            return false;
        }
    }
}
