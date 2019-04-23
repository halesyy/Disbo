import BaseEvent from './BaseEvent';
import Habbo from '../../Habbo';
import Room from '../../room/Room';
import UserInterface from '../../userinterface/UserInterface';
import RoomListComposer from '../composers/RoomListComposer';

export default class AuthenticatedEvent extends BaseEvent {

    constructor(data: any) {
        super(data);

        this.Execute();
    }

    private Execute() {

        UserInterface.Container.$data.logged_in = true;
        UserInterface.Container.$data.navigator_open = true;

        new RoomListComposer('public');

    }
    
}