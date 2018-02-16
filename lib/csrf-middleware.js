const cookieParser = require('cookie-parser');
const csurf = require('csurf');

module.exports = (app, config) => {
  app.use(cookieParser(
    // TODO: load a more secure secret / encryption key?
    'BB17B23E599A4B98A3D4E5F43458575954CEC688C8A04ADAB6F30E4F85CBAEB2', {
      httpOnly: true,
      secure  : config['Confirmit.Site.SSLEnabled'].toString().toLowerCase() === 'true'
    })
  );

  app.use(csurf({
    cookie: {
      key      : '_csrf',
      httpOnly : true,
      secure   : config['Confirmit.Site.SSLEnabled'].toString().toLowerCase() === 'true',
      path     : '/',
      overwrite: true
    }
  }));
};

