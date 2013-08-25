Template.admin.events({
  'click #reset': function (e) {
    Meteor.call('reset');
    alert("DONE!");
  },
  'click #import_from_csv': function (e) {

  }
});