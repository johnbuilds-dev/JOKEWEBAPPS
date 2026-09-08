using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using JOKEWEBAPPS.Models;

namespace JOKEWEBAPPS.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<Joke> Joke { get; set; }
        public DbSet<Upvote> Upvote { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Upvote>()
                .HasOne(u => u.Joke)
                .WithMany(j => j.Upvotes)
                .HasForeignKey(u => u.JokeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Upvote>()
                .HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
