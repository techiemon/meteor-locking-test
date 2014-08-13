angular.module("app").controller "RecipesCtrl", ["$scope", "$collection", ($scope, $collection) ->
  $collection(Recipes).bind $scope, "recipes"
]
