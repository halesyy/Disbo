import Vue from 'vue';

export default class HotelviewComponent {

    private static _component: any;

    public static Register() {
        HotelviewComponent._component = Vue.component('hotelview', {
            template: `
            
            <div v-if="!this.$parent.in_room" class="hotelview">
            </div>
            
            `
        })
    }

    static get Self() {
        return HotelviewComponent._component;
    }

}