
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SZORM;

namespace MessageManager
{
    /// <summary>
    /// 分页模型参数
    /// </summary>
    public class PagedModel
    {
        public int pageSize { get; set; }
        public int currentPage { get; set; }
        public string sortField { get; set; }
        public string sortOrder { get; set; }
    }
    public class PagedQueryModel<TSource>
    {
        public PagedModel page { get; set; }
        public TSource model { get; set; }
    }
    /// <summary>
    /// 分页返回模型
    /// </summary>
    /// <typeparam name="TSource"></typeparam>
    public class PagedResultModel<TSource> : PagedModel
    {
        public long totalCount { get; set; }
        public List<TSource> data { get; set; }
    }
    /// <summary>
    /// 分页累，用户分页
    /// </summary>
    public static class PagedHelper
    {
        /// <summary>
        /// 分页扩展方法
        /// </summary>
        /// <typeparam name="TSource">分页返回的data模型</typeparam>
        /// <param name="source">szorm查询变量</param>
        /// <param name="page">分页参数</param>
        /// <returns>分页模型，可直接用于antd</returns>
        public static PagedResultModel<TSource> ToPaged<TSource>(this ISZORM<TSource> source, PagedModel page) where TSource : class, new()
        {

            PagedResultModel<TSource> result = new PagedResultModel<TSource>();
            if (page.currentPage != -1)
            {
                //分页
                source = source.Skip((page.currentPage-1)* page.pageSize).Take(page.pageSize);
            }
            else
            {
                source = source.Skip((page.currentPage - 1) * page.pageSize);
            }
            if (!string.IsNullOrEmpty(page.sortField))
            {
                if (page.sortOrder == "ascend")
                {
                    source = source.Order(page.sortField, "asc");
                }
                else
                {
                    source = source.Order(page.sortField, "desc");
                }
            }


            long total;
            result.data = source.ToList(out total);
            result.totalCount = total;
            return result;
        }
    }
}
