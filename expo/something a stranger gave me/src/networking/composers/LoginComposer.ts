import BaseComposer from "./BaseComposer";

export default class LoginComposer extends BaseComposer {

    private _username: string;
    private _password: string;

    constructor(username: string, password: string) {
        super();
        this._username = username;
        this._password = password;

        this.Execute();
    }

    private Execute() {
        let message = {
            "header": "login",
            "username": this._username,
            "password": this._password
        }

        this.Send(message);
    }

}