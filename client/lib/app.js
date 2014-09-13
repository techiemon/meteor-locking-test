angular.module("app", ["ngMeteor"]);

Meteor.startup(function() {
  return angular.bootstrap(document, ["app"]);
});
