using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager.Models
{
    public class MessageModel
    {
        public string RandomString { get; set; }
        /// <summary>
        /// 要发送的人，发送的key
        /// </summary>
        public string SendKey { get; set; }
        /// <summary>
        /// 1为人,2为群
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// 每次拉去人数的限制
        /// </summary>
        public int PageSize { get; set; }
        /// <summary>
        ///  拉去消息的最后一条记录。根据这条调戏拉去最近的消息数量
        /// </summary>
        public string LastMsgKey { get; set; }
    }
    public class MessageResultModel<TSource>
    {
        public MessageResultModel()
        {
            data = new List<TSource>();
        }
        public string RandomString { get; set; }
        public List<TSource> data { get; set; }
    }
    public class MsgModel : BasicModels
    {
        /// <summary>
        /// 发送人
        /// </summary>
        public string SendKey { get; set; }
        /// <summary>
        /// 接受人，或者接受群
        /// </summary>
        public string ReceivedKey { get; set; }
        /// <summary>
        /// 接受者的名字,或者群名字
        /// </summary>
        public string ReceivedName { get; set; }
        public DateTime? SendTime { get; set; }
        /// <summary>
        /// 是否查看 如果为空就是未读
        /// </summary>
        public DateTime? ReadTime { get; set; }
        /// <summary>
        /// 消息内容
        /// </summary>
        public string Context { get; set; }
        /// <summary>
        /// 是否发送
        /// </summary>
        public bool? IsSend { get; set; }
        /// <summary>
        /// 1 为人，2为群
        /// </summary>
        public string Type { get; set; }
        /// <summary>
        /// 发送人，如果是人，就是人名，如果是群，就是群名
        /// </summary>
        public string SendName { get; set; }
        /// <summary>
        /// 1文本，2图片，3文件，9撤销
        /// </summary>
        public string MsgType { get; set; }
        /// <summary>
        /// 文件是否上传完成
        /// </summary>
        public bool? FileUpOver { get; set; }
        /// <summary>
        /// 验证是否接收到消息
        /// </summary>
        public string NoSendKey { get; set; }
    }
    public class SendFileModel
    {
        public string ReceivedKey { get; set; }
        public string FileName { get; set; }
        /// <summary>
        /// 1 为人，2为群
        /// </summary>
        public string Type { get; set; }
    }
    public class SendFileMd5Model
    {
        public string Md5 { get; set; }
        public string FileName { get; set; }
    }
    public class SendFileOverModel
    {
        public string MsgKey { get; set; }
        public string FileKey { get; set; }
    }
    public class OftenUpModel
    {
        public string Key { get; set; }
        public string Name { get; set; }
        /// <summary>
        /// 1 为人，2为群
        /// </summary>
        public string Type { get; set; }
    }
}
