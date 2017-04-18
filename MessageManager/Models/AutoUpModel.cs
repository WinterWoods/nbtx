using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager.Models
{
    public class AutoUpModel
    {
        public string Version { get; set; }
        public string Context { get; set; }
        public string Url { get; set; }
    }
    public class AutoUpFileModel
    {
        public string fullName { get; set; }
        public string md5 { get; set; }
        public string fileSize { get; set; }
    }
    public class AutoUpInfoModel
    {
        public string url { get; set; } 
        public List<AutoUpFileModel> AutoUpFileModel { get; set; }
    }
    public class UPVersionModel
    {
        public string Version { get; set; }
        public string Msg { get; set; }
    }
}
