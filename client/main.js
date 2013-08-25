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

