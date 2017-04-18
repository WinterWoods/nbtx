using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace Entitys
{
    public class UpFileInfo:Basic
    {
        [SZColumn(MaxLength = 200)]
        public string Name { get; set; }
        [SZColumn(MaxLength = 10)]
        public string Ext { get; set; }
        
        public decimal FileSize { get; set; }
        [SZColumn(MaxLength = 32)]
        public string MD5 { get; set; }
        [SZColumn(MaxLength = 200)]
        public string PathName { get; set; }
        /// <summary>
        /// 在那台服务器上存储着,按照config中的key来查找
        /// </summary>
        [SZColumn(MaxLength = 200)]
        public string ServiceKey { get; set; }
        /// <summary>
        /// 1为图片,2为文件
        /// </summary>
        [SZColumn(MaxLength = 1)]
        public string Type { get; set; }
        public int SmallWidth { get; set; }
        public int SmallHeight { get; set; }
        public int BigWidth { get; set; }
        public int BigHeight { get; set; }
    }
}
