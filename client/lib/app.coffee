angular.module "app", ["ngMeteor"]

Meteor.startup ->
  angular.bootstrap(document, ["app"])
