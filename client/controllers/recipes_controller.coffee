angular.module("app").controller "RecipesCtrl", ["$scope", "$collection", ($scope, $collection) ->
  $scope.perPage = 10

  $scope.page = 1

  $scope.sort = "title"

  $scope.next = ->
    @page += 1

  $scope.prev = ->
    @page -= 1

  $collection(Recipes).paginate $scope, "recipes"

]
