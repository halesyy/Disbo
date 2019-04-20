import BaseEvent from './BaseEvent';
import Habbo from '../../Habbo';
import Room from '../../room/Room';

export default class EnterRoomEvent extends BaseEvent {

    private _owner: string;
    private _name: string;
    private _description: string;
    private _likes: number;
    private _hasRights: boolean;
    private _size: number;
    private _floorData: string;

    constructor(data: any) {
        super(data);

        this._owner = data["owner"];
        this._name = data["name"];
        this._description = data["description"];
        this._likes = data["likes"];
        this._hasRights = data["hasRights"];
        this._size = data["size"];
        this._floorData = data["floorData"];

        this.Execute();
    }

    private Execute() {

        if(Habbo.Room)
            Habbo.Room.Dispose();

        Habbo.Room = new Room(
            this._owner,
            this._name,
            this._description,
            this._likes,
            this._hasRights,
            this._size,
            this._floorData
        );

        if(this._name == "Test Room") {
            Habbo.Room.SpawnItem('plants.pineapple', 0, 0, 0);
            Habbo.Room.SpawnItem('plants.pineapple', 1, 0, 0);
            Habbo.Room.SpawnItem('plants.pineapple', 2, 0, 0);
            Habbo.Room.SpawnItem('plants.pineapple', 3, 0, 0);
            Habbo.Room.SpawnItem('lodge.divider', 1, 0, 0.5);
            Habbo.Room.SpawnItem('lodge.corner', 3, 0, 0.5);
            Habbo.Room.SpawnItem('lodge.corner', 0, 0, 0.5);
            Habbo.Room.SpawnItem('lodge.corner', 2, 3, 0);
            Habbo.Room.SpawnItem('lodge.divider', 3, 3, 0);
            Habbo.Room.SpawnItem('lodge.divider', 5, 3, 0);
            Habbo.Room.SpawnItem('lodge.corner', 7, 3, 0);
            Habbo.Room.SpawnItem('plants.big_cactus', 5, 9, 0);
            Habbo.Room.SpawnItem('plants.bonsai', 2, 5, 0);
            Habbo.Room.SpawnItem('plants.bulrush', 8, 5, 0);
            Habbo.Room.SpawnItem('plants.pineapple', 9, 7, 0);
            Habbo.Room.SpawnItem('plants.rose', 1, 8, 0);
            Habbo.Room.SpawnItem('plants.small_cactus', 5, 5, 0);
            Habbo.Room.SpawnItem('plants.sunflower', 8, 2, 0);
            Habbo.Room.SpawnItem('plants.yukka', 5, 0, 0);
            Habbo.Room.SpawnItem('plants.yukka', 5, 0, 0.5);
            Habbo.Room.SpawnItem('plants.yukka', 5, 0, 1);
        }   

    }
    
}