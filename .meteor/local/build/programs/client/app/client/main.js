(function(){Meteor.subscribe('items', function() {
  console.log ("Subscription READY");
  CR.refreshButtons();
});

})();
