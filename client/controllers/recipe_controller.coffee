angular.module("app").controller "RecipeShowCtrl", ["$scope", "$collection", "$routeParams", ($scope, $collection, $routeParams) ->
  $collection(Recipes).bind $scope, "recipes"

  $collection(Recipes).bindOne $scope, "recipe", $routeParams.recipeId

  $scope.$watch "recipe", (recipe)->
    $collection(Categories).bindOne $scope, "category", recipe.categoryId if recipe
]
