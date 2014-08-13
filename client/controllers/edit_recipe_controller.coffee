angular.module("app").controller "EditRecipeCtrl", ["$scope", "$collection", "$location", "$routeParams", ($scope, $collection, $location, $routeParams) ->
  $collection(Recipes).bind $scope, "recipes"

  $collection(Recipes).bindOne $scope, "recipe", $routeParams.recipeId

  $scope.saveRecipe = ->
    if this.recipeForm.$valid
      this.recipes.save(this.recipe).then (recipe)->
        $location.path("/recipes/#{recipe._id}")

]
