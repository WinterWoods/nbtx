using MessageManager.Filter;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Newtonsoft.Json;
using Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager
{
    public class Startup
    {
        private object LockObject = new object();
        public void Configuration(IAppBuilder app)
        {
            if (ConfigurationManager.AppSettings["redisUse"].ToString() == "true")
            {
                var ip = ConfigurationManager.AppSettings["redisIP"].ToString();
                var redisProt = ConfigurationManager.AppSettings["redisProt"].ToString();
                var redisPassword = ConfigurationManager.AppSettings["redisPassword"].ToString();

                GlobalHost.DependencyResolver.UseRedis(ip, int.Parse(redisProt), redisPassword, "SydSignalRBus");
            }
               
            var serializer = new JsonSerializer()
            {
                DateFormatString = "yyyy-MM-dd HH:mm:ss",
                DateTimeZoneHandling = DateTimeZoneHandling.Local
            };
            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => serializer);
            GlobalHost.HubPipeline.AddModule(new ErrorHandling());

            app.Map("/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);

                var hubConfiguration = new HubConfiguration
                {
                    EnableDetailedErrors = false,
                    EnableJavaScriptProxies = true,
                    EnableJSONP = true
                };
                map.RunSignalR(hubConfiguration);
            });
            app.Run(context =>
            {
                return context.Response.WriteAsync("404");
            });
        }
    }
}
