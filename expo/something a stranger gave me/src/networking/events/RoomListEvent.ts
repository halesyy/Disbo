import BaseEvent from './BaseEvent';
import Logger from '../../util/Logger';
import UserInterface from '../../userinterface/UserInterface';

export default class RoomListEvent extends BaseEvent {

    private _listName: number;
    private _rooms: any;

    constructor(data: any) {
        super(data);       

        this._listName = data["listName"];
        this._rooms = data["rooms"];
        
        this.Execute();
    }

    private Execute() {
        UserInterface.Container.$data["room_list"][this._listName] = this._rooms;
    }

    
}