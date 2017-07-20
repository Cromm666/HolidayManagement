function TeamModel(data) {
    var _self = this;

    this.name = ko.observable("");
    this.ID = ko.observable(0);

    if (data != null) {
        _self.ID(data.ID);
        _self.name(data.Description);
    }
}