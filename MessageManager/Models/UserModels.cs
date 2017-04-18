using System;

namespace MessageManager.Models
{
    public class UserQuery
    {
        public string Name { get; set; }
    }
    /// <summary>
    /// 登录用户
    /// </summary>
    public class LoginUser
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
    public class EditPasswordModel
    {
        public string OldPassword { get; set; }
        public string Password { get; set; }
    }
}
