import Vue from 'vue';

export default class ChatComponent {

    private static _component: any;

    public static Register() {
        ChatComponent._component = Vue.component('chat', {
            template: `
            
            <div class="menu-chat"></div>
            
            `
        })
    }

    static get Self() {
        return ChatComponent._component;
    }

}