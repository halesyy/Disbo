var clientVars = {
  host: '27.33.240.140',
  port: '7858',
  sso:  'abc'
};
ssos = ["jack", "oliy"]
var ssochoice = ssos[Math.floor(Math.random() * ssos.length)];
clientVars["sso"] = ssochoice
