using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entitys
{
    /// <summary>
    /// 用户信息
    /// </summary>
    public class UserInfo:Basic
    {
        /// <summary>
        /// 号码
        /// </summary>
        [SZORM.SZColumn(MaxLength = 18)]
        public string UserNumber { get; set; }
        /// <summary>
        /// 密码
        /// </summary>
        [SZORM.SZColumn(MaxLength = 200)]
        public string PassWord { get; set; }
        /// <summary>
        /// 身份证号,利用身份证号关联接口
        /// </summary>
        [SZORM.SZColumn(MaxLength =18)]
        public string IDCard { get; set; }
        /// <summary>
        /// 昵称
        /// </summary>
        [SZORM.SZColumn(MaxLength = 50)]
        public string NickName { get; set; }
        /// <summary>
        /// 客户端消息
        /// </summary>
        [SZORM.SZColumn(MaxLength = 100)]
        public string HubId { get; set; } 
        /// <summary>
        /// 最后一次登录时间
        /// </summary>
        public DateTime? LastLoginTime { get; set; }
        /// <summary>
        /// 手机号
        /// </summary>
        [SZORM.SZColumn(MaxLength = 20)]
        public string Phone { get; set; }  //手机
        /// <summary>
        /// 搜索字段
        /// </summary>
        [SZORM.SZColumn(MaxLength = 100)]
        public string Search { get; set; }
        /// <summary>
        /// 内网电话
        /// </summary>
        [SZORM.SZColumn(MaxLength = 20)]
        public string Tel { get; set; }  //内网电话
    }
    /// <summary>
    /// 用户登录设备列表
    /// </summary>
    public class UserDeviceList:Basic
    {
        /// <summary>
        /// 用户Key
        /// </summary>
        [SZORM.SZColumn(MaxLength = 32)]
        public string User_Key { get; set; }
        /// <summary>
        /// 用户设备
        /// </summary>
        [SZORM.SZColumn(MaxLength = 32)]
        public string User_Device { get; set; }
        /// <summary>
        /// token
        /// </summary>
        [SZORM.SZColumn(MaxLength = 32)]
        public string User_Token { get; set; }
    }
    /// <summary>
    /// 系统配置,云端保存
    /// </summary>
    public class UserConfig : Basic
    {
        /// <summary>
        /// 用户key
        /// </summary>
        [SZORM.SZColumn(MaxLength = 32)]
        public string User_Key { get; set; }
        /// <summary>
        /// 显示窗体快捷键
        /// </summary>
        [SZORM.SZColumn(MaxLength = 100)]
        public string ShowWin { get; set; }
        /// <summary>
        /// 截图快捷键
        /// </summary>
        [SZORM.SZColumn(MaxLength = 100)]
        public string CopySc { get; set; }
        /// <summary>
        /// 是否自动运行
        /// </summary>
        public bool? AutoRun { get; set; }
    }
}
