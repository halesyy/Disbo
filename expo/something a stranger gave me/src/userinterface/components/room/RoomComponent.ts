import Vue from 'vue';
import Habbo from '../../../Habbo';
import EventListener from '../../../util/EventListener';

export default class RoomComponent {

    private static _component: any;

    public static Register() {
        RoomComponent._component = Vue.component('room', {

            data() {
                return {
                    
                }
            },

            template: `
            
            <canvas v-on:click="click($event)" @mouseleave="mouseOn(false)" @mouseover="mouseOn(true)" v-show="this.$parent.in_room" id="room"></canvas>
            
            `,

            methods: {
                mouseOn(state: boolean) {
                    if(!EventListener.isPressedDown)
                        Habbo.Room.RoomRenderer.DraggAble = state;
                },

                click(event: any) {
                    if(new Date().getTime() - 200 >= EventListener.lastMouseDownTime.getTime())
                        return;
                    
                    Habbo.Room.Click(event);
                }
            }
        })
    }

    static get Self() {
        return RoomComponent._component;
    }

}