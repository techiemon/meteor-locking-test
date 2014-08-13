angular.module("app").controller "NewRecipeCtrl", ["$scope", "$collection", "$location", ($scope, $collection, $location) ->
  $collection(Recipes).bind $scope, "recipes"

  $scope.recipe = {}

  $scope.saveRecipe = ->
    if this.recipeForm.$valid
      this.recipes.save(this.recipe).then (recipe)->
        $location.path("/recipes/#{recipe._id}")

]
