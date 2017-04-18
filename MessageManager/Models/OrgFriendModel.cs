using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager.Models
{
    public class OrgUserList
    {
        /// <summary>
        /// 人姓名，部门-部门名，群组-群组名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 用户的Key，部门就是编号，群组key
        /// </summary>
        public string UserKey { get; set; }
        /// <summary>
        /// 人就是职位，部门就是人数 群组就是人数
        /// </summary>
        public string Info { get; set; }
        /// <summary>
        /// 人1，部门2 群组3
        /// </summary>
        public string Type { get; set; }

    }
    public class OrgManagerResult
    {
        public OrgManagerResult()
        {
            OrgUserList = new List<Models.OrgUserList>();
            OrgModel = new List<Models.OrgModel>();
        }
        /// <summary>
        /// 
        /// </summary>
        public List<OrgUserList> OrgUserList { get; set; }
        /// <summary>
        /// 我的顶级部门
        /// </summary>
        public OrgModel TopOrg { get; set; }
        /// <summary>
        /// 我的部门
        /// </summary>
        public OrgModel MyOrg { get; set; }
        /// <summary>
        /// 上级所有部门
        /// </summary> 
        public List<OrgModel> OrgModel { get; set; }   

    }
    public class UserModel
    {
        public string No { get; set; }    //警号
        public string Name { get; set; }   //姓名
        public string Phone { get; set; }    //手机
        public string Tel { get; set; }    //内网电话
        public string IDCard { get; set; }   //身份证号
        public string OrgCode { get; set; }  //部门编号
        public string OrgName { get; set; }  //部门名称
        public string TopOrgName { get; set; }  //顶级部门名称
        public string JobTitle { get; set; }  //职位
        public string IsFriend { get; set; } //0自身 1好友 2非好友
        public string Key { get; set; } //用户(群组)key 
        public string Email { get; set; } 
    }
    public class UserSearch
    {
        /// <summary>
        /// 用户key
        /// </summary>
        public string UserKey { get; set; }
    }

    public class OrgFriendSearch
    {   
        public string OrgCode { get; set; }  //部门编号
    }

    public class OrgModel  //部门信息
    {
        public string Name { get; set; }  //部门名称
        public string Code { get; set; }     
        public string PCode { get; set; }    
    }
    public class OrgModelSearch
    {
        public string Name { get; set; }  //部门名称
        public string Code { get; set; }
    }

    public class GroupModel
    {
        public string Name { get; set; }  //群组名称
        public string KeyList { get; set; }  //群组成员key
        public string Key { get; set; }  //群组key
    }

    public class GroupNameEditModel
    {
        public string Name { get; set; }
        public string GroupKey { get; set; }
    }
    public class GroupMainUserModel
    {
        public string NewMainUserKey { get; set; }
        public string GroupKey { get; set; }
    }
    public class GroupMainOnlyManagerModel
    {
        public bool flag { get; set; }
        public string GroupKey { get; set; }
    }
    public class GroupDeleteUserModel
    {
        public string GroupKey { get; set; }
        public string UserKey { get; set; }
    }
    public class GroupBriefModel
    {
        public string Brief { get; set; }
        public string GroupKey { get; set; }
    }
}
