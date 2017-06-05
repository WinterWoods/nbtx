using Entitys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager
{
    /// <summary>
    /// 每个服务只缓存自己的单位.
    /// </summary>
    public static class Comm
    {
        private static List<IUserView> allUser = new List<IUserView>();
        private static List<IOrgView> allUnit = new List<IOrgView>();
        private static List<UserInfo> allUserInfo = new List<UserInfo>();
        private static object LockObject=new object();

        public static List<IUserView> AllUser
        {
            get
            {
                return allUser;
            }
        }

        public static List<IOrgView> AllUnit
        {
            get
            {
                return allUnit;
            }
        }

        public static List<UserInfo> AllUserInfo
        {
            get
            {
                return allUserInfo;
            }

        }

        static Comm()
        {
            ReLoad();
            Task.Run(() => {
                while (true)
                {
                    Thread.Sleep(1000 * 60 * 60);
                    ReLoad();
                }
            });
        }
        public static void ReLoad()
        {
            using (DB db = new DB())
            {
                //初始化变量
                lock (LockObject)
                {
                    allUser = db.IUserView.AsQuery().ToList();
                    allUnit = db.IOrgView.AsQuery().ToList();
                    allUserInfo = db.UserInfo.AsQuery().ToList();
                }
                
            }
        }
       
    }
}
