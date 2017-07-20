using HolidayManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HolidayManagement.Repository;
using System.Web.Mvc;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using HolidayManagement.Repository.Models;
using Microsoft.AspNet.Identity.Owin;

namespace HolidayManagement.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        HolidayManagementContext newHolidayManagementContext = new HolidayManagementContext();
        public UserDetailsRepository UserDetailRepository = new UserDetailsRepository();
        public TeamRepository TeamRepository = new TeamRepository();
        public BankHolidayRepository BankHolidayRepository = new BankHolidayRepository();
        public VacationRepository VacationRepository = new VacationRepository();
        
        // GET: Dashboard
        public ActionResult Index()
        {
            var users = UserDetailRepository.GetUsers();
            var teams = TeamRepository.GetTeams();
            var roleStore = new RoleStore<IdentityRole>();
            var roleManager = new RoleManager<IdentityRole>(roleStore);
            var roles = roleManager.Roles.ToList();

            DashboardViewModel dashboardViewModel = new DashboardViewModel()
            {
                UserList = users != null ? users : null,
                TeamList = teams,
                RoleList = roles,                             
            };
            MyCalendarViewModel MyCalendar = new MyCalendarViewModel();
            MyCalendar.BankHolidays = BankHolidayRepository.GetBankHolidays();

            var user = UserManager.FindById(User.Identity.GetUserId());
            var userdetails = users.FirstOrDefault(x => x.AspNetUser.Id == user.Id);
            MyCalendar.Vacations = VacationRepository.GetVacations().Where(x=>x.UserId== userdetails.ID).ToList();                      
            dashboardViewModel.Calendar = MyCalendar;

            return View(dashboardViewModel);
        }

        public ActionResult UpdateUsers()
        {
            return Json(new { data =  UserDetailRepository.GetUsers() }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Users()
        {
            return View("Users");
        }

        public ActionResult addHoliday(Vacation vacation)
        {
            List<string> messages = new List<string>();
            if (vacation.StartDate > vacation.EndDate)
            {
                string message = "Start date must be smaller than end date";
                messages.Add(message);
                return Json (new { successed =  false, messages = messages });
            }
            bool isWorking = true;
            
            var user  = UserDetailRepository.GetUserDetailsById(User.Identity.GetUserId());

            var newVacation = new Vacation()
            {
                UserId = user.ID,
                Date = DateTime.Now,
                StateId = 1,
                StartDate = vacation.StartDate,
                EndDate = vacation.EndDate,
            };
            newHolidayManagementContext.Vacations.Add(newVacation);

            int vacationDays = GetNumberOfWorkingDays(vacation.StartDate, vacation.EndDate);
            user.MaxDays = user.MaxDays - vacationDays;
            if (user.MaxDays < 0)
            { 
                string message = "Your out of luck";
                messages.Add(message);
                return Json(new { successed = false, messages = messages });
            }
            newHolidayManagementContext.UserDetails.Single(x => x.ID == user.ID).MaxDays = user.MaxDays;
            newHolidayManagementContext.SaveChanges();

            return Json(new { successed = isWorking, messages = messages, newVacation = vacation }, JsonRequestBehavior.DenyGet);
        }
        private static int GetNumberOfWorkingDays(DateTime start, DateTime stop)
        {
            TimeSpan interval = stop - start;

            int totalWeek = interval.Days / 7;
            int totalWorkingDays = 5 * totalWeek;

            int remainingDays = interval.Days % 7;
            
            for (int i = 0; i <= remainingDays; i++)
            {
                DayOfWeek test = (DayOfWeek)(((int)start.DayOfWeek + i) % 7);
                if (test >= DayOfWeek.Monday && test <= DayOfWeek.Friday)
                    totalWorkingDays++;
            }

            return totalWorkingDays;
        }
    }
}