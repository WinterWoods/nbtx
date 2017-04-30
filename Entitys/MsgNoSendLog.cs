using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace Entitys
{
    /// <summary>
    /// 如果用户不在线,不进行发送,下次等候的时候进行推送
    /// </summary>
    public class MsgNoSendLog:Basic
    {
        [SZColumn(MaxLength = 32)]
        public string MsgKey { get; set; }
        /// <summary>
        /// 下次上线要发送的人
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string SendKey { get; set; }
        /// <summary>
        /// 1为pc,2为手机
        /// </summary>
        [SZColumn(MaxLength = 1)]
        public string Type { get; set; }
    }
    public class MsgPhoneReadSend : Basic
    {
        public string MsgKey { get; set; }
        public string SendKey { get; set; }
    }
}
