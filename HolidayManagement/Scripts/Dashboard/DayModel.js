function DayModel(data) {
    var _self = this;
    this.Day = ko.observable();
    this.IsFreeDay = ko.observable(0);
    this.IsBankHoliday = ko.observable(false);
    this.IsVacation = ko.observable(false);
    this.Name = ko.observable();
    this.Description = ko.observable();
    if (data != null) {
        _self.Day(data.Day);
        _self.IsFreeDay(data.IsFreeDay);
        _self.IsBankHoliday(data.IsBankHoliday);
        _self.IsVacation(data.IsVacation);
        _self.Name(data.Name);
        _self.Description(data.Description);
    }
}