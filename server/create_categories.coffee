Meteor.startup ->
  if Categories.find().count() == 0
    Categories.insert name: "Breakfast"
    Categories.insert name: "Lunch"
    Categories.insert name: "Dinner"
