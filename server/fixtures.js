if (typeof CR === "undefined") {
  CR = {};
}

Meteor.methods({
  reset: function() {
    Items.remove({});
    CR.seed();
  }
});

CR.seed = function () {
  var names = [
    "Ananas",
    "Baies des bois",
    "Bananes",
    "Basilic",
    "Cassis",
    "Cerises",
    "Chocolat",
    "Citrons",
    "Fraises",
    "Framboises",
    "Fruits de la passion",
    "Gingembre",
    "Groseilles",
    "Lait de coco",
    "Lychees",
    "Mangues",
    "Pamplemousses roses",
    "Papayes",
    "Bacio (chocolat et noisette concassée)",
    "Cannelle",
    "Caramel au sel",
    "Cardamone (Kulfi)",
    "Chocolat",
    "Curry",
    "Fée verte",
    "Fior di latte",
    "Gianduia",
    "Gingembre",
    "Jamaïque",
    "Kirsch",
    "Menthe aux éclats de chocolat",
    "Mocca",
    "Noisette",
    "Pistache",
    "Safran",
    "Stracciatella (Fior + éclats de chocolat)",
    "Vanille",
    "Yoghurt nature",
    "Yoghurt myrtilles",
    "Macha (thé vert)",
    "Sésame noir",
    "Eau de rose",
    "Fleur d’oranger"];
  for (var i = 0; i < names.length; i++) {
    Items.insert({name: names[i], score: 1400, gamesCount: 0});
  }
}

Meteor.startup(function () {
  if (Items.find().count() === 0) {
    CR.seed();
  }
});