using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoadManagementModels
{
    public class RegeditFileService
    {
        /// <summary>
        ///  key,不能更改,一旦配置好key后,不能更改不.如果需要更换服务器,需要将Key迁移
        /// </summary>
        public string Key { get; set; }
        public string IP { get; set; }
        public string Port { get; set; }
        public string ConnHubId { get; set; }
        public bool IsPhotoService { get; set; }
    }
    public class UnRegeditFileService
    {
        /// <summary>
        /// key,不能更改,一旦配置好key后,不能更改不.如果需要更换服务器,需要将Key迁移
        /// </summary>
        public string Key { get; set; }     
        /// <summary>
        /// 卸载原因
        /// </summary>
        public string UnMessage { get; set; }
    }
    public class RegeditMessageService
    {
        /// <summary>
        ///  key,不能更改,一旦配置好key后,不能更改不.如果需要更换服务器,需要将Key迁移
        /// </summary>
        public string Key { get; set; }
        public string IP { get; set; }
        public string Port { get; set; }
        public string Code { get; set; }
        public string ConnHubId { get; set; }
    }
    public class UnRegeditMessageService
    {
        /// <summary>
        /// key,不能更改,一旦配置好key后,不能更改不.如果需要更换服务器,需要将Key迁移
        /// </summary>
        public string Key { get; set; }
        /// <summary>
        /// 卸载原因
        /// </summary>
        public string UnMessage { get; set; }
    }
    public class MessageServiceModel
    {
        public string IP { get; set; }
        public string Port { get; set; }
        public string ConnHubId { get; set; }
    }
    public class FileServiceModel
    {
        public string IP { get; set; }
        public string Port { get; set; }
        public string ConnHubId { get; set; }
    }
}
