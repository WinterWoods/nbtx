using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileManager.Filter
{
    public class ApiAuthorizeAttribute : System.Web.Http.AuthorizeAttribute
    {
        private string[] noAuth;
        public ApiAuthorizeAttribute(string[] noAuth)
        {
            this.noAuth = noAuth;
        }
        public override void OnAuthorization(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            string ActionName = actionContext.ActionDescriptor.ActionName;
            string ControllerName = actionContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            if (!this.noAuth.Any(a => a == ControllerName + "/" + ActionName))
            {
                try
                {

                    var invitation = actionContext.Request.Headers.GetValues("invitation").ToList();
                    if (invitation.Count != 0 && invitation[0] != "nbtx")
                    {
                        throw new Exception("未经授权的应用！");
                    }
                    var ticket = actionContext.Request.Headers.GetValues("ticket").ToList();
                    if (ticket.Count != 0 && string.IsNullOrEmpty(ticket[0]))
                    {
                        throw new Exception("未经授权的应用！");
                    }
                    else
                    {
                        var messageServiceKeyHeaders = actionContext.Request.Headers.GetValues("MessageServiceKey").ToList(); 
                        string messageServiceKey = "";
                        if (messageServiceKeyHeaders.Count != 0)
                        {
                            messageServiceKey = messageServiceKeyHeaders[0];
                        }
                        if (string.IsNullOrEmpty(messageServiceKey)) throw new Exception("错误的上传.");
                        var messageProxy = StartClass.manager.GetMessageProxyForKey(messageServiceKey);
                       if(! messageProxy.Invoke< bool>("authQuery", ticket[1]).Result)
                        {
                            throw new Exception("未登录，请重新登录！");
                        }
                        //if (!actionContext.IsAuthenticated())
                        //{
                        //    actionContext.ReLogin();
                        //    throw new Exception("未登录，请重新登录！");

                        //}

                    }
                }
                catch
                {
                    if (actionContext.Request.Method.Method == "GET")
                    {
                        string invitation = "";
                        string ticket = "";
                        string serviceKey = "";
                        var query = actionContext.Request.RequestUri.Query;
                        query = query.Replace("?", "");
                        string[] q = query.Split(new char[] { '&' });
                        for (int i = 0; i < q.Length; i++)
                        {
                            var arr = q[i].Split(new char[] { '=' });
                            if (arr.Length > 1)
                            {
                                if (arr[0] == "invitation")
                                {
                                    invitation = arr[1];
                                }
                                if (arr[0] == "ticket")
                                {
                                    ticket = arr[1];
                                }
                                if (arr[0] == "serviceKey")
                                {
                                    serviceKey = arr[1];
                                }
                            }
                        }
                        if (string.IsNullOrEmpty(invitation) || string.IsNullOrEmpty(ticket) || string.IsNullOrEmpty(serviceKey))
                        {
                            throw new Exception("未经授权的应用！");
                        }
                        var messageProxy = StartClass.manager.GetMessageProxyForKey(serviceKey);
                        if (!messageProxy.Invoke<bool>("authQuery", ticket).Result)
                        {
                            throw new Exception("未登录，请重新登录！");
                        }
                    }
                    else
                    {
                        throw new Exception("未经授权的应用！");
                    }

                }
            }
        }

    }
}
