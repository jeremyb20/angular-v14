const { Schema, model } = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {type: String, required:true},
  email: {type: String, required:true, unique: true},
  password: {type: String, required:true},
  lang: {type: String, required:true},
  theme: {type: String, required:true},
  userRol: {type: String, required: true}
},{
  timestamps: true,
  versionKey: false
});

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

const User =  module.exports = model("User", userSchema);

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (_err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.checkIfEmailExist = async function(email, callback) {
  const query = {email: email}
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
