function VacationModel(data) {
    var _self = this;
    this.Id = ko.observable(0);
    this.StateId = ko.observable();
    this.UserId = ko.observable();
    this.StartDate = ko.observable();
    this.EndDate = ko.observable();
    this.Day = ko.observable();
    this.Month = ko.observable();
    this.Date = ko.observable();
    this.StateDescription = ko.observableArray();

    if (data != null) {
        _self.Id(data.Id);
        _self.StateId(data.StateId);
        _self.UserId(data.UserId);
        _self.StartDate(data.StartDate);
        _self.EndDate(data.EndDate);
        _self.Day(data.Day);
        _self.Month(data.Month);
        _self.Date(data.Date);
        _self.StateDescription(data.StateDescription);
    }
}