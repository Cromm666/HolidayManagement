function UserModel(data) {

    var _self = this;
    this.id = ko.observable(0);
    this.email = ko.observable();
    this.firstName = ko.observable();
    this.lastName = ko.observable();
    this.hireDate = ko.observable();
    this.maxDays = ko.observable();
    this.teamId = ko.observable();
    this.roleId = ko.observable();
    this.team = ko.observable(new TeamModel());
    this.role = ko.observable(new RoleModel());

    if (data != null) {
        _self.id(data.ID);
        if (data.AspNetUser != null) {
            _self.email(data.AspNetUser.Email);
            _self.role(new RoleModel(data.AspNetUser.Roles[0]));
        }
        _self.firstName(data.FirstName);
        _self.lastName(data.LastName);
        _self.hireDate(data.HireDate);
        _self.maxDays(data.MaxDays);

        _self.team(new TeamModel(data.Team));
        
    }
}