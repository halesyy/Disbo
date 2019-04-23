import BaseComposer from "./BaseComposer";

export default class SingleSignOnComposer extends BaseComposer {

    private _sso: string;

    constructor(sso: string) {
        super();
        this._sso = sso;

        this.Execute();
    }

    private Execute() {
        let message = {
            "header": "sso",
            "token": this._sso
        }

        this.Send(message);
    }

}