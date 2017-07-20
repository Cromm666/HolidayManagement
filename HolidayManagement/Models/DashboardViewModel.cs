using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HolidayManagement.Repository.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace HolidayManagement.Models
{
    public class DashboardViewModel
    {
        //public string Test { get; set; }
        public List<UserDetails> UserList { get; set; }
        public List<Team> TeamList { get; set; }
        public List<IdentityRole> RoleList { get; set; }
        public MyCalendarViewModel Calendar { get; set; }
        public List<VacationState> VacationStates { get; set; }
       
    }   
}