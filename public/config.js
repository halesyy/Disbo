module.exports = {
   port: 3000,
   url: 'https://dev.disbo.net',
   secret: 'memes',
   scopes: ['identify', 'email'],
   client_id: '569146915439116288',
   client_secret: '2s-mRIrVhXmiUzNr3zDj0lsnSAPrjEA1',
   redirect_uri: 'http://luxlife.ddns.net:3000/login/callback',
   dbPort: '27017',
   dbPass: 'abc123',
   dev: true,
   gameServer: {
     host: 'luxlife.ddns.net',
     type: 'http',
     port: '7858'
   },
   api: {
     host: 'luxlife.ddns.net',
     port: '7777'
   }
}
