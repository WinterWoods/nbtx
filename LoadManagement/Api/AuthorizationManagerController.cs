using Entitys;
using Helpers;
using LoadManagement.SignalR;
using LoadManagementModels;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SZORM;

namespace LoadManagement.Api
{
    public class AuthorizationManagerController : ApiController
    {
        public LoginAuthOKUserModel TestConnService(LoginTestModel model)
        {
            LoginAuthOKUserModel result = new LoginAuthOKUserModel();
            if (model == null || string.IsNullOrEmpty(model.Token))
            {
                return result;
            }
            using (DB db = new DB())
            {
                DateTime now7 = DateTime.Now.AddDays(-7);
                var userDevice = db.UserDeviceList.Where(w => w.UserToken == model.Token && w.UserDevice == model.Device&&w.LastLoginTime> now7).ToEntity();
                if (userDevice == null)
                    return result;
                var user = db.UserInfo.Find(userDevice.User_Key);
                return Login(user,model.Device,model.Type);
            }
        }
        IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ServiceManager>();
        //在这里验证是否登录成功,如果登录成功后对分配的各地市服务器进行授权.然后客户端进行连接到各地市的服务器

        public LoginAuthOKUserModel LoginService(LoginAuthUserModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.LoginName) || string.IsNullOrEmpty(model.Password))
            {
                throw new Exception("用户名或密码不允许为空.");
            }
            using (DB db = new DB())
            {

                var tmpList = db.UserInfo.ToList();
                var user = db.UserInfo.Where(w => w.UserNumber == model.LoginName).ToEntity();
                if (user == null)
                {
                    var iUser = db.IUserView.Where(w => w.No == model.LoginName).ToEntity();
                    if (iUser == null)
                        throw new Exception("没有该用户!");
                    else
                    {
                        //初始一个密码
                        user = db.UserInfo.Where(w => w.IDCard == iUser.IDCard).ToEntity();
                        if (user != null)
                        {
                            user.UserNumber = iUser.No;
                        }
                        else
                        {
                            user = db.UserInfo.Add(new UserInfo() { UserNumber = iUser.No, PassWord = MD51.StrMD5("!@#SZ" + "123456"), IDCard = iUser.IDCard, NickName = iUser.Name });
                        }
                        //通知头像服务器进行创建头像

                    }
                }
                if (string.IsNullOrEmpty(user.PassWord))
                {
                    user.PassWord = MD51.StrMD5("!@#SZ" + "123456");
                }


                if (user.PassWord != MD51.StrMD5("!@#SZ" + model.Password))
                {
                    throw new Exception("用户名或密码错误!");
                }
                db.Save();
                return Login(user,model.Device,model.Type);
            }
        }
        private LoginAuthOKUserModel Login(UserInfo user,string deviceId,string loginType)
        {
            using (DB db = new DB())
            {
                LoginAuthOKUserModel result = new LoginAuthOKUserModel();
                var _iUser = db.IUserView.Where(w => w.IDCard == user.IDCard).ToEntity();
                if (_iUser == null)
                {
                    throw new Exception("您的用户已经不存在.");
                }
                var iOrg = db.IOrgView.Where(w => w.Code == _iUser.OrgCode).ToEntity();
                if (iOrg == null)
                {
                    throw new Exception("您登录的用户没有单位");
                }
                var ser = RegeditServices.GetMessageService(iOrg.Code.Substring(0, 4));
                if (ser == null)
                {
                    throw new Exception("您的所在单位节点服务器异常.请通知管理员");
                }
                //查询所有注册的服务器
                //通知其他服务,用户登录
                AuthServiceModel authModel = new AuthServiceModel();
                authModel.Key = user.Key;
                authModel.GuidAuth = Guid.NewGuid().ToString();
                authModel.LoginTime = DateTime.Now;
                authModel.Type = loginType;
                
                result.ConnServiceIP = ser.IP;
                result.GuidAuth = authModel.GuidAuth;
                result.ConnServicePort = ser.Port;

                context.Clients.Client(ser.ConnHubId).authUserModel(authModel);


                var oldUserDevice= db.UserDeviceList.Where(w => w.User_Key == user.Key && w.UserDevice == deviceId).ToEntity();
                if (oldUserDevice != null)
                {
                    oldUserDevice.UserToken = authModel.GuidAuth;
                    oldUserDevice.LastLoginTime = DateTime.Now;
                    db.UserDeviceList.Edit(oldUserDevice);
                }
                else
                {
                    UserDeviceList device = new UserDeviceList();
                    device.User_Key = user.Key;
                    device.LastLoginTime = DateTime.Now;
                    device.UserToken = authModel.GuidAuth;
                    device.UserDevice = deviceId;
                    db.UserDeviceList.Add(device);
                }
                user = db.UserInfo.Edit(user);
                db.Save();
                return result;
            }
        }
    }
}
