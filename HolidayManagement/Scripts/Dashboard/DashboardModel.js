function DashboardModel() {
    var _self = this;

    this.manageUser = new UserModel();
    this.manageVacation = new VacationModel();
    var date = new Date();

    this.monthList = new Array(12);
    this.monthList[0] = "January";
    this.monthList[1] = "February";
    this.monthList[2] = "March";
    this.monthList[3] = "April";
    this.monthList[4] = "May";
    this.monthList[5] = "June";
    this.monthList[6] = "July";
    this.monthList[7] = "August";
    this.monthList[8] = "September";
    this.monthList[9] = "October";
    this.monthList[10] = "November";
    this.monthList[11] = "December";

    this.users = ko.observableArray();
    this.teams = ko.observableArray();
    this.roles = ko.observableArray();
    this.vacatationStates = ko.observableArray();

    this.bankHolidays = ko.observableArray();
    this.vacations = ko.observableArray();

    this.days = ko.observableArray();

    this.selectedUser = ko.observable();
    this.errorMessage = ko.observableArray();

    this.editMode = ko.observable(false);

    this.curentDay = ko.observable();
    this.currentMonth = ko.observable();
    this.previousMonth = ko.observable();
    this.nextMonth = ko.observable();
    this.currentYear = ko.observable();

    this.month = ko.observable();
    this.year = ko.observable();

    this.initialize = function (data) {
        var roles = _.map(data.RoleList, function (role) {
            return new RoleModel(role);
        });
        _self.roles(roles);

        var vacatationStates = _.map(data.VacationStates, function (state) {
            return new VacationStateModel(state);
        });
        _self.vacatationStates(vacatationStates);

        var users = _.map(data.UserList, function (user) {
            user.HireDate = dateTimeReviver(user.HireDate);
            return new UserModel(user);
        });
        var teams = _.map(data.TeamList, function (team) {
            return new TeamModel(team);
        });

        var bankHolidays = _.map(data.Calendar.BankHolidays, function (bankHoliday) {
            return new BankHolidayModel(bankHoliday);
        });

        var vacations = _.map(data.Calendar.Vacations, function (vacation) {
            vacation.StartDate = dateTimeReviver(vacation.StartDate);
            vacation.EndDate = dateTimeReviver(vacation.EndDate);
            var vacationM = new VacationModel(vacation);
           
            vacationM.StateDescription(vacation.State.Description);
            return vacationM;
        });



        _self.users(users);
        _self.teams(teams);
        _self.bankHolidays(bankHolidays);
        _self.vacations(vacations);

        getMonthDays(date.getMonth(), date.getFullYear());
        _self.setMonths(date.getMonth(), date.getFullYear());
    };

    this.setMonths = function (month, year) {
        var prevDate = new Date(year, month - 1, 1);
        var nextDate = new Date(year, month + 1, 1);

        _self.currentYear(year);
        _self.currentMonth(month);
        _self.previousMonth(_self.monthList[prevDate.getMonth()]);
        _self.nextMonth(_self.monthList[nextDate.getMonth()]);
    }

    this.showPreViousMonth = function () {
        var prevDate = new Date(_self.currentYear(), _self.currentMonth() - 1, 1);

        _self.setMonths(prevDate.getMonth(), prevDate.getFullYear());

        getMonthDays(prevDate.getMonth(), prevDate.getFullYear());
    };

    this.showNextMonth = function () {
        var nextDate = new Date(_self.currentYear(), _self.currentMonth() + 1, 1);
        _self.setMonths(nextDate.getMonth(), nextDate.getFullYear());

        getMonthDays(nextDate.getMonth(), nextDate.getFullYear());
    };

    this.createUser = function (data) {
        $.ajax({
            url: "/Account/CreateUser",
            type: "POST",
            data: {
                firstName: _self.manageUser.firstName(),
                lastName: _self.manageUser.lastName(),
                AspNetUser: {
                    email: _self.manageUser.email(),
                    emailConfirmed: true,
                    Roles: [{ RoleId: _self.manageUser.role().Id() }]
                },
                hireDate: _self.manageUser.hireDate(),
                maxDays: _self.manageUser.maxDays(),
                teamId: _self.manageUser.team().ID()
            },
            success: function (data) {
                if (!data.successed) {
                    var test = _.map(data.messages, function (errorMessage) {
                        return errorMessage;
                    });
                    _self.errorMessage(test);
                }
                else {
                    _self.manageUser.id(data.newUser.ID);

                    var teamName = _.find(_self.teams(), function (team) {
                        return team.ID() == data.newUser.TeamId;
                    });
                    _self.users.push(new UserModel({
                        FirstName: _self.manageUser.firstName(),
                        LastName: _self.manageUser.lastName(),
                        AspNetUser: {
                            Email: _self.manageUser.email(),
                            Roles: [{ RoleId: _self.manageUser.role().Id() }]
                        },
                        HireDate: _self.manageUser.hireDate(),
                        MaxDays: _self.manageUser.maxDays(),
                        TeamId: data.newUser.TeamId,
                        Team: {
                            ID: data.newUser.TeamId,
                            Description: teamName.name()
                        }
                    }));
                    $('#myModal').modal('hide');
                }
            }
        });
    }

    this.editUser = function (data) {
        $.ajax({
            url: "/Account/EditUser",
            type: "Post",
            data: {
                ID: _self.manageUser.id(),
                firstName: _self.manageUser.firstName(),
                lastName: _self.manageUser.lastName(),
                AspNetUser: {
                    email: _self.manageUser.email(),
                    Roles: [{ RoleId: _self.manageUser.role().Id() }]
                },
                hireDate: _self.manageUser.hireDate(),
                maxDays: _self.manageUser.maxDays(),
                teamId: _self.manageUser.team().ID()
            },
            success: function (data) {
                if (!data.successed) {
                    var test = _.map(data.messages, function (errorMessage) {
                        return errorMessage;
                    });
                    _self.errorMessage(test);
                }
                else {

                    var user = _.find(_self.users(), function (u) {
                        return u.id() == _self.manageUser.id();
                    });
                    var team = _.find(_self.teams(), function (t) {
                        return t.ID() == _self.manageUser.team().ID();
                    });
                    var role = _.find(_self.roles(), function (r) {
                        return r.Id() == _self.manageUser.role().Id();
                    })
                    user.firstName(_self.manageUser.firstName());
                    user.lastName(_self.manageUser.lastName());
                    user.email(_self.manageUser.email());
                    user.hireDate(_self.manageUser.hireDate());
                    user.maxDays(_self.manageUser.maxDays());

                    user.team().ID(_self.manageUser.team().ID());
                    user.team().name(team.name());

                    user.role().Id(_self.manageUser.role().Id());
                    user.role().Name(role.Name());

                    $('#myModal').modal('hide');
                    _self.editMode(false);
                }
            }
        });


    }

    this.editUserTest = function (data) {
        _self.editMode(true);
        _self.manageUser.id(data.id());
        _self.manageUser.firstName(data.firstName());
        _self.manageUser.lastName(data.lastName());
        _self.manageUser.hireDate(data.hireDate());
        _self.manageUser.maxDays(data.maxDays());
        _self.manageUser.email(data.email());
        _self.manageUser.team().ID(data.team().ID());
        _self.manageUser.role().Id(data.role().Id());
    }

    this.ressetManageUser = function (data) {
        _self.manageUser.id(0);
        _self.manageUser.firstName(null);
        _self.manageUser.lastName(null);
        _self.manageUser.hireDate(null);
        _self.manageUser.maxDays(null);
        _self.manageUser.email(null);
        _self.manageUser.teamId(null);
        _self.manageUser.roleId(null);
        _self.manageUser.role(new RoleModel());
        _self.manageUser.team(new TeamModel());

    }

    this.addHoliday = function (data) {
        $.ajax({
            url: "/Dashboard/addHoliday",
            type: "POST",
            data: {
                StartDate: dateTimeReviver(_self.manageVacation.StartDate()),
                EndDate: dateTimeReviver(_self.manageVacation.EndDate()),
            },
            success: function (data) {
                if (!data.successed) {
                    var test = _.map(data.messages, function (errorMessage) {
                        return errorMessage;
                    });
                    _self.errorMessage(test);
                }
                else {
                    _self.vacations.push(new VacationModel({
                        StartDate: _self.manageVacation.StartDate(),
                        EndDate: _self.manageVacation.EndDate(),
                    }));
                    $.ajax({
                        url: "/Dashboard/UpdateUsers",
                        type: "GET",
                        dataType: 'json',
                        success: function (data) {
                            var users = _.map(data.data, function (user) {
                                user.HireDate = dateTimeReviver(user.HireDate);
                                return new UserModel(user);
                            });

                            _self.users(users);

                            $('#myModal1').modal('hide');
                        }
                    });


                }
            }
        });
    }

    function daysInMonth(iMonth, iYear) {
        return 32 - new Date(iYear, iMonth, 32).getDate();
    }

    function monthInYear(iYear) {
        return new Date(iYear).getMonth();
    }

    this.isWeekday = function (year, month, day) {
        var day = new Date(year, month, day).getDay();
        return day != 0 && day != 6;
    }

    var getMonthDays = function (month, year) {
        var days = daysInMonth(month, year);
        var weekDays = new Array(7);
        weekDays[0] = "Monday";
        weekDays[1] = "Tuesday";
        weekDays[2] = "Wednesday";
        weekDays[3] = "Thursday";
        weekDays[4] = "Friday";
        weekDays[5] = "Saturday";
        weekDays[6] = "Sunday";

        _self.days.removeAll();

        var weekdays = 0;
        for (var i = 0; i < days; i++) {
            var day = new Date(year, month, i);
            var a = _.find(_self.bankHolidays(), function (b) {
                return b.Day() == i + 1 && b.Month() == month + 1;
            });
            var b = isVacationDay(_self.vacations(), month + 1, i + 1, year)

            if (_self.isWeekday(year, month, i + 1)) {
                _self.days.push(new DayModel({ Day: i + 1, IsFreeDay: false, Name: weekDays[day.getDay()], IsVacation: b != null ? true : false, IsBankHoliday: a != undefined ? true : false, Description: a != undefined ? a.Description() : "" }));
            }
            else {
                _self.days.push(new DayModel({ Day: i + 1, IsFreeDay: true, Name: weekDays[day.getDay()], IsVacation: b != null ? true : false, IsBankHoliday: a != undefined ? true : false, Description: a != undefined ? a.Description() : "" }));
            }
            weekdays++;
        }
    }
    var setDateWithZero = function (date) {
        if (date < 10)
            date = "0" + date;

        return date;
    };
    var dateTimeReviver = function (value) {
        var match;

        if (typeof value === 'string') {
            match = /\/Date\((\d*)\)\//.exec(value);
            if (match) {
                var date = new Date(+match[1]);
                return date.getFullYear() + "-" + setDateWithZero(date.getMonth() + 1) + "-" + setDateWithZero(date.getDate());// +
                //"T" + setDateWithZero(date.getHours()) + ":" + setDateWithZero(date.getMinutes()) + ":" + setDateWithZero(date.getSeconds()) + "." + date.getMilliseconds();
            }
        }
        return value;
    };
}

function isVacationDay(vacations, month, i, year) {
    return _.find(vacations, function (vacation) {
        var startDate = vacation.StartDate();
        var endDate = vacation.EndDate();

        var startDay = parseInt(startDate.split('-')[2]);
        var startMonth = parseInt(startDate.split('-')[1]);
        var endDay = parseInt(endDate.split('-')[2]);
        var endMonth = parseInt(endDate.split('-')[1]);

        if (startMonth == month || (startMonth < month && endMonth <= month && startMonth != endMonth)) {
            if ((startDay == i || endDay == i || (i > startDay && i < endDay)) && DashboardModel.instance.isWeekday(year, month - 1, i))
                return true;
            else
                return null;
        }
        else if (startMonth < month && endMonth >= month) {
            if ((startDay == i || endDay == i || (i > startDay && i < endDay)) && DashboardModel.instance.isWeekday(year, month - 1, i))
                return true;
            else
                return null;
        }
    });
}

function InitializeDashboardModel(data) {
    DashboardModel.instance = new DashboardModel();
    DashboardModel.instance.initialize(data);
    ko.applyBindings(DashboardModel.instance);
}
