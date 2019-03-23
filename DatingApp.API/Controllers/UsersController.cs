using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        public readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public DbContextOptions<DataContext> _options;
        public UsersController(IMapper mapper, DbContextOptions<DataContext> options)
        {
            this._options = options;
            this._mapper = mapper;
            // this._repo = repo;
            _repo = new DatingRepository(options);
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            // List<User> a = new List<User>();
            // Console.WriteLine(a.Count());
            
            // if(HttpContext.Session.GetInt32("id") != null)
            // {
            //     var i = HttpContext.Session.GetInt32("id");
            //     return Ok(i);
            // }

            DatingRepository _rrepo = new DatingRepository(this._options);

            var currentUserId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            // var userFromRepo = await _repo.GetUser(currentUserId);
            userParams.UserId = currentUserId;
            // if(string.IsNullOrEmpty(userParams.Gender))
            // {
            //     userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            // }

            var users = await _rrepo.GetUsers(userParams);
            var userToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users.res);
            // var a = userToReturn.AsQueryable().OrderBy(u => u.Gender);
            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPage);
            var page = new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPage);
            // return Ok(userToReturn);
            return Ok(new
            {
                page,
                userToReturn
            }); 
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            // int[][] p   = new int[100][100];
            // int[,] p   = new int[100,100];
            // for(int i = 0; i < 100; i++)
            // {
            //     for(int j = 0; j < 100; j++)
            //     {
            //         p[i,j] = 1;
            //     }
            // }
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Updateuser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            User userFromRep = new User();
            userFromRep.KnownAs = "as";
            
            var userFromRepo = await _repo.GetUser(id);
            
            // _mapper.Map(userForUpdateDto, userFromRepo);
            
            // if(await _repo.SaveAll())
            //     return Ok();

            // throw new Exception($"Updating user {id} failed on save");

            // userFromRepo = _mapper.Map<User>(userForUpdateDto);

            userFromRepo.Introduction = userForUpdateDto.Introduction;
            userFromRepo.Interests = userForUpdateDto.Interests;
            userFromRepo.LookingFor = userForUpdateDto.LookingFor;
            userFromRepo.Country = userForUpdateDto.Country;
            userFromRepo.City = userForUpdateDto.City;

            var userToReturn = _mapper.Map<UserForDetailedDto>(userFromRepo);

            await _repo.SaveAll();
            return Ok(userToReturn);
                // return CreatedAtRoute("GetUser", new {id = userFromRepo.Id}, userFromRepo);

            // throw new Exception($"Updating user {id} failed on save");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            // return Ok(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var like = await _repo.GetLike(id, recipientId);

            if(like != null)
                return BadRequest("You already like this user");
            if(await _repo.GetUser(recipientId) == null)
                return NotFound();

            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like>(like);

            if(await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to like user");
        }
        
    }
}