using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entitys
{
    /// <summary>
    /// 机构信息
    /// </summary>
    [SZORM.SZTable(IsView =false)]
    public class IOrgView
    {
        [SZORM.SZColumn(MaxLength = 100)]
        public string Name { get; set; }
        [SZORM.SZColumn(MaxLength = 100)]
        public string Code { get; set; }
        [SZORM.SZColumn(MaxLength = 100)]
        public string PCode { get; set; }
    }
}
