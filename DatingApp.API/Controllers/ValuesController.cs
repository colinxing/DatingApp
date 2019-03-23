using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        public readonly IDatingRepository _repo;
        private readonly DataContext _context;

        public ValuesController(DataContext context, IDatingRepository repo)
        {
            _context = context;
            _repo = repo;
        }
        // GET api/values
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<List<Models.Value>> GetValues()
        {
            var values = _context.Values.ToList();
            return values;
        }

        // [AllowAnonymous]
        // [HttpGet("cards")]
        // public async Task<IActionResult> GetCards()
        // {
        //     var cards = await _repo.GetCards();
        //     return Ok(cards);
        // }

        // GET api/values/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValue(int id)
        {
            var value = await _context.Values.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(value);
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
