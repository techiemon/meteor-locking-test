angular.module("app").controller "NewRecipeCtrl", ["$scope", "$collection", "$location", ($scope, $collection, $location) ->
  $collection(Recipes).bind $scope, "recipes"

  $collection(Categories).bind $scope, "categories"

  $scope.recipe = {}

  $scope.saveRecipe = ->
    if @recipeForm.$valid
      @recipes.save(@recipe).then (saved) ->
        $location.path("/recipes/#{saved[0]._id}")

]
