module.exports = (config) => {
    const assetsPath = config['Application.AssetsRoot'] || config['Application.SiteRoot'];
    return (`
      <!DOCTYPE html>
      <html>
        <head>
    
          <meta charset="utf-8" />
          <meta httpequiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="description" content="" />
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          
          <title>${config['Application.Name']}</title>
          
          <link rel="stylesheet" href="${assetsPath}/dist/main.css" />
          
        </head>
        <body>
          <div 
            id="root" 
            data-useoidc="${config.useOidc}"
            data-auth="${config.auth}"
            data-clientid="${config['Application.ServiceName']}"
            data-siteroot="${config['Application.SiteRoot']}"
            class="application">
            
            <h1>Hello World!</h1> 
  
          <div class="tmp_header"></div>
          <div class="tmp_footer"></div>
          </div>
          <script src="${assetsPath}/dist/main.js"></script> 
        </body>
      </html>
    `);
  };