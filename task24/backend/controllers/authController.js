const USERS = require('../data/users');

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  return res.status(200).json({
    success: true,
    message: 'Authentication successful',
    token: `jwt_token_${user.id}_${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      addresses: user.addresses
    }
  });
};

exports.register = (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
  }

  const existing = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, error: 'Email address already registered' });
  }

  const newUser = {
    id: `usr_${Math.floor(100 + Math.random() * 900)}`,
    name,
    email,
    password,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    phone: phone || '+1 (555) 000-1122',
    addresses: [
      {
        id: `addr_${Date.now()}`,
        title: 'Default Shipping Address',
        fullName: name,
        addressLine: '100 Market St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        isDefault: true
      }
    ]
  };

  USERS.push(newUser);

  return res.status(201).json({
    success: true,
    message: 'User account created successfully',
    token: `jwt_token_${newUser.id}_${Date.now()}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      phone: newUser.phone,
      addresses: newUser.addresses
    }
  });
};
