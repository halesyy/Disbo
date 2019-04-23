import BaseEvent from './BaseEvent';
import Habbo from '../../Habbo';
import Room from '../../room/Room';
import Avatar from '../../room/entities/avatars/Avatar';
import Logger from '../../util/Logger';

export default class StopWalkingEvent extends BaseEvent {

    private _id: number;

    constructor(data: any) {
        super(data);       

        this._id = data["id"];

        this.Execute();
    }

    private Execute() {
        let avatar = Habbo.Room.Entities.get(this._id);
        if(avatar == null)
            return;

        (<Avatar>avatar).Walking = false;

        (<Avatar>avatar).UpdateAnimator(avatar.X, avatar.Y);
    
    }
    
}