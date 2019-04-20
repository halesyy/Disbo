import Logger from '../util/Logger';
import AuthenticatedEvent from './events/AuthenticatedEvent';
import EnterRoomEvent from './events/EnterRoomEvent';
import AddAvatarToRoom from './events/AddAvatarToRoom';
import MoveAvatarComposer from './composers/MoveAvatarComposer';
import MoveAvatarEvent from './events/MoveAvatarEvent';
import StopWalkingEvent from './events/StopWalking';
import RemoveAvatar from './events/RemoveAvatar';
import RoomListEvent from './events/RoomListEvent';
import AlertEvent from './events/AlertEvent';
export default class MessageParser {

    public static Transmit(message: any) {

        Logger.Log("<- " + message);

        let data = JSON.parse(message);

        if(!MessageParser.IsValid(data))
            { Logger.Log("Received packet in incorrect format"); return; }

        switch(data["header"].toLowerCase()) {

            case "authenticated": {
                new AuthenticatedEvent(data);
                break;
            }

            case "enter_room": {
                new EnterRoomEvent(data);
                break;
            }

            case "add_avatar_to_room": {
                new AddAvatarToRoom(data);
                break;
            }

            case "move_avatar": {
                new MoveAvatarEvent(data);
                break;
            }

            case "stop_walking": {
                new StopWalkingEvent(data);
                break;
            }

            case "remove_avatar": {
                new RemoveAvatar(data);
                break;
            }

            case "room_list": {
                new RoomListEvent(data);
                break;
            }

            case "alert": {
                new AlertEvent(data);
                break;
            }

            default: {
                Logger.Log("Received packet with unknown header: " + data["header"]);
            }

        }

    }

    private static IsValid(data: any) {
        if(data != null && data["header"] != null)
            return true;

        return false;
    }

}