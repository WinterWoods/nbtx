using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SZORM;

namespace Entitys
{
    public partial class DB
    {
        protected override void UpdataDBExce()
        {
            if (DBVersion == 0)
            {
                //UPDBVersion(DBUP.UPVersion1(this));
            }
            if (DBVersion == 1)
            {
                //UPDBVersion(DBUP.UPVersion2(this));
            }

            //if (DBVersion == 2)
            //{
            //    SZORM_Upgrade up = new SZORM_Upgrade();
            //    up.UPTime = DateTime.Now;
            //    decimal upversion = DBUP.UPVersion3(this);
            //    up.version = upversion;
            //    up.UPContent = "更新005 巡检状态编码";
            //    UPDBVersion(up);
            //}
        }
    }
}
