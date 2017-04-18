using Entitys;
using MessageManager.Filter;
using MessageManager.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager.SignalR
{
    [LoginAuthorize]
    public class OrgManager : Hub
    {

        public Task<OrgManagerResult> MyOrgList(OrgFriendSearch model)
        {
            return Task.Factory.StartNew(() =>
            {
                OrgManagerResult result = new OrgManagerResult();
                UserInfo myUser = Context.User();
                using (DB db = new DB())
                {

                    //如果不传递单位编码,则认为是当前用户的单位
                    var queryOrgCode = "";
                    if (string.IsNullOrEmpty(model.OrgCode))
                    {

                        var myUserInfo = Comm.AllUser.Find(w => w.IDCard == myUser.IDCard);
                        queryOrgCode = myUserInfo.OrgCode;
                    }
                    else
                    {
                        queryOrgCode = model.OrgCode;
                    }
                    var myOrgInfo = Comm.AllUnit.Find(w => w.Code == queryOrgCode);
                    result.MyOrg = new OrgModel();
                    result.MyOrg.Code = myOrgInfo.Code;
                    result.MyOrg.Name = myOrgInfo.Name;
                    result.MyOrg.PCode = myOrgInfo.PCode;
                    List<IOrgView> list = Comm.AllUnit.GetSubset(myOrgInfo, (topValue, listValue) => topValue.PCode == listValue.Code);
                    result.OrgModel = new List<OrgModel>();
                    result.OrgModel.Insert(0, result.MyOrg);
                    foreach (var _org in list)
                    {
                        OrgModel m = new OrgModel();
                        m.Code = _org.Code;
                        m.Name = _org.Name;
                        m.PCode = _org.PCode;
                        result.OrgModel.Insert(0, m);
                    }
                    if (list.Count == 0)
                        result.TopOrg = result.MyOrg;
                    else
                        result.TopOrg = result.OrgModel[0];

                    result.OrgUserList = new List<OrgUserList>();
                    //统计我所在的单位一共有多少下级单位
                    var orgList = Comm.AllUnit.Where(w => w.PCode == result.MyOrg.Code).ToList();
                    foreach (var _org in orgList)
                    {
                        OrgUserList info = new OrgUserList();
                        info.Name = _org.Name;
                        info.UserKey = _org.Code;
                        info.Type = "2"; //部门就是2

                        //第一步查询
                        var aaa = Comm.AllUnit.GetSubset(_org, (topValue, listValue) => topValue.Code == listValue.PCode);
                        aaa.Add(_org);
                        var allOrg = aaa.Select(s => s.Code).ToList();

                        info.Info = Comm.AllUser.Count(w => allOrg.Contains(w.OrgCode)) + "人";
                        result.OrgUserList.Add(info);
                    }

                    var orgUserList = Comm.AllUser.Where(w => w.OrgCode == result.MyOrg.Code).ToList();
                    foreach (var _org in orgUserList)
                    {
                        var user = Comm.AllUserInfo.Where(w => w.IDCard == _org.IDCard).ToList();
                        if (user.Count == 0) continue;
                        OrgUserList info = new OrgUserList();
                        info.Name = _org.Name;
                        info.UserKey = user[0].Key;
                        info.Type = "1"; //部门就是2
                        info.Info = user[0].Phone;
                        result.OrgUserList.Add(info);
                    }
                    return result;
                }
            });
        }

        public Task<List<SearchResultModel>> Search(SearchQueryModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                List<SearchResultModel> result = new List<SearchResultModel>();
                if (string.IsNullOrEmpty(model.value))
                {
                    return result;
                }
                var myUser = Context.User();
                using (DB db = new DB())
                {
                    var users = db.UserInfo.Where(w => w.Search.Contains(model.value.ToUpper())).Take(6).ToList();
                    foreach (var user in users)
                    {
                        //如果是登录人就跳过去
                        if (user.Key == myUser.Key) continue;
                        var _user = Comm.AllUser.Find(w => w.IDCard == user.IDCard);
                        if (_user == null) continue;
                        var _org = Comm.AllUnit.Find(w => w.Code == _user.OrgCode);
                        if (_org == null) continue;
                        result.Add(new SearchResultModel() { Group = "用户", Key = user.Key, Type = "1", Name = user.NickName, Info = _org.Name });
                    }
                }
                return result;
            });
        }



        /// <summary>
        /// 获取好友 群组列表
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<List<OrgUserList>> FriendList()
        {
            return Task.Factory.StartNew(() =>
            {
                List<OrgUserList> uInfos = new List<OrgUserList>();
                using (DB db = new DB())
                {
                    UserInfo myUser = this.Context.User();
                    var friendInfos = db.FriendsInfo.Where(w => w.UserKey == myUser.Key).ToList();
                    for (int i = 0; i < friendInfos.Count; i++)
                    {
                        OrgUserList info = new OrgUserList();
                        info.Name = friendInfos[i].Name;
                        info.UserKey = friendInfos[i].FiendKey;
                        info.Info = "";
                        info.Type = "1";
                        uInfos.Add(info);
                    }
                }
                return uInfos;
            });
        }
        public Task<List<OrgUserList>> GroupList()
        {
            return Task.Factory.StartNew(() =>
            {
                List<OrgUserList> uInfos = new List<OrgUserList>();
                using (DB db = new DB())
                {
                    UserInfo myUser = this.Context.User();
                    var friendInfos = db.GroupUser.Where(w => w.UserKey == myUser.Key && w.IsExit == false).ToList().Select(s => s.GroupKey).ToList();
                    var groupInfo = db.GroupInfo.Where(w => friendInfos.Contains(w.Key)).ToList();
                    for (int i = 0; i < groupInfo.Count; i++)
                    {
                        OrgUserList info = new OrgUserList();
                        info.Name = groupInfo[i].GroupName;
                        info.UserKey = groupInfo[i].Key;
                        info.Info = groupInfo[i].NowCount + "人";
                        info.Type = "3";
                        uInfos.Add(info);
                    }
                }
                return uInfos;
            });
        }
        /// <summary>
        /// 根据用户Key获取用户信息
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<UserModel> UserInfo(UserSearch model)
        {
            return Task.Factory.StartNew(() =>
            {
                UserModel info = new UserModel();
                using (DB db = new DB())
                {
                    UserInfo myUser = this.Context.User();
                    var _user = db.UserInfo.Where(w => w.Key == model.UserKey).ToEntity();
                    var __user = Comm.AllUser.Find(w => w.IDCard == _user.IDCard);
                    if (model.UserKey == myUser.Key)
                    {
                        info.IsFriend = "0"; //本人
                    }
                    else
                    {//判断是否是好友
                        if (db.FriendsInfo.Where(w => w.UserKey == myUser.Key && w.FiendKey == model.UserKey).Count() > 0)
                        {
                            info.IsFriend = "1";  //好友
                        }
                        else
                        {
                            info.IsFriend = "2";  //好友
                        }


                    }
                    info.Name = __user.Name;  //姓名
                    info.No = __user.No;      //警号
                    info.IDCard = _user.IDCard; //身份证号 
                    info.Phone = _user.Phone;  //手机
                    info.Tel = __user.Tel;  //内网电话
                    info.Email = __user.Email; //邮箱
                    info.JobTitle = __user.JobTitle;  //职位

                    info.OrgCode = __user.OrgCode; //部门编号
                    info.OrgName = Comm.AllUnit.Find(w => w.Code == __user.OrgCode).Name;  //我的部门名称

                }
                return info;
            });
        }

        /// <summary>
        /// 添加好友
        /// </summary>
        /// <param name="model"></param>
        public void AddFriend(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    UserInfo myUser = this.Context.User();

                    FriendsInfo info = new FriendsInfo();
                    info.UserKey = myUser.Key;
                    info.FiendKey = model.Key;
                    info.Name = db.UserInfo.Find(model.Key).NickName;
                    db.FriendsInfo.Add(info);
                    db.Save();
                }
            });
        }

        /// <summary>
        /// 解除好友 
        /// </summary>
        /// <param name="model"></param>
        public void RemoveFriend(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {

                using (DB db = new DB())

                {
                    UserInfo myUser = this.Context.User();
                    db.FriendsInfo.Remove(w => w.UserKey == myUser.Key && w.FiendKey == model.Key);
                    db.Save();
                }
            });
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model">数组 人以,分割</param>
        /// <returns></returns>
        public Task<GroupInfo> AddGroup(GroupModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {

                    string name = model.Name;
                    bool resultName = false;
                    GroupInfo info = new GroupInfo();
                    if (!string.IsNullOrEmpty(model.Key))
                    {
                        info = db.GroupInfo.Find(model.Key);
                        if (info.OnlyMainManager)
                        {
                            //如果我不是群主则不修改
                            if (info.GroupMainKey != myUser.Key)
                            {
                                return info;
                            }
                        }

                    }
                    else
                    {
                        info = db.GroupInfo.Add(info);
                        info.GroupBrief = "";
                        info.OnlyMainManager = false;
                        info.GroupMainKey = myUser.Key;
                        info.LogMsgLook = false;
                    }
                    if (string.IsNullOrEmpty(name))
                    {
                        resultName = true;
                    }
                    List<string> list = model.KeyList.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).ToList();
                    var userList = db.UserInfo.Where(w => list.Contains(w.Key)).ToList();
                    for (int i = 0; i < userList.Count; i++)
                    {
                        if (!string.IsNullOrEmpty(userList[i].Key))
                        {
                            //如果被干掉过，去更新一下他的最近消息列表
                            db.OftenList.Edit(w => w.FriendKey == info.Key && w.UserKey == userList[i].Key, () => new OftenList { IsRemove = "0" });
                            //找到所有的群用户，进行更新
                            var addUser = db.GroupUser.Where(w => w.UserKey == userList[i].Key && w.GroupKey == info.Key).ToEntity();
                            if (addUser != null)
                            {
                                addUser.IsExit = false;
                                db.GroupUser.Edit(addUser);
                            }
                            else
                            {
                                GroupUser user = new GroupUser();
                                user.GroupKey = info.Key;
                                user.UserKey = userList[i].Key;
                                user.UserName = userList.Find(f => f.Key == userList[i].Key).NickName;
                                if (resultName && i < 2)
                                {
                                    name = name + user.UserName + ",";
                                }
                                else if (resultName && i == 2)
                                {
                                    name = name + user.UserName + "等";
                                }
                                if (info.Key == myUser.Key)
                                    user.Type = "1";
                                else
                                    user.Type = "3";
                                user.IsExit = false;
                                db.GroupUser.Add(user);
                            }

                        }
                    }
                    info.GroupName = name;
                    info.NowCount = (int)db.GroupUser.Where(w => w.GroupKey == info.Key && w.IsExit == false).Count();
                    info = db.GroupInfo.Edit(info);
                    db.Save();
                    this.UpGroupInfo(info);
                    return info;
                }
            });
        }
        //通知所有群成员，进行刷新消息
        private void UpGroupInfo(GroupInfo info)
        {
            Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    var upGroupInfo = db.GroupUser.Where(w => w.GroupKey == info.Key && w.IsExit == false).ToList();
                    upGroupInfo.ForEach(f =>
                    {
                        var user = db.UserInfo.Find(f.UserKey);
                        if (user != null && !string.IsNullOrEmpty(user.HubId))
                        {
                            Clients.Client(user.HubId).reloadGroupInfo(info);
                        }

                    });
                }

            });
        }
        public Task<GroupInfo> GetGroupInfoForGroupKey(BasicModels model)
        {
            return Task.Factory.StartNew(() => {
                using (DB db = new DB())
                {
                    return db.GroupInfo.Find(model.Key);
                }
            });
        }
        /// <summary>
        /// 获取群组中所有的人员信息
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public Task<List<GroupUser>> GetGroupUsersFormGroupKey(BasicModels model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    return db.GroupUser.Where(w => w.GroupKey == model.Key && w.IsExit == false).ToList();
                }
            });
        }
        public Task<List<GroupUser>> GetGroupUsersHaveExitUserFormGroupKey(BasicModels model)
        {
            return Task.Factory.StartNew(() =>
            {
                using (DB db = new DB())
                {
                    return db.GroupUser.Where(w => w.GroupKey == model.Key).ToList();
                }
            });
        }
        /// <summary>
        /// 采用同步的方法，这样保证前台显示
        /// </summary>
        /// <param name="model"></param>
        public Task<GroupInfo> EditGroupNameForGroupKey(GroupNameEditModel model)
        {
            return Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {
                    //必须要验证是否是群组，防止别人篡改
                    var group = db.GroupInfo.Find(model.GroupKey);

                    if (group.OnlyMainManager)
                    {
                        //如果我不是群主则不修改
                        if (group.GroupMainKey != myUser.Key)
                        {
                            return group;
                        }
                    }
                    //必须是群成员才可以修改
                    var groupUser = db.GroupUser.Where(w => w.GroupKey == group.Key && w.UserKey == myUser.Key && w.IsExit == false).Count();
                    if (groupUser > 0)
                    {
                        //更新最近消息列表中的名字
                        db.OftenList.Edit(w => w.FriendKey == model.GroupKey, () => new OftenList { FriendName = model.Name });


                        group.GroupName = model.Name;
                        group = db.GroupInfo.Edit(group);
                        db.Save();
                        this.UpGroupInfo(group);
                        return group;
                    }
                    else
                    {
                        return group;
                    }
                }
            });
        }
        public void EditGroupOnlyManagerForKey(GroupMainOnlyManagerModel model)
        {
            Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {
                    //必须要验证是否是群组，防止别人篡改
                    var group = db.GroupInfo.Find(model.GroupKey);

                    //如果我不是群主则不修改
                    if (group.GroupMainKey != myUser.Key)
                    {
                        return group;
                    }
                    group.OnlyMainManager = model.flag;
                    group = db.GroupInfo.Edit(group);
                    db.Save();
                    this.UpGroupInfo(group);
                    return group;
                }
            });
        }
        public void EditGroupMainUserForGroupKey(GroupMainUserModel model)
        {
            Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {
                    //必须要验证是否是群组，防止别人篡改
                    var group = db.GroupInfo.Find(model.GroupKey);

                    //如果我不是群主则不修改
                    if (group.GroupMainKey != myUser.Key)
                    {
                        return group;
                    }
                    group.GroupMainKey = model.NewMainUserKey;
                    group = db.GroupInfo.Edit(group);
                    db.Save();
                    this.UpGroupInfo(group);
                    return group;
                }
            });
        }
        public void EditGroupLookLogMsg(GroupMainOnlyManagerModel model)
        {
            Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {
                    //必须要验证是否是群组，防止别人篡改
                    var group = db.GroupInfo.Find(model.GroupKey);

                    //如果我不是群主则不修改
                    if (group.GroupMainKey != myUser.Key)
                    {
                        return group;
                    }
                    group.LogMsgLook = model.flag;
                    group = db.GroupInfo.Edit(group);
                    db.Save();
                    this.UpGroupInfo(group);
                    return group;
                }
            });
        }
        public void DelteGroupUser(GroupDeleteUserModel model)
        {
            Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {
                    //必须要验证是否是群组，防止别人篡改
                    var group = db.GroupInfo.Find(model.GroupKey);

                    //如果我不是群主则不修改
                    if (group.GroupMainKey != myUser.Key)
                    {
                        return group;
                    }
                    var often = db.OftenList.Where(w => w.FriendKey == group.Key && w.UserKey == model.UserKey).ToEntity();
                    if (often != null)
                    {
                        often.IsRemove = "1";
                        db.OftenList.Edit(often);
                    }

                    //查询这个用户
                    var user = db.UserInfo.Find(model.UserKey);
                    if (user != null && !string.IsNullOrEmpty(user.HubId))
                    {
                        //告诉他已经被移除群
                        Clients.Client(user.HubId).DeleteGroupSend(group);
                    }
                    var delUser = db.GroupUser.Where(w => w.GroupKey == group.Key && w.UserKey == model.UserKey).ToEntity();
                    if (delUser != null)
                    {
                        delUser.IsExit = true;
                        db.GroupUser.Edit(delUser);
                    }
                    group.NowCount = (int)db.GroupUser.Where(w => w.GroupKey == group.Key && w.IsExit == false).Count();
                    db.GroupInfo.Edit(group);
                    db.Save();
                    this.UpGroupInfo(group);
                    return group;
                }
            });
        }
        public void ExitGroup(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {
                    //必须要验证是否是群组，防止别人篡改
                    var group = db.GroupInfo.Find(model.Key);
                    //最近消息记录中干掉
                    db.OftenList.Remove(w => w.FriendKey == group.Key && w.UserKey == myUser.Key);
                    //群成员中干掉
                    var my = db.GroupUser.Where(w => w.UserKey == myUser.Key).ToEntity();
                    my.IsExit = true;
                    db.GroupUser.Edit(my);
                    //db.GroupUser.Remove(w => w.UserKey == myUser.Key);
                    //如果我不是群主则不修改
                    if (group.GroupMainKey == myUser.Key)
                    {
                        //如果是群主退出，则需要找一个新人员当做群组
                        var oneUser = db.GroupUser.Where(w => w.GroupKey == group.Key && w.IsExit == false).Take(1).ToEntity();
                        if (oneUser != null)
                        {
                            group.GroupMainKey = oneUser.UserKey;
                            db.GroupInfo.Edit(group);
                        }
                    }
                    group.NowCount = (int)db.GroupUser.Where(w => w.GroupKey == group.Key && w.IsExit == false).Count();
                    db.GroupInfo.Edit(group);


                    db.Save();
                    this.UpGroupInfo(group);
                    return group;
                }
            });
        }
        public void DelGroup(BasicModels model)
        {
            Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {
                    //必须要验证是否是群组，防止别人篡改
                    var group = db.GroupInfo.Find(model.Key);

                    //如果我不是群主则不修改
                    if (group.GroupMainKey != myUser.Key)
                    {
                        return group;
                    }
                    //准备干掉群成员
                    var userList = db.GroupUser.Where(r => r.GroupKey == group.Key).ToList();
                    //干掉群所有的最近聊天记录
                    //
                    userList.ForEach(f => {
                        var user = db.UserInfo.Find(f.UserKey);
                        if (user != null && !string.IsNullOrEmpty(user.HubId))
                        {
                            //告诉他已经被移除群
                            Clients.Client(user.HubId).DeleteGroupSend(group);
                        }
                        db.GroupUser.Remove(f);
                    });
                    db.OftenList.Edit(w => w.FriendKey == group.Key, () => new OftenList { IsRemove = "2" });
                    db.Save();
                    return group;
                }
            });
        }
        public void UpBrief(GroupBriefModel model)
        {
            Task.Factory.StartNew(() =>
            {
                UserInfo myUser = this.Context.User();
                using (DB db = new DB())
                {
                    var group = db.GroupInfo.Find(model.GroupKey);
                    //判断这个群是否能群成员管理群,如果可以管理判断修改人是否在群人员.
                    if (group.OnlyMainManager)
                    {
                        if (group.GroupMainKey != myUser.Key)
                        {
                            return;
                        }
                    }
                    if (db.GroupUser.Where(w => w.GroupKey == group.Key && w.UserKey == myUser.Key).Count() == 0)
                        return;

                    group.GroupBrief = model.Brief;
                    group.BriefUpTime = DateTime.Now;
                    group.BriefUpKey = myUser.Key;
                    group = db.GroupInfo.Edit(group);
                    db.Save();
                    this.UpGroupInfo(group);
                }
            });
        }
    }
}
