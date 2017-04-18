using Entitys;
using LoadManagementModels;
using MessageManager.SignalR;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager
{
    /// <summary>
    /// 授权用户管理,从load服务器传递过来的,传递过来的都是经过授权的.
    /// </summary>
    public class AuthorizationUserManager
    {
        static IHubContext context = GlobalHost.ConnectionManager.GetHubContext<UserManager>();
        private static List<AuthServiceModel> authUserList = new List<AuthServiceModel>();
        public static void AuthUserAdd(AuthServiceModel model)
        {
            //将授权的用户记录下来,如果已经存在则干掉之前的,添加新的.
            if (authUserList.Any(a => a.Key == model.Key))
            {
                authUserList.RemoveAll(r => r.Key == model.Key);
            }
            authUserList.Add(model);
            //using (DB db = new DB())
            //{
            //    var user = db.UserInfo.Find(model.Key);
            //    if (user != null && !string.IsNullOrEmpty(user.HubId))
            //    {
            //        context.Clients.Client(user.HubId).reLogin();
            //    }
            //}
        }
        public static AuthServiceModel GetAuthUser(string Key)
        {
            return authUserList.First(f => f.Key == Key);
        }
    }
}
