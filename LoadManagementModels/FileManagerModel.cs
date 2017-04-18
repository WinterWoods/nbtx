using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoadManagementModels
{
    public class FileManagerUPModel
    {
        public string FileName { get; set; }
        public string FileExt { get; set; }
        public string FileMD5 { get; set; }
        public string PathName { get; set; }
        public long FileSize { get; set; }
        public string ServiceKey { get; set; }
        /// <summary>
        /// 1为图片,2为文件
        /// </summary>
        public string Type { get; set; }
        public int SmallWidth { get; set; }
        public int SmallHeight { get; set; }
        public int BigWidth { get; set; }
        public int BigHeight { get; set; }
        public string MsgKey { get; set; }
    }
    
}
