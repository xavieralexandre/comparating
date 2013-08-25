Template.leaderboard.items = function () {
  return Items.find({}, {sort: {score: -1}});
};
