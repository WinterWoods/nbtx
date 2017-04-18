using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace Entitys
{
    public class MsgGroupRead:Basic
    {
        /// <summary>
        /// 那条消息,消息主键
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string MsgKey { get; set; }
        /// <summary>
        /// 那条用户读取的
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string UserKey { get; set; }
        /// <summary>
        /// 那个群的消息
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string GroupKey { get; set; }
        /// <summary>
        /// 读取时间
        /// </summary>
        public DateTime ReadTime { get; set; }
    }
}
