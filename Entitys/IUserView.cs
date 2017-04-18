using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entitys
{
    /// <summary>
    /// 用户信息
    /// </summary>
    [SZORM.SZTable(IsView = false)]
    public class IUserView
    {
        [SZORM.SZColumn(MaxLength =100)]
        public string No { get; set; }
        [SZORM.SZColumn(MaxLength = 100)]
        public string Name { get; set; }
        [SZORM.SZColumn(MaxLength = 100)]
        public string Tel { get; set; }
        [SZORM.SZColumn(MaxLength = 100)]
        public string IDCard { get; set; }
        [SZORM.SZColumn(MaxLength = 100)]
        public string OrgCode { get; set; }
        /// <summary>
        /// 职位
        /// </summary>
        [SZORM.SZColumn(MaxLength = 100)]
        public string JobTitle { get; set; }

        /// <summary>
        /// 邮箱
        /// </summary>
        [SZORM.SZColumn(MaxLength = 100)]
        public string Email { get; set; }

    }
}
