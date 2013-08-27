(function(){var pickRandomRank = function(itemsCount) {
  return CR.getRandomInt(0, itemsCount - 1);
}

CR.refreshButtons = function() {
  var itemsCount = Items.find().count();
  var firstItemPosition = pickRandomRank(itemsCount);
  var secondItemPosition = pickRandomRank(itemsCount);

  while (secondItemPosition === firstItemPosition) {
    secondItemPosition = pickRandomRank(itemsCount);
  }

  CR.firstItem = Items.findOne({}, {skip: firstItemPosition});
  CR.secondItem = Items.findOne({}, {skip: secondItemPosition});

  var versusItems = [CR.firstItem, CR.secondItem];

  var html = "";

  for (var i = 0; i < versusItems.length; i++) {
    var versusItem = versusItems[i];
    html += '<li class="versus_item"><button type="button" class="btn btn-primary btn-lg btn-full" data-id="' + versusItem._id  + '">' + versusItem.name + '</button></li>';
  }

  jQuery('ul.versus').html(html);
};


Template.fight.rendered = function () {
  jQuery('.container').on('click', 'button', function(e) {
    e.preventDefault();
    var target = jQuery(e.currentTarget);
    var loser = target.parent().siblings().find('button');

    var winnerId = target.data('id');
    var loserId = loser.data('id');

    // Elo Rating
    var winnerItem = Items.findOne(winnerId);
    var loserItem = Items.findOne(loserId);

    var winnerItemNewScore = CR.newScore(winnerItem, 1, loserItem);
    var loserItemNewScore = CR.newScore(loserItem, 0, winnerItem);

    Items.update(winnerId, {$set: {score: winnerItemNewScore}, $inc: {gamesCount: 1}});
    Items.update(loserId, {$set: {score: loserItemNewScore}, $inc: {gamesCount: 1}});

    CR.refreshButtons();

    // NAIVE RATING
    //Items.update(target.data('id'), {$inc: {score: 1}})
    //Items.update(loser.data('id'), {$inc: {score: -1}})
  });
}

})();
