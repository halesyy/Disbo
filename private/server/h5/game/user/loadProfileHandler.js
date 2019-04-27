// Backend, for loading profiles.

module.exports = {
      handler: function(frontend) {

        frontend.on("load profile", function(frontendData){
          // console.log(`[XX:XX:XX] Getting profile data for ${frontendData.userid}`);
          // Getting the individual connection that it was sent from
          // var clientID = frontend.client.conn.id;
          // var client = environment.io.sockets.connected[clientID];
          // var clientVars = client.clientVars

          // console.log(clientVars);
          // pushing out that the profile is
          // ready to the individual client

        });
      }
}
