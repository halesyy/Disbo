import Vue from 'vue';
import EnterRoomComposer from '../../../networking/composers/EnterRoomComposer';

export default class TabPublicComponent {

    private static _component: any;

    public static Register() {
        TabPublicComponent._component = Vue.component('tab-public-c', {

            data() {
                return {

                }
            },

            template: `

            <div v-if="this.$parent.isSelected('public')" class="navigator-content">
                <h6><slot></slot></h6>

                <p v-if="this.$root.room_list.public.length == 0" class="navi-tip">We couldn't find any rooms for this category right now.</p>
                
                <div class="room-list-container">

                    <ul>
                    
                        <li v-for="room in this.$root.room_list.public">
                            <span v-on:click="enterRoom(room.uid)">Go</span>
                            <p>{{ room.name }}</p>
                        </li>


                    </ul>

                </div>

            </div>       
            
            `,

            methods: {
                enterRoom(id: number) {
                    new EnterRoomComposer(id);
                }
            }
        });        

    }

    static get Self() {
        return TabPublicComponent._component;
    }

}