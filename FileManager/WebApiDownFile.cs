using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace FileManager
{
    public class FileDownInfo
    {
        public long From;
        public long To;
        public bool IsPartial;
        public long Length;
    }
    public interface IFileProvider
    {
        bool Exists(string name);
        FileStream Open(string name);
        long GetLength(string name);
    }
    public class FileProvider : IFileProvider
    {
        private readonly string _filesDirectory;
        private const string AppSettingsKey = "UpPath";
        private FileInfo fileInfo;
        public FileProvider()
        {
            var fileLocation = ConfigurationManager.AppSettings[AppSettingsKey];
            if (!String.IsNullOrWhiteSpace(fileLocation))
            {
                _filesDirectory = fileLocation;
            }
        }

        /// <summary>
        /// 判断文件是否存在
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public bool Exists(string name)
        {
            string file = Directory.GetFiles(_filesDirectory, name, SearchOption.TopDirectoryOnly)
                    .FirstOrDefault();
            return true;
        }


        /// <summary>
        /// 打开文件
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public FileStream Open(string name)
        {
            fileInfo = new FileInfo(_filesDirectory + name);
            return File.Open(fileInfo.FullName,
                FileMode.Open, FileAccess.Read, FileShare.Read);
        }

        /// <summary>
        /// 获取文件长度
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public long GetLength(string name)
        {
            return fileInfo.Length;
        }
    }
    public static class GetFile
    {
        public static FileDownInfo GetFileInfoFromRequest(this HttpRequestMessage request, long entityLength)
        {
            var fileInfo = new FileDownInfo
            {
                From = 0,
                To = entityLength - 1,
                IsPartial = false,
                Length = entityLength
            };
            var rangeHeader = request.Headers.Range;
            if (rangeHeader != null && rangeHeader.Ranges.Count != 0)
            {
                if (rangeHeader.Ranges.Count > 1)
                {
                    throw new HttpResponseException(HttpStatusCode.RequestedRangeNotSatisfiable);
                }
                RangeItemHeaderValue range = rangeHeader.Ranges.First();
                if (range.From.HasValue && range.From < 0 || range.To.HasValue && range.To > entityLength - 1)
                {
                    throw new HttpResponseException(HttpStatusCode.RequestedRangeNotSatisfiable);
                }

                fileInfo.From = range.From ?? 0;
                fileInfo.To = range.To ?? entityLength - 1;
                fileInfo.IsPartial = true;
                fileInfo.Length = entityLength;
                if (range.From.HasValue && range.To.HasValue)
                {
                    fileInfo.Length = range.To.Value - range.From.Value + 1;
                }
                else if (range.From.HasValue)
                {
                    fileInfo.Length = entityLength - range.From.Value + 1;
                }
                else if (range.To.HasValue)
                {
                    fileInfo.Length = range.To.Value + 1;
                }
            }

            return fileInfo;
        }
    }
}
