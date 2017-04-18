using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SZORM;

namespace Entitys
{
    /// <summary>
    /// 基础类
    /// </summary>
    public class Basic
    {
        [SZColumn(MaxLength = 32,IsKey =true)]
        public string Key { get; set; }
        private DateTime? addTime = null;
        /// <summary>
        /// 创建时间
        /// </summary>
        [SZColumn(IsAddTime =true)]
        public DateTime? AddTime
        {
            get { return addTime; }
            set { addTime = value; }
        }
        private DateTime? editTime = null;
        /// <summary>
        /// 修改时间
        /// </summary>
        [SZColumn(IsEditTime =true)]
        public DateTime? EditTime
        {
            get { return editTime; }
            set { editTime = value; }
        }
    }
}
