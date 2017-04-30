using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SZORM;

namespace Entitys
{
    /// <summary>
    /// 数据库连接
    /// </summary>
    public partial class DB : DbContext
    {
        /// <summary>
        /// 接口用户信息
        /// </summary>
        public DbSet<IUserView> IUserView { get; set; }
        /// <summary>
        /// 接口组织信息
        /// </summary>
        public DbSet<IOrgView> IOrgView { get; set; }
        /// <summary>
        /// 用户信息
        /// </summary>
        public DbSet<UserInfo> UserInfo { get; set; }
        /// <summary>
        /// 用户云端保存配置表
        /// </summary>
        public DbSet<UserConfig> UserConfig { get; set; }
        /// <summary>
        /// 设备登录信息
        /// </summary>
        public DbSet<UserDeviceList> UserDeviceList { get; set; }
        /// <summary>
        /// 消息列表
        /// </summary>
        public DbSet<OftenList> OftenList { get; set; }
        /// <summary>
        /// 未发送的消息记录,如果发送后,删除.如果撤销也需要删除
        /// </summary>
        public DbSet<MsgNoSendLog> MsgNoSendLog { get; set; }
        /// <summary>
        /// 所有已读消息暂存,用于手机端同步
        /// </summary>
        public DbSet<MsgPhoneReadSend> MsgPhoneReadSend { get; set; }
        /// <summary>
        /// 消息记录列表
        /// </summary>
        public DbSet<MsgInfo> MsgInfo { get; set; }
        /// <summary>
        /// 好友，只用来存储好友。不用来存储群消息
        /// </summary>
        public DbSet<FriendsInfo> FriendsInfo { get; set; }
        /// <summary>
        /// 群组信息
        /// </summary>
        public DbSet<GroupInfo> GroupInfo { get; set; }
        /// <summary>
        /// 群成员
        /// </summary>
        public DbSet<GroupUser> GroupUser { get; set; }
        /// <summary>
        /// 所有上传的文件信息
        /// </summary>
        public DbSet<UpFileInfo> UpFileInfo { get; set; }
        /// <summary>
        /// 群消息是否读取记录
        /// </summary>
        public DbSet<MsgGroupRead> MsgGroupRead { get; set; }
    }
}
