using Helpers;
using LoadManagementModels;
using Microsoft.AspNet.SignalR.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager
{
    public class ClientCallBack
    {
        public void RegeditClientEvent(IHubProxy proxy)
        {
            proxy.On< AuthServiceModel>("authUserModel", data => {
                AuthorizationUserManager.AuthUserAdd(data);
            });
        }

    }
}
