import Vue from 'vue';

export default class MainMenuComponent {

    private static _component: any;

    public static Register() {
        MainMenuComponent._component = Vue.component('mainmenu', {
            template: `
            
            <div class="menu-main">
                <div v-on:click="toggleNavi()" class="menu-image-element menu-navigator"></div>
            </div>   
            
            `,

            methods: {
                toggleNavi: function() {
                    (this.$root as any)["navigator_open"] = !(this.$root as any)["navigator_open"];
                }
            }
        });
    }

    static get Self() {
        return MainMenuComponent._component;
    }

}