const { Schema, model } = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {type: String, require:true},
  email: {type: String, require:true, unique: true},
  password: {type: String, require:true},
  lang: {type: String, require:true},
  theme: {type: String, require:true},
  userRol: {type: String, require: true},
  permissionNavigation: [{
    Id:{type: Number, require:true},
    routerLink: {type: String, require:true},
    iconClass: {type: String, require:true},
    translate: {type: String, require:true},
    hasPermission: {type: Boolean, require:true},
    showInToolbar: {type: Boolean, require:true},
    showInSideNav: {type: Boolean, require:true},
    isNewRoute: {type: Boolean, require:true},
    EISubMenu: [{
      Id:{type: Number, require:true},
      routerLink: {type: String, require:true},
      iconClass: {type: String, require:true},
      translate: {type: String, require:true},
      hasPermission: {type: Boolean, require:true},
      showInToolbar: {type: Boolean, require:true},
      showInSideNav: {type: Boolean, require:true},
      isNewRoute: {type: Boolean, require:true}
    }]
  }]
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
