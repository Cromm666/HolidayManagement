namespace HolidayManagement.Migrations
{
    using Repository.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.AspNet.Identity;
    using Repository;

    internal sealed class Configuration : DbMigrationsConfiguration<Repository.HolidayManagementContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(Repository.HolidayManagementContext context)
        {
            var teams = new List<Team>
            {
            new Team{Description="Web"},
            new Team{Description="WPF"},
            new Team{Description="Mobile"},
            new Team{Description="Test"},
            };
            
            teams.ForEach(t => context.Teams.Add(t));
            context.SaveChanges();

            var bankHolidays = new List<BankHoliday> {
                  new BankHoliday { Description="1 January", Day=1, Month=1},
                  new BankHoliday { Description="2 January", Day=2, Month=1},
                  new BankHoliday { Description="24 January", Day=24, Month=1},
                  new BankHoliday { Description="16 April", Day=16, Month=4},
                  new BankHoliday { Description="17 April", Day=17, Month=4},
                  new BankHoliday { Description="1 May", Day=1, Month=5},
                  new BankHoliday { Description="1 June", Day=1, Month=6},
                  new BankHoliday { Description="4 June", Day=4, Month=6},
                  new BankHoliday { Description="5 June", Day=5, Month=6},
                  new BankHoliday { Description="15 August", Day=15, Month=8},
                  new BankHoliday { Description="30 November", Day=30, Month=11},
                  new BankHoliday { Description="1 December", Day=1, Month=12},
                  new BankHoliday { Description="25 December", Day=25, Month=12},
                  new BankHoliday { Description="26 December", Day=26, Month=12}
              };
        
            bankHolidays.ForEach(bh => context.BankHolidays.Add(bh));
            context.SaveChanges();

            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new HolidayManagementContext()));
            roleManager.Create(new IdentityRole()
            {
                Name = "Admin"
            });
            roleManager.Create(new IdentityRole()
            {
                Name = "HR"
            });
            roleManager.Create(new IdentityRole()
            {
                Name = "Employee"
            });

            var vacationStates = new List<VacationState> {
                  new VacationState { Description="Planned" },
                  new VacationState { Description="Approved" },
                  new VacationState { Description="Unapproved" },
                  new VacationState { Description="Other" }
            };


            vacationStates.ForEach(vs => context.VacationStates.Add(vs));
            context.SaveChanges();
        }
    }
}
