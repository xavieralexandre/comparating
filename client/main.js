Meteor.subscribe('items', function() {
  console.log ("Subscription READY");
  refreshButtons();
});
