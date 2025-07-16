const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["eleve", "prof"] },
  inilial: { type: String },
  color: { type: String, default: '#020118' }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
