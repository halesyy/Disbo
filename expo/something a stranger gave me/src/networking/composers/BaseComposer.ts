import Habbo from '../../Habbo';
export default class BaseComposer {

    constructor() {
        
    }

    // Sends a stringified json object to the server
    public Send(message: any) {
        Habbo.GetNetworker().SendMessage(JSON.stringify(message));
    }

}