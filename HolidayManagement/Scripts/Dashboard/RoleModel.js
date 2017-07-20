function RoleModel(data) {
    var _self = this;
    this.Name = ko.observable();
    this.Id = ko.observable(null);

    if (data != null) {
        if (data.Id != null)
            _self.Id(data.Id);
        else
            _self.Id(data.RoleId);

        if (data.Name == null || data.Name == "") {
            var role = _.find(DashboardModel.instance.roles(), function (role) {
                return role.Id() == _self.Id();
            });

            if (role != null)
                _self.Name(role.Name());
        } else
            _self.Name(data.Name);
    }
}