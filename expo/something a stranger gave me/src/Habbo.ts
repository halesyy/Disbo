import Networker from './networking/Networker';
import AssetHandler from './assets/AssetHandler';
import Room from './room/Room';
import UserInterface from './userinterface/UserInterface';
import GetRequest from './util/GetRequest';
import SingleSignOnComposer from './networking/composers/SingleSignOnComposer';
import EventListener from './util/EventListener';

export default class Habbo {

  private static _sso: any = GetRequest("sso");

  private static _assetHandler: AssetHandler;
  private static _networker: Networker;

  // Is null when not in any room
  private static _room: Room;

  static get SSO() {
    return Habbo._sso;
  }

  static get Assets() {
    return this._assetHandler;
  }

  static set Room(room: Room) {
    Habbo._room = room;
  }

  static get Room() {
    return Habbo._room;
  }

  public static GetNetworker() {
    return Habbo._networker;
  }

  public static Preload() {
    Habbo._assetHandler = new AssetHandler();
  }

  public static OnPreloadFinish() {
    Habbo.Init();
  }

  public static Init() {

    EventListener.Listen();
    Habbo._networker = new Networker();
    UserInterface.Prepare();

  }

  public static Authenticate() {
    UserInterface.Prepare();
  }


}