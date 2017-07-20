using HolidayManagement.Repository.Models;
using System.Collections.Generic;
using System.Linq;

namespace HolidayManagement.Repository
{
    public class UserDetailsRepository : BaseRepository<UserDetails>, IUserDetailsRepository
    {
        public UserDetails GetUserDetailsById(int userDetailsId)
        {
            return DbContext.UserDetails.FirstOrDefault(x => x.ID == userDetailsId);
        }

        public UserDetails GetUserDetailsById(string userId)
        {
            return DbContext.UserDetails.FirstOrDefault(x => x.UserID == userId);
        }

        public List<UserDetails> GetUsers()
        {
            var users = DbContext.UserDetails.ToList();

            foreach (var user in users)
            {
                if (user.Team != null)
                    user.Team.Users = null;
            }

            return users;
        }
    }
}
