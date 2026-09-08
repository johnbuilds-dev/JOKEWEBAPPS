using Microsoft.AspNetCore.Identity;
using System;

namespace JOKEWEBAPPS.Models
{
    public class Upvote
    {
        public int Id { get; set; }
        public int JokeId { get; set; }
        public Joke Joke { get; set; }

        public string UserId { get; set; }
        public IdentityUser User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
