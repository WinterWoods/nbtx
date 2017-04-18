using LoadManagement.Api;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Newtonsoft.Json.Converters;
using Owin;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web.Http;
//using System.Web.Http.Cors;

namespace LoadManagement
{
    public class Startup
    {
        public static string startUpPath = System.IO.Path.GetDirectoryName(Assembly.GetEntryAssembly().Location) + "\\";
        public static Dictionary<string, byte[]> pageCache = new Dictionary<string, byte[]>();
        private object LockObject = new object();
        public void Configuration(IAppBuilder app)
        {

            HttpConfiguration config = new HttpConfiguration();
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            config.Filters.Add(new ExceptionActionFilter());
            //跨域配置
            //config.EnableCors(new EnableCorsAttribute("*", "*", "*"));
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}"
            );
            config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new IsoDateTimeConverter()
            {
                DateTimeFormat = "yyyy-MM-dd HH:mm:ss"
            });
            //config.Filters.Add(new ApiAuthorizeAttribute(new string[] { "FileManager/DownLastVersionExe", "FileManager/UpUsers" }));
            app.UseWebApi(config);
            app.Map("/signalr", map =>
            {
                // Setup the cors middleware to run before SignalR.
                // By default this will allow all origins. You can 
                // configure the set of origins and/or http verbs by
                // providing a cors options with a different policy.
                map.UseCors(CorsOptions.AllowAll);

                var hubConfiguration = new HubConfiguration
                {
                    EnableJavaScriptProxies = true,
                     EnableDetailedErrors=true
                    // You can enable JSONP by uncommenting line below.
                    // JSONP requests are insecure but some older browsers (and some
                    // versions of IE) require JSONP to work cross domain
                    // EnableJSONP = true
                };

                // Run the SignalR pipeline. We're not using MapSignalR
                // since this branch is already runs under the "/signalr"
                // path.
                map.RunSignalR(hubConfiguration);
            });
            app.Run(context =>
            {
                context.Response.StatusCode = 200;
                // New code: Throw an exception for this URI path.
                if (context.Request.Path.Value == "/jquery")
                {
                    if (!pageCache.ContainsKey(context.Request.Path.Value))
                    {
                        lock (LockObject)
                        {
                            byte[] msg = File.ReadAllBytes(startUpPath + "/Scripts/jquery-2.2.4.min.js");
                            pageCache.Add(context.Request.Path.Value, msg);
                        }

                    }

                    context.Response.ContentType = "text/javascript;charset=UTF-8";
                    context.Response.ContentLength = pageCache[context.Request.Path.Value].Length;
                    return context.Response.WriteAsync(pageCache[context.Request.Path.Value]);
                }
                else if (context.Request.Path.Value == "/jquery.signalR")
                {
                    if (!pageCache.ContainsKey(context.Request.Path.Value))
                    {
                        lock (LockObject)
                        {
                            byte[] msg = File.ReadAllBytes(startUpPath + "/Scripts/jquery.signalR-2.2.1.min.js");
                            pageCache.Add(context.Request.Path.Value, msg);
                        }
                    }

                    context.Response.ContentType = "text/javascript;charset=UTF-8";
                    context.Response.ContentLength = pageCache[context.Request.Path.Value].Length;
                    return context.Response.WriteAsync(pageCache[context.Request.Path.Value]);
                }
                else
                {
                    string path = "index.html";
                    if (context.Request.Path.Value != "/")
                        path = context.Request.Path.Value;
                    if (File.Exists(startUpPath + path))
                    {
                        FileInfo fileInfo = new FileInfo(startUpPath + path);
                        if (!pageCache.ContainsKey(path))
                        {
                            lock (LockObject)
                            {
                                byte[] msg = File.ReadAllBytes(startUpPath + path);
                                pageCache.Add(path, msg);
                            }
                        }
                        if (fileInfo.Extension == ".html")
                            context.Response.ContentType = "text/html;charset=UTF-8";
                        else if (fileInfo.Extension == ".js")
                            context.Response.ContentType = "text/javascript;charset=UTF-8";
                        else if (fileInfo.Extension == ".css")
                            context.Response.ContentType = "text/css";
                        else
                        {
                            context.Response.ContentType = "application/octet-stream";
                        }

                        context.Response.StatusCode = 200;
                        context.Response.ContentLength = pageCache[path].Length;
                        return context.Response.WriteAsync(pageCache[path]);
                    }
                }
                context.Response.ContentType = "text/html;charset=UTF-8";
                return context.Response.WriteAsync("404");
            });
        }
    }
}
