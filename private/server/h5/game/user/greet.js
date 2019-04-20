// a = the overall h5, I think?
// yes it's the environment.js export.

// Called at the greeting, all of the "entrance"
// code.

module.exports = function(api, socket) {
  a = api;
  b = socket;

  // console.log("Greetings...")
  // socket.emit("signin-dialog", {
  //   enabled: true
  // });
  
  // console.log(api.currentUser)
  // if (api.configuration.server.welcome.enabled == true) {
  //   socket.emit("dialog", {
  //     title: "Greetings from Habbo Staff",
  //     body: api.filter(api.configuration.server.welcome.message, socket.currentUser)
  //   });
  // }
};
