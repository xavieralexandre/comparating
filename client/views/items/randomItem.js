Template.randomItem.helpers({
  items: function() {
    return Items.findOne({score: 0});
  }
});