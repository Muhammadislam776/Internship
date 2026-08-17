const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure db file exists with initial empty array
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify([], null, 2), 'utf-8');
}

const readUsers = () => {
  try {
    const data = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users database:', err);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing users database:', err);
    return false;
  }
};

const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

const findUserById = (id) => {
  const users = readUsers();
  return users.find(u => u.id === id);
};

const createUser = (userData) => {
  const users = readUsers();
  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    name: userData.name,
    email: userData.email,
    password: userData.password, // expected to be hashed already
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
};

const updateUserLastLogin = (id) => {
  const users = readUsers();
  const user = users.find(u => u.id === id);
  if (user) {
    user.lastLogin = new Date().toISOString();
    writeUsers(users);
  }
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserLastLogin,
  readUsers
};
