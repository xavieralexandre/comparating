// namespace for all business logic
CR = {
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

