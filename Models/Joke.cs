using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace JOKEWEBAPPS.Models
{
    public class Joke
    {
        public int Id { get; set; }
        public string JokeQuestion { get; set; }
        public string JokeAnswer { get; set; }

        public string UserId { get; set; }
        public IdentityUser User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Upvote> Upvotes { get; set; }

        public Joke()
        {
            Upvotes = new List<Upvote>();
        }
    }
}
