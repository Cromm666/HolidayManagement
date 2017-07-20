function VacationStateModel(data) {
    var _self = this;

    this.Description = ko.observable("");
    this.Id = ko.observable(0);

    if (data != null) {
        _self.Id(data.Id);
        _self.Description(data.Description);
    }
}