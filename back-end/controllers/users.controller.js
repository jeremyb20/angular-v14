const userCtl = {}

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const moment = require('moment');

userCtl.getUsers = async ( _req,res )=> {
  const users = await User.find();
  const listaUsuarios = [];

  users.forEach(element => {
    if(element.userRol == 'Usuario'){
      listaUsuarios.push(element);
    }
  });
  res.json({listaUsuarios: listaUsuarios, success: true});
}

userCtl.getEmployees = async ( _req,res )=> {
  const users = await User.find();
  const employees = [];
  users.forEach(element => {
    if(element.userRol == 'Empleado' || element.userRol == 'Administrador'  ){
      employees.push(element);
    }
  });
  res.json({listaEmpleados: employees, success: true});
}

userCtl.registerUser = async( req,res ) => {
  const { email,password,theme,userRol,username,lang } = req.body;
  const newUser = new User({email,password,theme,userRol,username,lang});
  User.addUser(newUser,async(_err, user, _done) => {
    try {
      if(!user){
        return res.json({success: false, message: 'El correo ya existe..!'});
      }
      res.json({ success: true, message: 'Se ha registrado el usuario exitosamente' });
    } catch (err) {
      res.json({success: false, message: 'El correo ya existe..!'});
      next(err);
    }

  });
}

userCtl.editUser = async ( req,res )=> {
  await User.findByIdAndUpdate(req.body._id, req.body);
  res.send({success: true, message: 'Usuario actualizado'});
}

userCtl.loginUser = async( req,res )=> {
  const { username, password  } = req.body;
  User.findOne({username: username}, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, message: 'El usuario no existe'});
    }

    User.comparePassword(password, user.password, (_err, isMatch) => {
      if(_err) throw _err;
      if(isMatch) {
        const token = jwt.sign({data: user}, process.env.SECRET, {
          expiresIn: 604800   // 1 week: 604800//  1 day 1440 //60 one minute
        });
        const userLogin = {
          id: user._id,
          username:user.username,
          email: user.email,
          updatedAt: user.updatedAt,
          theme: user.theme,
          lang: user.lang,
          userRol: user.userRol
        }
        res.json({
          success: true,
          token: token,
          user: userLogin
        })
      } else {
        return res.json({success: false, message: 'Contraseña incorrecta'});
      }
    });
  });

}

userCtl.getUserById = async ( req,res )=> {
  const user =  await User.findById(req.params.id);
  res.send({success: true, usuario: user});

}

userCtl.deleteUser = async( req,res )=> {
  await User.findByIdAndDelete(req.body._id);
  res.send({success: true, message: 'Usuario eliminado'});
}

userCtl.setTranslateUser = async ( req,res )=> {
  const { lang } = req.body;
  await User.findByIdAndUpdate(req.body.userId, {lang});
  res.send({success: true, message: 'Se ha actualizado corrrectamente.'});
}

userCtl.editTheme = async ( req,res )=> {
  const { theme } = req.body;
  await User.findByIdAndUpdate(req.body.userId, {theme});
  res.send({success: true, message: 'El tema ha sido actualizado exitosamente.'});
}

userCtl.addUserNavigation = async (req, res) => {
  User.findOneAndUpdate({ _id: req.body._id }, { $push: { navigation: req.body.navigation } }, { new: true }).then(function (data) {
    res.send({ message: 'Navegación agregada exitosamente', success: true });
  });
}

userCtl.registerNavigation = async (req, res) => {
  if (req.body.isSubRoute) {
    const navigation = await User.findById(req.body.Id);
    const subRoute = {
      routerLink: req.body.routerLink,
      iconClass: req.body.iconClass,
      translate: req.body.translate,
      hasPermission: req.body.hasPermission,
      showInToolbar: req.body.showInToolbar,
      showInSideNav: req.body.showInSideNav,
      isNewRoute: req.body.isNewRoute
    }
    navigation.navigation.push(subRoute);

    navigation.save()
    res.send({ message: 'Sub ruta actualizada', success: true });
  } else {
    const userFound = await User.findById(req.body.idParental);

    if (userFound) { 

      const routerObj = {
        routerLink: req.body.routerLink,
        iconClass: req.body.iconClass,
        translate: req.body.translate,
        hasPermission: req.body.hasPermission,
        showInToolbar: req.body.showInToolbar,
        showInSideNav: req.body.showInSideNav,
        isNewRoute: req.body.isNewRoute,
        EISubMenu: []
      }

      User.findOneAndUpdate({ _id: req.body._id }, { $push: { navigation: routerObj } }, { new: true }).then(function (data) {
        res.send({ message: 'Navegación agregada exitosamente', success: true });
      });
    }
  }
}

module.exports = userCtl;
