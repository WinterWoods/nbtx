using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace Entitys
{
    /// <summary>
    /// 好友信息,不用来存储群
    /// </summary>
    public class FriendsInfo:Basic
    {
        [SZColumn(MaxLength = 32)]
        public string UserKey { get; set; }
        [SZColumn(MaxLength = 32)]
        public string FiendKey { get; set; }
        /// <summary>
        /// 如果为人的话，备注名称
        /// </summary>
        [SZColumn(MaxLength = 200)]
        public string Name { get; set; }

    }
    public class FriendsSearch
    {
        public string Type { get; set; }
    }
    /// <summary>
    /// 群组信息
    /// </summary>
    public class GroupInfo : Basic
    {
        /// <summary>
        /// 群名字
        /// </summary>
        [SZColumn(MaxLength = 200)]
        public string GroupName { set; get; }
        /// <summary>
        /// 公告
        /// </summary>
        [SZColumn(MaxLength = 2000)]
        public string GroupBrief { get; set; }
        /// <summary>
        /// 更新人
        /// </summary>
        public DateTime? BriefUpTime { get; set; }
        /// <summary>
        /// 更新人
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string BriefUpKey { get; set; }
        public int MaxCount { get; set; }
        public int NowCount { get; set; }
        /// <summary>
        /// 群主key
        /// </summary>
        public string GroupMainKey { get; set; }
        /// <summary>
        /// 仅有群主可以管理
        /// </summary>
        public bool OnlyMainManager { get; set; }
        /// <summary>
        /// 查看历史记录，默认为false
        /// </summary>
        public bool LogMsgLook{get;set;}
    }
    /// <summary>
    /// 群成员信息
    /// </summary>
    public class GroupUser : Basic
    {
        /// <summary>
        /// 群人员
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string UserKey { get; set; }
        /// <summary>
        /// 人员名字
        /// </summary>
        [SZColumn(MaxLength = 200)]
        public string UserName { get; set; }
        /// <summary>
        /// 群key
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string GroupKey { get; set; }
        /// <summary>
        /// 1 为群主，2为管理员，3群众
        /// </summary>
        [SZColumn(MaxLength = 1)]
        public string Type { get; set; }
        /// <summary>
        /// 是否退出群聊
        /// </summary>
        public bool IsExit { get; set; }
    }
}
