import Vue from 'vue';

export default class MeMenuComponent {

    private static _component: any;

    public static Register() {
        MeMenuComponent._component = Vue.component('memenu', {
            template: `

            <div v-show="this.$root.logged_in" class="me-menu">

                <slot></slot>
                                           
            </div>

            `
        })
    }

    static get Self() {
        return MeMenuComponent._component;
    }

}