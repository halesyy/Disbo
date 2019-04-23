import BaseEvent from './BaseEvent';
import UserInterface from '../../userinterface/UserInterface';

export default class AlertEvent extends BaseEvent {

    private _title: string;
    private _message: string;
    private _button: string;
    private _trigger: string;

    constructor(data: any) {
        super(data);

        this._title = data["title"];
        this._message = data["message"];
        this._button = data["button"];
        this._trigger = data["trigger"];

        this.Execute();
    }

    private Execute() {

        if(this._trigger) {
            switch (this._trigger) {

                case 'login.retry': {
                    //@ts-ignore
                    UserInterface.Container.$refs.login.retry();
                    break;
                }
    
            }
        }   

        UserInterface.Alert(this._title, this._message, this._button);

    }
    
}