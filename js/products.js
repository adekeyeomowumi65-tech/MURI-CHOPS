// products.js
const PRODUCTS = [
  { id: "jollof-smoky", name: "Smoky Jollof Bowl", category: "rice", price: 7500,
    desc: "Party jollof, grilled chicken, fried plantain & coleslaw.",
    img: "images/jollof-smoky.jpg", popular: true },
  { id: "coconut-rice", name: "Coconut Rice Bowl", category: "rice", price: 8000,
    desc: "Creamy coconut rice, spicy chicken, vegetables & plantain.",
    img: "images/coconut-rice.jpg", popular: false },
  { id: "ofada-special", name: "Ofada Special", category: "rice", price: 9500,
    desc: "Ofada rice, ayamase sauce, assorted meat & boiled egg.",
    img: "images/ofada-special.jpg", popular: true },

  { id: "grilled-chicken", name: "MURI Grilled Chicken", category: "grills", price: 7000,
    desc: "Half grilled chicken with signature pepper sauce.",
    img: "images/grilled-chicken.jpg", popular: true },
  { id: "peppered-wings", name: "Peppered Chicken Wings", category: "grills", price: 6000,
    desc: "Crispy wings tossed in MURI pepper sauce.",
    img: "images/peppered-wings.jpg", popular: false },
  { id: "suya-skewers", name: "Suya Skewers", category: "grills", price: 5500,
    desc: "Beef suya, onions, pepper & special spice.",
    img: "images/suya-skewers.jpg", popular: false },

  { id: "classic-small-chops", name: "Classic Small Chops Box", category: "small-chops", price: 6500,
    desc: "Samosa, spring rolls, puff-puff & chicken wings.",
    img: "images/classic-small-chops.jpg", popular: false },
  { id: "party-box", name: "Party Box", category: "small-chops", price: 12000,
    desc: "A larger assorted small-chops box.",
    img: "images/party-box.jpg", popular: false },

  { id: "zobo", name: "MURI Zobo", category: "drinks", price: 2000,
    desc: "Chilled house-made zobo.", img: "images/zobo.jpg", popular: false },
  { id: "chapman", name: "Chapman", category: "drinks", price: 2500,
    desc: "", img: "images/chapman.jpg", popular: false },
  { id: "pineapple-ginger", name: "Pineapple Ginger Juice", category: "drinks", price: 2500,
    desc: "", img: "images/pineapple-ginger.jpg", popular: false },
];

const EXTRAS = [
  { id: "extra-chicken", name: "Extra Chicken", price: 2500 },
  { id: "extra-plantain", name: "Extra Plantain", price: 1500 },
  { id: "extra-sauce", name: "Extra Sauce", price: 800 },
  { id: "coleslaw", name: "Coleslaw", price: 1000 },
];

const WHATSAPP_NUMBER = "+2347069127167"; // TODO: replace with real number, no + or leading 0
