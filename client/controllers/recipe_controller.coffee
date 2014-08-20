angular.module("app").controller "RecipeShowCtrl", ["$scope", "$collection", "$routeParams", ($scope, $collection, $routeParams) ->
  $collection(Recipes).bind $scope, "recipes"

  $collection(Recipes).bindOne $scope, "recipe", $routeParams.recipeId

  $collection(Categories).bindOneAssociation $scope, "category", "recipe.categoryId"
]
