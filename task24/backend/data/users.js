// Seed user accounts for authentication
const USERS = [
  {
    id: "usr_101",
    name: "Alex Morgan",
    email: "alex@payflow.io",
    password: "password123", // demo hash
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "+1 (555) 234-5678",
    addresses: [
      {
        id: "addr_1",
        title: "Home",
        fullName: "Alex Morgan",
        addressLine: "742 Evergreen Terrace",
        city: "San Francisco",
        state: "CA",
        zip: "94107",
        country: "United States",
        isDefault: true
      }
    ]
  }
];

module.exports = USERS;
