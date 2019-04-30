
var clientVars = {
  host: '59.102.70.18',
  port: '7858',
  sso:  'abc'
};

ssos = ["jack", "oliy"]
ssochoice = ssos[Math.floor(Math.random() * ssos.length)];
clientVars["sso"] = ssochoice
