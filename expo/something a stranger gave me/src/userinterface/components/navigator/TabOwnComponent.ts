import Vue from 'vue';
import EnterRoomComposer from '../../../networking/composers/EnterRoomComposer';

export default class TabOwnComponent {

    private static _component: any;

    public static Register() {
        TabOwnComponent._component = Vue.component('tab-ownroom-c', {

            data() {
                return {

                }
            },

            template: `

            <div v-if="this.$parent.isSelected('ownrooms')" class="navigator-content">
                <h6><slot></slot></h6>
                <p v-if="this.$root.room_list.ownrooms.length == 0" class="navi-tip">We couldn't find any rooms for this category right now.</p>

                <div class="room-list-container">

                    <ul>
                   
                        <li v-for="room in this.$root.room_list.ownrooms">
                            <span v-on:click="enterRoom(room.ID)">Go</span>
                            <p>{{ room.Name }}</p>
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
        return TabOwnComponent._component;
    }

}