
module.exports = (config) => (req, res) => {
  const assetsPath = config['Application.AssetsRoot'] || config['Application.SiteRoot'];

  res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head></head>
        <body>
          <div 
            id="root"
            data-siteroot="${config['Application.SiteRoot']}"
            data-clientid="${config['Application.ServiceName']}"
            data-clientsecret="${config.clientSecret}"
            data-auth="${req.apis.authentication}"
          ></div>
         
          <script type="text/javascript" src="${assetsPath}/dist/silent-renew.js"></script>
        </body>
      </html>
    `
  );
}
