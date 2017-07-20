using HolidayManagement.Repository.Interfaces;
using HolidayManagement.Repository.Models;
using System.Collections.Generic;
using System.Linq;

namespace HolidayManagement.Repository
{
    public class VacationRepository : BaseRepository<Vacation>, IVacationRepository
    {
        public Vacation GetVacationById(int vacationId)
        {
            return DbContext.Vacations.FirstOrDefault(x => x.ID == vacationId);
        }

        public List<Vacation> GetVacations()
        {
            var vacations = DbContext.Vacations.ToList();

            foreach (var vacation in vacations)
            {
                if (vacation.State != null)
                    vacation.State.Vacations = null;
            }

            return vacations;
        }
    }
}
