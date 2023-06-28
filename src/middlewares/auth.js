export function isUser(req, res, next) {
    if (req.session?.email) {
      return next();
    }
    return res.status(401).json({ msg: 'Error de autenticación' });
  } 

  export function esAdmin(req, res, next) {
    if(req.session?.isAdmin){
      return next();
    }
    return res.status(403).json({msg: 'Error de autorizacion'});
  }

  