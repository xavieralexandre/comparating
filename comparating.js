Items = new Meteor.Collection("items");


// namespace for all business logic
var CR = {
  getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  volatilityCoefficient: function(item) {
    if (item.gamesCount <= 30) {
      return 30;
    }
    else if (item.gamesCount > 30 && item.score < 2400) {
      return 15;
    }
    else {
      return 10;
    }
  },

  winningProbability: function(firstItem, secondItem) {
    var scoreDistance = firstItem.score - secondItem.score;
    return 1 / (1 + Math.pow(10, -scoreDistance/400));
  },

  // didWin: int (0 or 1)
  newScore: function(firstItem, didWin, secondItem) {
    return Math.round(firstItem.score + CR.volatilityCoefficient(firstItem) * (didWin - CR.winningProbability(firstItem, secondItem)));
  }

};




if (Meteor.isClient) {
  Meteor.subscribe('items', function() {
    console.log ("Subscription READY");

    var buttonsFragment = Meteor.render(function () {
      var itemsCount = Items.find().count();
      var firstItemPosition = CR.getRandomInt(0, itemsCount);
      var secondItemPosition = CR.getRandomInt(0, itemsCount);

      while (secondItemPosition === firstItemPosition) {
        secondItemPosition = CR.getRandomInt(0, itemsCount);
      }

      var firstItem = Items.findOne({}, {skip: firstItemPosition});
      var secondItem = Items.findOne({}, {skip: secondItemPosition});

      var versusItems = [firstItem, secondItem];

      var html = "";

      for (var i = 0; i < versusItems.length; i++) {
        var versusItem = versusItems[i];
        html += '<li class="versus_item"><input type="button" data-id="' + versusItem._id  + '" value="' + versusItem.name + '"></li>';
      }

      return html;
    });

    jQuery('ul.versus').html(buttonsFragment);

  });

  Template.leaderboard.items = function () {
    return Items.find({}, {sort: {name: 1}});
  };

  Template.fight.events({
    'click input': function (e) {
      e.preventDefault();
      var target = jQuery(e.currentTarget);
      var loser = target.parent().siblings().find('input');

      var winnerId = target.data('id');
      var loserId = loser.data('id');

      // Elo Rating
      var winnerItem = Items.findOne(winnerId);
      var loserItem = Items.findOne(loserId);

      var winnerItemNewScore = CR.newScore(winnerItem, 1, loserItem);
      var loserItemNewScore = CR.newScore(loserItem, 0, winnerItem);

      Items.update(winnerId, {$set: {score: winnerItemNewScore}, $inc: {gamesCount: 1}});
      Items.update(loserId, {$set: {score: loserItemNewScore}, $inc: {gamesCount: 1}});

      // NAIVE RATING
      //Items.update(target.data('id'), {$inc: {score: 1}})
      //Items.update(loser.data('id'), {$inc: {score: -1}})
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
        Items.insert({name: names[i], score: 1400, gamesCount: 0});
    }

    Meteor.publish('items', function() {
      return Items.find();
    });
  });
}
