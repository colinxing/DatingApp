using Microsoft.Extensions.Options;

namespace DatingApp.API.Helpers
{
    public class CloudinarySettings : IOptions<CloudinarySettings>
    {
        public CloudinarySettings Value => this;
        public string CloudName { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }

        // public CloudinarySettings(string a, string b, string c)
        // {
        //     CloudName = a;
        //     ApiKey = b;
        //     ApiSecret = c;
        // }
    }
}