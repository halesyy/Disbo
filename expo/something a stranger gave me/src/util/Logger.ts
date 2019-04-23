import Config from '../Config';

export default class Logger {

    public static Log(msg) {

        if(Config.environment.debug) {
            let date = new Date();

            console.log("[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] " + msg)
        }     
        
    }

}