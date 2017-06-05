using Entitys;
using LoadManagementModels;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager
{
    /// <summary>
    /// 认证参数
    /// </summary>
    public static class AuthorizeSession
    {
        private static IHubContext context { get; set; }
        /// <summary>
        /// 登录，登录成功调用此方法
        /// </summary>
        /// <param name="Context"></param>
        /// <param name="userKey"></param>
        public static void SignIn(this HubCallerContext Context, string userKey, AuthServiceModel model)
        {
            using (DB db = new DB())
            {
                var user = db.UserInfo.Find(userKey);
                if (model.Type == "1")
                {
                    user.HubId = Context.ConnectionId;
                    db.UserInfo.Edit(user);

                }
                else
                {
                    user.PhoneHubId = Context.ConnectionId;
                    db.UserInfo.Edit(user);
                }
                db.Save();
            }
        }
        /// <summary>
        /// 登出
        /// </summary>
        /// <param name="Context"></param>
        public static void SignOut(this HubCallerContext Context)
        {
            using (DB db = new DB())
            {
                var model = db.UserInfo.AsQuery().Where(w => w.HubId == Context.ConnectionId).FirstOrDefault();
                if (model != null)
                {
                    model.HubId = "";
                    db.UserInfo.Edit(model);
                    db.Save();
                }
                var model1 = db.UserInfo.AsQuery().Where(w => w.PhoneHubId == Context.ConnectionId).FirstOrDefault();
                if (model1 != null)
                {
                    model1.PhoneHubId = "";
                    db.UserInfo.Edit(model1);
                    db.Save();
                }
            }
        }
        /// <summary>
        /// 当前登录用户
        /// </summary>
        /// <param name="Context"></param>
        /// <returns></returns>
        public static UserInfo User(this HubCallerContext Context)
        {
            using (DB db = new DB())
            {
                return db.UserInfo.AsQuery().Where(w => w.HubId == Context.ConnectionId || w.PhoneHubId == Context.ConnectionId).FirstOrDefault();
            }
        }
        /// <summary>
        /// 验证是否登录
        /// </summary>
        /// <param name="Context"></param>
        /// <returns></returns>
        public static bool IsAuthenticated(this HubCallerContext Context)
        {
            using (DB db = new DB())
            {
                var user = db.UserInfo.AsQuery().Where(w => w.HubId == Context.ConnectionId || w.PhoneHubId == Context.ConnectionId).FirstOrDefault();
                if (user == null)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }
    }
}
