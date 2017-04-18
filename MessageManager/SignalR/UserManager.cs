using Entitys;
using Helpers;
using LoadManagementModels;
using MessageManager.Filter;
using MessageManager.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager.SignalR
{
    [LoginAuthorize]
    public class UserManager : Hub
    {
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<MsgManager>();
        /// <summary>
        /// 登陆系统
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<UserInfo> SignIn(LoginAuthOKUserModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var authUser = AuthorizationUserManager.GetAuthUser(model.Key);
                    if (authUser == null)
                    {
                        throw new Exception("获取授权错误,请重新登录.");
                    }
                    if (DateTime.Now - authUser.LoginTime > new TimeSpan(0, 0, 30))
                    {
                        throw new Exception("授权已经超时,请重新登录.");
                    }
                    if (authUser.GuidAuth != model.GuidAuth)
                    {
                        throw new Exception("授权码错误,请重新登录.");
                    }
                    var user = db.UserInfo.Find(model.Key);
                    if (user == null)
                    {
                        throw new Exception("没有查询到该用户");
                    }
                    Context.SignIn(user.Key);
                    
                    return user;
                }
            });
        }
        public void EditPassword(EditPasswordModel model)
        {
            Task.Factory.StartNew(() =>
            {
                var myUser = Context.User();
                using (DB db = new DB())
                {
                    var user = db.UserInfo.Find(myUser.Key);
                    if (user.PassWord != MD51.StrMD5("!@#SZ" + model.OldPassword))
                    {
                        throw new Exception("旧密码错误");
                    }
                    user.PassWord = MD51.StrMD5("!@#SZ" + model.Password);
                    db.UserInfo.Edit(user);
                    db.Save();
                }
            });
        }
        /// <summary>
        /// 退出系统
        /// </summary>
        public void SignOut()
        {
            Task.Factory.StartNew(() =>
            {
                Context.SignOut();
                var sessionUser = Context.User();
                using (DB db = new DB())
                {
                    var user = db.UserInfo.Find(sessionUser.Key);
                    user.HubId = "";
                    db.UserInfo.Edit(user);
                    
                    db.Save();
                }
            });
        }
        public Task<UserConfig> SettingConfigGet()
        {
            return Task.Factory.StartNew(() =>
            {
                UserConfig result = new UserConfig();
                var sessionUser = Context.User();
                using (DB db = new DB())
                {
                    result = db.UserConfig.Where(w => w.User_Key == sessionUser.Key).ToEntity();
                    if (result == null)
                    {
                        result = new UserConfig();
                        result.ShowWin = "Ctrl+Alt+Z";
                        result.User_Key = sessionUser.Key;
                        result.CopySc = "Ctrl+Alt+A";
                        result.AutoRun = true;
                        result = db.UserConfig.Add(result);
                    }
                    db.Save();

                }
                return result;
            });
        }
        public void SettingConfigSet(UserConfig model)
        {
            Task.Factory.StartNew(() =>
            {
                UserConfig result = null;
                var sessionUser = Context.User();
                using (DB db = new DB())
                {
                    result = db.UserConfig.Where(w => w.User_Key == sessionUser.Key).ToEntity();
                    result.ShowWin = model.ShowWin;
                    result.CopySc = model.CopySc;
                    result.AutoRun = model.AutoRun;
                    db.UserConfig.Edit(result);
                    db.Save();
                }
            });
        }
    }
}
