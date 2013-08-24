Items = new Meteor.Collection("items");

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}



if (Meteor.isClient) {
  Meteor.subscribe('items');

  Template.comparating.items = function () {
    return Items.find({}, {sort: {name: 1}});
  };

  Template.comparating.versus_items = function () {
    var itemsCount = Items.find().count();
    var firstItemPosition = getRandomInt(0, itemsCount);
    var secondItemPosition = getRandomInt(0, itemsCount);

    console.log('BEFORE: firstItemPosition:', firstItemPosition, " secondItemPosition:", secondItemPosition);

    // TODO: Does not work ! Stalls the browser
    var i = 0;
    while (secondItemPosition === firstItemPosition) {
      console.log('firstItemPosition:', firstItemPosition, " secondItemPosition:", secondItemPosition);
      secondItemPosition = getRandomInt(0, itemsCount);
      i = i + 1;
      if (i === 10) {
        break;
      }
    }

    var firstItem = Items.findOne({}, {skip: firstItemPosition});
    var secondItem = Items.findOne({}, {skip: secondItemPosition});
    return [firstItem, secondItem];
  };


  // TODO: give 1 point to the clicked item, remove 1 point to the other one

  Template.comparating.events({
    'click input': function (e) {
      e.preventDefault();
      var target = jQuery(e.currentTarget);
      var loser = target.parent().siblings().find('input');

      console.log("target", target);
      console.log("I should give one point to ", target.data('id'));
      console.log("I should give take back one point from ", loser.data('id'));

      Items.update(target.data('id'), {$inc: {score: 1}})
      Items.update(loser.data('id'), {$inc: {score: -1}})

      //Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

}

// On server startup, create some items if the database is empty.
// TODO: read a CSV

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Items.find().count() === 0) {
      var names = [
        "Vanilla Ice Cream",
        "Vanilla Ice Cream, Philadelphia-Style",
        "Chocolate Ice Cream",
        "Chocolate Ice Cream, Philadelphia-Style",
        "Aztec “Hot” Chocolate Ice Cream",
        "Chocolate–Peanut Butter Ice Cream",
         "Chocolate-Raspberry Ice Cream",
        "Milk Chocolate Ice Cream",
        "Guinness–Milk Chocolate Ice Cream",
        "White Chocolate Ice Cream",
        "Coffee Ice Cream",
        "Coffee Frozen Yogurt",
        "Vietnamese Coffee Ice Cream",
        "Anise Ice Cream",
        "Cinnamon Ice Cream",
        "Black Currant Tea Ice Cream",
        "Green Tea Ice Cream",
        "Kinako Ice Cream",
        "Fresh Ginger Ice Cream",
        "Butterscotch Pecan Ice Cream",
        "Date, Rum, and Pecan Ice Cream",
        "Gianduja Gelato",
        "Maple Walnut Ice Cream with Wet Walnuts",
        "Vanilla Frozen Yogurt",
        "Peanut Butter Ice Cream",
        "Orange Popsicle Ice Cream",
        "Malted Milk Ice Cream",
        "Oatmeal-Raisin Ice Cream",
        "Rum Raisin Ice Cream",
        "Tin Roof Ice Cream",
        "Zabaglione Gelato",
        "Chartreuse Ice Cream",
        "Eggnog Ice Cream",
        "Crème Fraîche Ice Cream",
        "Toasted Almond and Candied Cherry Ice Cream",
        "Goat Cheese Ice Cream",
        "Cheesecake Ice Cream",
        "Tiramisù Ice Cream",
        "Lavender-Honey Ice Cream",
        "Roquefort-Honey Ice Cream",
        "Turrón Ice Cream",
        "Sweet Potato Ice Cream with Maple-Glazed Pecans",
        "Panforte Ice Cream",
        "Rice Gelato",
        "Roasted Banana Ice Cream",
        "Sour Cherry Frozen Yogurt",
        "Dried Apricot–Pistachio Ice Cream",
        "Fresh Apricot Ice Cream",
        "Plum Ice Cream",
        "Prune-Armagnac Ice Cream",
        "Pear-Caramel Ice Cream",
        "Fresh Fig Ice Cream",
        "Pear-Pecorino Ice Cream",
        "Olive Oil Ice Cream",
        "Orange–Szechwan Pepper Ice Cream",
        "Super Lemon Ice Cream",
        "Lemon-Speculoos Ice Cream",
        "Blueberry Frozen Yogurt",
        "Peach Ice Cream",
        "Peach Frozen Yogurt",
        "Strawberry–Sour Cream Ice Cream",
        "Strawberry Frozen Yogurt",
        "Raspberry Swirl Ice Cream",
        "Raspberry Ice Cream",
        "Passion Fruit Ice Cream",
        "Avocado Ice Cream",
        "Toasted Coconut Ice Cream",
        "Green Pea Ice Cream",
        "Fresh Mint Ice Cream",
        "Basil Ice Cream",
        "Parsley Ice Cream",
        "Black Pepper Ice Cream",
        "Saffron Ice Cream"];
      for (var i = 0; i < names.length; i++)
        Items.insert({name: names[i], score: 0});
    }

    Meteor.publish('items', function() {
      return Items.find();
    });
  });
}
