Meteor.startup(function () {
  Meteor.publish('items', function() {
    return Items.find();
  });
});