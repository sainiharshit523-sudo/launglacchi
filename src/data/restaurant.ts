export const restaurant = {
  name: "Laung Laachi",
  tagline: "Good food. Warm vibes. A stop worth remembering.",
  phoneDisplay: "+91 99157 16739",
  phoneHref: "tel:+919915716739",
  address: "Nangal to Chandigarh Road, Brahmpur, Rupnagar District, Punjab 140125, India",
  shortAddress: "Nangal–Chandigarh Road, Brahmpur, Punjab",
  hours: "7:00 AM–12:00 AM",
  priceRange: "₹200–₹400 / person",
  rating: "3.9",
  reviewCount: 653,
  googleMapsUrl: "https://maps.app.goo.gl/HumD2CgT2osvzSJq8",
  directionsUrl: "https://maps.app.goo.gl/HumD2CgT2osvzSJq8",
  whatsappUrl:
    "https://wa.me/919915716739?text=Hello%20Laung%20Laachi%2C%20I%20have%20an%20inquiry%20regarding%20the%20restaurant%20and%20banquet%20hall.",
  email: "launglaachibrahmpur@gmail.com",
  emailHref: "mailto:launglaachibrahmpur@gmail.com",
  social: {
    instagram: "https://instagram.com/launglaachirestaurant",
    facebook: "https://facebook.com/launglaachirestaurant",
    twitter: "https://twitter.com/launglaachi",
  },
} as const;

export const menuHighlights = [
  { name: "Paneer Lababdaar", category: "Main course" },
  { name: "Butter Garlic Naan", category: "Breads" },
  { name: "Gud Wali Chai", category: "Tea" },
  { name: "Paranthas", category: "Breakfast" },
  { name: "Noodles", category: "Quick bites" },
  { name: "Fresh Soups", category: "Soups" },
  { name: "Paneer Pakoda", category: "Snacks" },
  { name: "Lassi", category: "Drinks" },
  { name: "Masala Tea", category: "Tea" },
] as const;

export const services = [
  { title: "Dine in", copy: "Settle in for a casual meal with family or friends." },
  { title: "Outdoor seating", copy: "Take a comfortable break in the open air." },
  { title: "Takeaway", copy: "Pick up food for the road and continue your journey." },
  { title: "Delivery", copy: "Delivery is available for customers in the area." },
] as const;

export const banquetInfo = {
  name: "Laung Laachi A.C Rooms & Banquet Hall",
  capacity: "50 to 300+ Guests",
  phoneDisplay: "+91 99157 16739",
  phoneHref: "tel:+919915716739",
  whatsappHref:
    "https://wa.me/919915716739?text=Hello%20Laung%20Laachi%2C%20I%20would%20like%20to%20inquire%20about%20booking%20the%20Banquet%20Hall%20for%20an%20event.",
  events: [
    "Marriages & Wedding Receptions",
    "Ring Ceremony / Sagan / Roka",
    "Birthday & Anniversary Celebrations",
    "Kitty Parties & Family Get-Togethers",
    "Highway Tour & Pilgrim Bus Food Stops",
    "Corporate Meetings & Community Dinners",
  ],
  amenities: [
    "Grand Air-Conditioned Banquet Hall",
    "AC Guest Rooms for Outstation Visitors",
    "Custom Stage, Floral & Theme Decoration",
    "Live Clay Tandoor & Fresh Buffet Catering",
    "Dedicated Pure Veg & Non-Veg Kitchens",
    "Professional Sound, Music & Mic System",
    "Ample Free Highway & Private Parking",
  ],
} as const;
