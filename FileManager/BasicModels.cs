namespace FileManager.Api
{
    public class BasicModels
    {
        public string Key { get; set; }
    }
    public class DownFileModel
    {
        public string FileKey { get; set; }
        public string MessageServiceKey { get; set; }
        public string QueryKey { get; set; }
    }
}