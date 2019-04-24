// Backened - returning friend data parseable

module.exports = function(frontend) {

    frontend.on("client friends list", function(data){
        console.log("going to get the user's friendship data!");

        var clientID = frontend.client.conn.id;
        var client = environment.io.sockets.connected[clientID];
        var clientVars = client.clientVars

        client.emit("got client friends list", {
          ok: "this is data"
        });
    });

}
