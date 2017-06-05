
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
        public static PagedResultModel<TSource> ToPaged<TSource>(this IQuery<TSource> source, PagedModel page) where TSource : class, new()
        {
            int count = source.Count();

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
                    source = source.Order<TSource>(page.sortField, "asc");
                }
                else
                {
                    source = source.Order<TSource>(page.sortField, "desc");
                }
            }


            
            result.data = source.ToList();
            result.totalCount = count;
            return result;
        }
        /// <summary>
        /// 用于递归,根据递归条件进行上级递归,下级递归,
        /// </summary>
        /// <typeparam name="TResult"></typeparam>
        /// <param name="list">需要递归的数据</param>
        /// <param name="top">需要从那个节点进行递归</param>
        /// <param name="fun">参数1:为当前判断的节点值top,如果top中,参数2:为当前循环的值list</param>
        /// <returns></returns>
        public static List<TResult> GetSubset<TResult>(this List<TResult> list, TResult top, Func<TResult, TResult, bool> fun)
        {
            List<TResult> retsult = new List<TResult>();

            foreach (var tr in list)
            {
                if (fun(top, tr))
                {
                    retsult.Add(tr);
                    retsult.AddRange(GetSubset(list, tr, fun));
                }
            }
            return retsult;
        }
    }

}
