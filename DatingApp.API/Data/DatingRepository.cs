using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        public DataContext _context;
        public int a;
        // public IAuthRepository _repo;

        // public static List<User> u = new List<User>();
        // public PagedList<User> _user = new PagedList<User>(u, 1, 1, 1);
        // public static List<Message> m = new List<Message>();
        // public PagedList<Message> _mes = new PagedList<Message>(items: m , count: 1, pageNumber: 1, pageSize: 1);
        public DatingRepository(DbContextOptions<DataContext> options)
        {
            this._context = new DataContext(options);
            // this._repo = new AuthRepository(_context);
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => 
                u.LikerId == userId && u.LikeeId == recipientId);
        }

        // public async Task<List<Card>> GetCards()
        // {
        //     return await _context.Cards.ToListAsync();
        // }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.isMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return await user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            // var users1 = (from a in _context.Likes
            //    join b in _context.Users on a.LikeeId equals b.Id
            //    join c in _context.Likes on b.Id equals c.LikerId
            //    where a.LikerId == 1
            //               let likeeId = c.LikeeId
            //               select new { a.LikeeId, likeeId });
            
            // var users2 = (from a in _context.Users
            //    join b in _context.Likes on a.Id equals b.LikeeId
            //    join c in _context.Users on b.LikerId equals c.Id
            //    where c.Id == 1
            //               let knownAs = c.KnownAs
            //               select new {a.KnownAs, knownAs});

            // var users22 = (from a in _context.Users
            //    join b in _context.Likes on a.Id equals b.LikeeId
            //    join c in _context.Users on b.LikerId equals c.Id
            //               let knownAs = c.KnownAs
            //               select new {a.KnownAs, knownAs});

            // var users3 = (from a in _context.Users
            //    join c in _context.Likes on a.Id equals c.LikeeId
            //    where a.Id == 4
            //    select c.Liker.KnownAs);
            
            // var users4 = (from a in _context.Users
            //    join c in _context.Likes on a.Id equals c.LikeeId
            //    where a.Id == 1
            //    select c.Liker.KnownAs);
            
            // var users5 = (from a in _context.Users
            //    join c in _context.Likes on a.Id equals c.LikerId
            //    where c.LikeeId == 1
            //    select a.Id);
            
            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            if(userParams.Gender == "male" || userParams.Gender == "female")
            {
                users = users.Where(u => u.Gender == userParams.Gender);
            }
            // users = users.Where(u => u.Gender == userParams.Gender);
            
            if(userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if(userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if(userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                .Include(x => x.Likers)
                .Include(x => x.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);
            
            // var likes = _context.Likes.AsQueryable();

            if(likers)
            {
                // return await likes.Where(u => u.LikeeId == id).Select(i => i.LikerId).ToListAsync();
                return user.Likers.Select(i => i.LikerId);
            }
            else
            {
                // return await likes.Where(u => u.LikerId == id).Select(i => i.LikeeId).ToListAsync();
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            // var mes = new Message();
            // var mes = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
            // return mes;
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            // var messages = new List<Message>().AsQueryable();
            var messages = _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .AsQueryable();

            switch(messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId
                        && u.RecipientDelete == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId
                        && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId 
                        && u.RecipientDelete == false && u.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(d => d.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .Where(m => m.RecipientId == userId && m.SenderId == recipientId && m.RecipientDelete == false
                    || m.RecipientId == recipientId && m.SenderId == userId && m.SenderDeleted == false)
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

            return messages;
        }
    }
}