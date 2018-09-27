namespace DatingApp.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public int Username { get; set; }
        public int PasswordHash { get; set; }
        public int PasswordSalt { get; set; }
        
    }
}