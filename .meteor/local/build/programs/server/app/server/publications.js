(function(){Meteor.startup(function () {
  Meteor.publish('items', function() {
    return Items.find();
  });
});


// TODO: Dissociate random 2 items collections for fight
// and 25 top scored items for leaderboard
// rather than passing all to the front-end

})();
