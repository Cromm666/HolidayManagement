function BankHolidayModel(data) {
    var _self = this;
    this.Id = ko.observable(0);
    this.Description = ko.observable();    
    this.Day = ko.observable();
    this.Month = ko.observable();

    if (data != null) {
        _self.Id(data.Id);
        _self.Description(data.Description);
        _self.Day(data.Day);
        _self.Month(data.Month);
    }
}