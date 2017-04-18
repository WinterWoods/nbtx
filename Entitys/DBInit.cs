using Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Entitys
{
    public partial class DB
    {
        protected override void Initialization()
        {
            DB context = this;
            #region 默认用户
            IOrgView iOrg = new IOrgView();
            iOrg.Name = "开封公安局";
            iOrg.Code = "410000000000";
            iOrg.PCode = "";
            IOrgView iOrg1 = new Entitys.IOrgView();
            iOrg1.Name = "开封公安局开封县公安局";
            iOrg1.Code = "410221000000";
            iOrg1.PCode = "410000000000";
            IOrgView iOrg11 = new Entitys.IOrgView();
            iOrg11.Name = "开封公安局开封县公安局督查大队";
            iOrg11.Code = "410221100001";
            iOrg11.PCode = "410221000000";
            IOrgView iOrg12 = new Entitys.IOrgView();
            iOrg12.Name = "开封公安局开封县公安局交警支队";
            iOrg12.Code = "410221100002";
            iOrg12.PCode = "410221000000";
            IOrgView iOrg111 = new Entitys.IOrgView();
            iOrg111.Name = "开封公安局开封县公安局督查一队";
            iOrg111.Code = "410221110001";
            iOrg111.PCode = "410221100001";
            IOrgView iOrg112 = new Entitys.IOrgView();
            iOrg112.Name = "开封公安局开封县公安局督查二队";
            iOrg112.Code = "410221110002";
            iOrg112.PCode = "410221100001";
            IOrgView iOrg113 = new Entitys.IOrgView();
            iOrg113.Name = "开封公安局开封县公安局督查三队";
            iOrg113.Code = "410221110003";
            iOrg113.PCode = "410221100001";
            IOrgView iOrg2 = new Entitys.IOrgView();
            iOrg2.Name = "开封公安局相国寺派出所";
            iOrg2.Code = "410201000000";
            iOrg2.PCode = "410000000000";
            context.IOrgView.Add(iOrg);
            context.IOrgView.Add(iOrg1); 
            context.IOrgView.Add(iOrg11);
            context.IOrgView.Add(iOrg12);
            context.IOrgView.Add(iOrg111);
            context.IOrgView.Add(iOrg112);
            context.IOrgView.Add(iOrg113);
            context.IOrgView.Add(iOrg2);

            IUserView iUser = new IUserView();
            iUser.IDCard = "123456";
            iUser.Name = "时予东";
            iUser.No = "001001";
            iUser.Tel = "123455";
            iUser.OrgCode = "410201000000";

            IUserView iUser1 = new IUserView();
            iUser1.IDCard = "654321";
            iUser1.Name = "赵天星";
            iUser1.No = "001002";
            iUser1.Tel = "123455";
            iUser1.OrgCode = "410221110001";

            IUserView iUser2 = new IUserView();
            iUser2.IDCard = "456789";
            iUser2.Name = "徐永超";
            iUser2.No = "001003";
            iUser2.Tel = "123455";
            iUser2.OrgCode = "410221100001";

            IUserView iUser3 = new IUserView();
            iUser3.IDCard = "234567";
            iUser3.Name = "金龙";
            iUser3.No = "001004";
            iUser3.Tel = "123456";
            iUser3.OrgCode = "410221110001";

            IUserView iUser4 = new IUserView();
            iUser4.IDCard = "134567";
            iUser4.Name = "孙晓腾";
            iUser4.No = "001005";
            iUser4.Tel = "123456";
            iUser4.OrgCode = "410221100002";

            iUser =context.IUserView.Add(iUser);
            iUser1=context.IUserView.Add(iUser1);
            iUser2=context.IUserView.Add(iUser2);
            iUser3 = context.IUserView.Add(iUser3); 
            iUser4 = context.IUserView.Add(iUser4);
            //SYSUser user = new SYSUser { Phone = "18937885169", Password = MD51.StrMD5("!@#" + "123456"), Key = "-1", Name = "超级管理员", Remark="默认用户，无法删除。" };
            //context.SYSUsers.Add(user);
            #endregion
            context.Save();
        }
    }
}
