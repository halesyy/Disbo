import Vue from 'vue';
import Config from '../Config';
import AlertComponent from './components/notifications/alert';
import HotelviewComponent from './components/hotelview/HotelviewComponent';
import LoginComponent from './components/auth/login'
import RoomComponent from './components/room/RoomComponent';
import MeMenuComponent from './components/memenu/MeMenuComponent';
import ChatComponent from './components/memenu/ChatComponent';
import MainMenuComponent from './components/memenu/MainMenuComponent';
import NavigatorComponent from './components/navigator/NavigatorComponent';
import DraggableDirective from './directives/DraggableDirective';
import TabGuestComponent from './components/navigator/TabGuestComponent';
import TabPublicComponent from './components/navigator/TabPublicComponent';
import TabOwnComponent from './components/navigator/TabOwnComponent';
import TabFavouriteComponent from './components/navigator/TabFavouriteComponent';
import TabSearchComponent from './components/navigator/TabSearchComponent';
import BtnBoldComponent from './components/buttons/btn-bold';

Vue.config.productionTip = false;

export default class UserInterface {

    public static Container: Vue;

    public static Prepare() {     

        UserInterface.RegisterDirectives();
        UserInterface.RegisterComponents();      

        UserInterface.Container = new Vue({

            el: Config.environment.main_container,

            data: {

                // States
                "logged_in": false,
                "in_room": false,
                "navigator_open": false,
                "catalog_open": false,
                "inventory_open": false,
                "tradewindow_open": false,

                // Navigator room lists
                "room_list": {
                    "public": [],
                    "guest": [],
                    "search": [],
                    "ownrooms": [],
                    "favourite": []
                },

                // Player vars
                "credits": "placeholder_credits",
                "hc_days_left": "0"

            }
        });
        
    }

    private static RegisterDirectives() {
        DraggableDirective.Register();
    }

    private static RegisterComponents() {

        BtnBoldComponent.Register();

        AlertComponent.Register();

        HotelviewComponent.Register();

        LoginComponent.Register();

        MeMenuComponent.Register();
        ChatComponent.Register();
        MainMenuComponent.Register();

        NavigatorComponent.Register();
        TabGuestComponent.Register();
        TabPublicComponent.Register();
        TabSearchComponent.Register();
        TabOwnComponent.Register();
        TabFavouriteComponent.Register();

        RoomComponent.Register();

    }

    public static LoadRoomList(list: string) {

    }

    public static Alert(title: string, message: string, button: string) {
        //@ts-ignore
        this.Container.$refs.alerts.create(title, message, button);
    }

}