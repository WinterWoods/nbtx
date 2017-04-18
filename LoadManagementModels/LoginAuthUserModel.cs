using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoadManagementModels
{
    /// <summary>
    /// 用于验证用户是否需要登录.
    /// </summary>
    public class LoginTestModel
    {
        public string Token { get; set; }
        public string Device { get; set; }
    }
    /// <summary>
    /// 用于客户端登录
    /// </summary>
    public class LoginAuthUserModel
    {
        /// <summary>
        /// 用于登录的警号
        /// </summary>
        public string LoginName { get; set; }
        /// <summary>
        /// 密码
        /// </summary>
        public string Password { get; set; }
    }
    /// <summary>
    /// 用于返回给客户端的东西
    /// </summary>
    public class LoginAuthOKUserModel
    {
        /// <summary>
        /// 准备连接的服务器
        /// </summary>
        public string ConnServiceIP { get; set; }
        /// <summary>
        /// 准备连接的端口
        /// </summary>
        public string ConnServicePort { get; set; }
        /// <summary>
        /// 用户key
        /// </summary>
        public string Key { get; set; }
        /// <summary>
        /// 用户授权码
        /// </summary>
        public string GuidAuth { get; set; }
    }
    /// <summary>
    /// 授权给要登录的服务器
    /// </summary>
    public class AuthServiceModel
    {
        /// <summary>
        /// 用户key
        /// </summary>
        public string Key { get; set; }
        /// <summary>
        /// 用户的授权码
        /// </summary>
        public string GuidAuth { get; set; }
        /// <summary>
        /// 验证时间
        /// </summary>
        public DateTime LoginTime { get; set; }
    }
    /// <summary>
    /// 用于头像服务器来消息服务器验证
    /// </summary>
    public class FileAuthServiceModel
    {
        public string ServiceIP { get; set; }
        public string ServicePort { get; set; }
        public string MessageServiceKey { get; set; }
        public string QueryKey { get; set; }
        public string FileKey { get; set; }

    }
}
