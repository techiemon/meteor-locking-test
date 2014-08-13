angular.module("app").controller "EditRecipeCtrl", ["$scope", "$collection", "$location", "$routeParams", ($scope, $collection, $location, $routeParams) ->
  $collection(Recipes).bind $scope, "recipes"

  $collection(Recipes).bindOne $scope, "recipe", $routeParams.recipeId

  $scope.newIngredient = {}

  $scope.saveRecipe = ->
    if @recipeForm.$valid
      @recipes.save(@recipe).then (recipe)->
        $location.path("/recipes/#{recipe._id}")

  $scope.deleteRecipe = ->
    @recipes.remove(@recipe).then ->
      $location.path("/recipes")

  $scope.addIngredient = ->
    @recipe.ingredients ||= []
    @recipe.ingredients.push(@newIngredient)
    @newIngredient = {}

  $scope.deleteIngredient = (index)->
    @recipe.ingredients.splice(index, 1)

]
