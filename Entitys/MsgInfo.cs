using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace Entitys
{
    public class MsgInfo:Basic
    {
        /// <summary>
        /// 发送人
        /// </summary>
        [SZColumn(MaxLength =32)]
        public string SendKey { get; set; }
        /// <summary>
        /// 接受人，活着接受群
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string ReceivedKey { get; set; }
        public DateTime? SendTime { get; set; }
        /// <summary>
        /// 是否查看 如果为空就是未读
        /// </summary>
        public DateTime? ReadTime { get; set; }
        /// <summary>
        /// 读取数量,用于群聊专用
        /// </summary>
        public int ReadPersonCount { get; set; }
        /// <summary>
        /// 消息内容
        /// </summary>
        public string Context { get; set; }
        /// <summary>
        /// 1 为人，2为群
        /// </summary>
        [SZColumn(MaxLength = 1)]
        public string Type { get; set; }
        /// <summary>
        /// 1文本，2图片，3文件，9撤销
        /// </summary>
        [SZColumn(MaxLength = 1)]
        public string MsgType { get; set; }
        /// <summary>
        /// 文件是否上传完成
        /// </summary>
        public bool? FileUpOver { get; set; }
        /// <summary>
        /// 文件Key
        /// </summary>
        [SZColumn(MaxLength = 32)]
        public string FileKey { get; set; }
    }
}
