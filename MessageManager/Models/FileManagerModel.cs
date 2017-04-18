using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager.Models
{
    public class FileManagerMd5
    {
        public string Md5 { get; set; }
    }
    public class FileModel
    {
        public string MsgKey { get; set; }
        public string FileKey { get; set; }
        public string Name { get; set; }
        public DateTime? AddTime { get; set; }
        public decimal FileSize { get; set; }
        public string AddUser { get; set; }
    }
    public class PicJson
    {
        public int Width { get; set; }
        public int Height { get; set; }
        public int BigWidth { get; set; }
        public int BigHeight { get; set; }
        public string FileKey { get; set; }
    }
    public class FileJson
    {
        public string Name { get; set; }
        public decimal Size { get; set; }
        public string FileKey { get; set; }
    }
    public class FileServerQueryModel
    {
        public string MsgKey { get; set; }
    }
}
