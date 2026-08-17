const bcrypt = require('bcryptjs');
const db = require('../config/database');

class User {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  static findByEmail(email) {
    return db.findUserByEmail(email);
  }

  static findById(id) {
    return db.findUserById(id);
  }

  static async create({ name, email, password }) {
    const hashedPassword = await this.hashPassword(password);
    return db.createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });
  }

  static updateLastLogin(id) {
    return db.updateUserLastLogin(id);
  }

  static toSafeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = User;
