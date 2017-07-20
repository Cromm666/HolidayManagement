function MonthModel(data) {
    var _self = this;
    this.Month = ko.observable();

    if (data != null) {
        _self.Month(data.Month);
    }
}