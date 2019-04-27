
var clientVars = {
  host: '115.64.232.86',
  port: '7858',
  sso:  'abc'
};

ssos = ["jack", "oliy"]
ssochoice = ssos[Math.floor(Math.random() * ssos.length)];
clientVars["sso"] = ssochoice
