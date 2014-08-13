angular.module("app").config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/recipes/new', {templateUrl: 'editRecipe.html', controller: "NewRecipeCtrl"}).
      when('/recipes/:recipeId/edit', {templateUrl: 'editRecipe.html', controller: "EditRecipeCtrl"}).
      when('/recipes/:recipeId', {templateUrl: 'recipe.html', controller: "RecipeShowCtrl"});
  }]);
