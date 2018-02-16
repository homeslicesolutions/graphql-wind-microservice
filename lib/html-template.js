module.exports = (props) => {
  const assetsPath = props['Application.AssetsRoot'] || props['Application.SiteRoot'];
  return (`
    <!DOCTYPE html>
    <html>
      <head>
  
        <meta charset="utf-8" />
        <meta httpequiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        
        <title>${props['Application.Name']}</title>
        
        <style type="text/css">
          body{ background-color: #f0f2f5; margin:0;padding:0; }
          .tmp_header{
            position:fixed;
            top:0;
            height: 36px;
            width: 100%;
            background-color: #34393f;
          }
          .tmp_footer{
            position:fixed;
            bottom:0;
            height: 36px;
            width: 100%;
            background-color: #34393f;
          }
        </style>
        <link rel="stylesheet" href="${assetsPath}/dist/main.css" />
        
      </head>
      <body>
        <div 
          id="root" 
          data-useoidc="${props.useOidc}"
          data-auth="${props.auth}"
          data-clientid="${props['Application.ServiceName']}"
          data-siteroot="${props['Application.SiteRoot']}"
          data-clientsecret="${props.clientSecret}"
          class="co--strategyplanning--wrapper">
        <div class="tmp_header"></div>
        <div class="tmp_footer"></div>
        </div>
        <script src="${assetsPath}/dist/main.js"></script> 
      </body>
    </html>
  `);
};