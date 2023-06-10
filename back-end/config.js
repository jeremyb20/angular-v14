const jwt = require('jsonwebtoken');
const verification =  function verifyToken(req,res,next){
  if(!req.headers.authorization){
    return res.json({success: false, message: 'No tiene permisos para esta vista'});
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token)
    return res.status(401).send({ success: false, message: 'Token no existe.' });
  jwt.verify(token,process.env.SECRET, function(err, _decoded) {
    if (err){
     return res.status(401).send({ success: false, message: 'Token ya expiró, inicie sesión nuevamente' }); 
    }
    
    next();
  });
}

module.exports = verification;
