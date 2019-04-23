import Vue from 'vue';

export default class BtnBoldComponent {

    private static _component: any;

    public static Register() {
        BtnBoldComponent._component = Vue.component('btn-bold', {

            data() {
                return {
                }
            },

            template: `

                <div class="inline-block btn-handle">
                    <div class="btn-bold-left"></div>
                    <div class="btn-bold-center"><slot></slot></div>
                    <div class="btn-bold-right"></div>
                </div>
            
            `,

            methods: {

            }
        });        

    }

    static get Self() {
        return BtnBoldComponent._component;
    }

}