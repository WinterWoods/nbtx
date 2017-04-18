using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace LoadManagement.Api
{
    public class ExceptionActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext filterContext)
        {
            DateTime d = DateTime.Now;
            if (filterContext.Exception != null)
            {
                if (filterContext.Exception.InnerException != null)
                {
                    //File.AppendAllText(d.Year.ToString() + d.Month.ToString() + d.Day.ToString() + ".txt", filterContext.Exception.InnerException.Message);
                    throw filterContext.Exception.InnerException;
                }
                else
                {
                    //File.AppendAllText(d.Year.ToString() + d.Month.ToString() + d.Day.ToString() + ".txt", filterContext.Exception.Message);
                    throw filterContext.Exception;
                }
            }
        }
    }
}
