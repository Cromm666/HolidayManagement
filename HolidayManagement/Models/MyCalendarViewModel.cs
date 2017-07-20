using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HolidayManagement.Repository.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace HolidayManagement.Models
{
    public class MyCalendarViewModel
    {
        public List<BankHoliday> BankHolidays = new List<BankHoliday>();
        public List<Vacation> Vacations = new List<Vacation>();
    }
}