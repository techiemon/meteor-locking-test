angular.module("app").controller "EditRecipeCtrl", ["$scope", "$collection", "$location", "$routeParams", ($scope, $collection, $location, $routeParams) ->
  $collection(Recipes).bind $scope, "recipes"

  $collection(Categories).bind $scope, "categories"

  $collection(Recipes).bindOne $scope, "recipe", $routeParams.recipeId

  $collection(Recipes).bindOneAssociation $scope, "category", "recipe.categoryId"

  $scope.newIngredient = {}

  $scope.saveRecipe = ->
    if @recipeForm.$valid
      @recipes.save(@recipe).then (saved)->
        $location.path("/recipes/#{saved[0]._id}")

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
