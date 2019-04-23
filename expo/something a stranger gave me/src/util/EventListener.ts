import Point from '../util/Point';
import Logger from '../util/Logger';
import RoomComponent from '../userinterface/components/room/RoomComponent';
import UserInterface from '../userinterface/UserInterface';
import Habbo from '../Habbo';
import * as $ from "jquery";
import Room from '../room/Room';

export default class EventListener {

    public static currentPos: Point;
    public static isPressedDown: boolean;
    public static lastMouseDownTime: Date;
    public static lastMouseDownPos: Point;

    public static Listen() {
        EventListener.currentPos = new Point(0, 0);
        EventListener.isPressedDown = false;
        EventListener.lastMouseDownTime = new Date();
        EventListener.lastMouseDownPos = new Point(0, 0);

        document.onmousedown = EventListener.MouseDownEvent.bind(this);
        document.onmouseup = EventListener.MouseUpEvent.bind(this);
        document.onmousemove = EventListener.MouseMoveEvent.bind(this);

        $(window).resize(function() {
            if(Habbo.Room != null) {
                Habbo.Room.RoomRenderer.Canvas.width = window.innerWidth;
                Habbo.Room.RoomRenderer.Canvas.height = window.innerHeight;
            }
        });
    }

    private static MouseDownEvent() {
        EventListener.isPressedDown = true;
        EventListener.lastMouseDownPos.X = EventListener.currentPos.X;
        EventListener.lastMouseDownPos.Y = EventListener.currentPos.Y; 
        EventListener.lastMouseDownTime = new Date();       
    }

    private static MouseUpEvent() {
        EventListener.isPressedDown = false;
    }

    private static MouseMoveEvent(e: any) {
        EventListener.currentPos.X = e.clientX;
        EventListener.currentPos.Y = e.clientY;

        if(EventListener.isPressedDown && UserInterface.Container.$data.in_room && Habbo.Room.RoomRenderer.DraggAble) {

            let distanceX = EventListener.currentPos.X - EventListener.lastMouseDownPos.X;
            let distanceY = EventListener.currentPos.Y - EventListener.lastMouseDownPos.Y;

            Habbo.Room.RoomRenderer.Camera.Move(distanceX, distanceY);

            EventListener.lastMouseDownPos.X = EventListener.currentPos.X;
            EventListener.lastMouseDownPos.Y = EventListener.currentPos.Y;
        }
    }

}