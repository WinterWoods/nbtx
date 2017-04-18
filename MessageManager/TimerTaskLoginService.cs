using Entitys;
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
        public static void SignIn(this HubCallerContext Context, string userKey)
        {
            using (DB db = new DB())
            {
                var model = db.UserInfo.Find(userKey);
                model.HubId = Context.ConnectionId;
                db.UserInfo.Edit(model);
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
                var model = db.UserInfo.Where(w => w.HubId == Context.ConnectionId).ToEntity();
                if (model != null)
                {
                    model.HubId = "";
                    db.UserInfo.Edit(model);
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
                return db.UserInfo.Where(w => w.HubId == Context.ConnectionId).ToEntity();
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
                var user = db.UserInfo.Where(w => w.HubId == Context.ConnectionId).ToEntity();
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
