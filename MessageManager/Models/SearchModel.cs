using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageManager.Models
{
    public class SearchResultModel
    {
        public string Key { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Group { get; set; }
        public string Info { get; set; }
    }
    public class SearchQueryModel
    {
        public string value { get; set; }
    }
}
