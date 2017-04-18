using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace Entitys
{
    /// <summary>
    /// 消息发送列表，用于重新登录进行加载
    /// </summary>
    public class OftenList : Basic
    {
        [SZColumn(MaxLength = 32)]
        public string UserKey { get; set; }
        [SZColumn(MaxLength = 200)]
        public string FriendName { get; set; }
        [SZColumn(MaxLength = 32)]
        public string FriendKey { get; set; }
        public DateTime? LastTime { get; set; }
        /// <summary>
        /// 最后一条消息记录，暂时不写入
        /// </summary>
        [SZColumn(MaxLength = 4000)]
        public string LastMsgContext { get; set; }
        public int MessageCount { get; set; }
        /// <summary>
        /// 1为人，2为群
        /// </summary>
        [SZColumn(MaxLength = 1)]
        public string Type { get; set; }
        /// <summary>
        /// 1,被移除群，只针对群聊有效,2群解散
        /// </summary>
        public string IsRemove { get; set; }
    }
}
