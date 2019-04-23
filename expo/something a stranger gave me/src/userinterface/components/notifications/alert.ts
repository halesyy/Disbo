import Vue from 'vue';
import shortid from 'shortid';

export default class AlertComponent {

    private static _component: any;

    public static Register() {
        AlertComponent._component = Vue.component('alert', {

            data() {
                return {
                    "alerts": []
                }
            },

            props: {
                title: String,
                message: String,
                button: String
            },

            template: `
                <div>

                    <div :id="alert.uid" class="alert" v-for="alert in this.alerts">
                        
                        <div @click="close(alert.uid)" class="navigator-close"></div>
                        <div v-draggable :data-ref="alert.uid" class="alert-top"><center><span>{{ alert.title }}</span></center></div>
                        <div class="alert-middle">
                        
                            <p>{{ alert.message }}</p>

                            <center>
                                <div @click="close(alert.uid)" class="inline-block top-15">
                                    <btn-bold>{{ alert.button || 'OK' }}</btn-bold>
                                </div>
                            </center>     
                        
                        </div>
                        <div class="alert-bottom"></div>              
                
                    </div>

                </div>

            
            `,

            methods: {
                close(uid) {
                    this.alerts.splice(this.alerts.findIndex(item => item.uid === uid), 1)
                },

                create(title, message, button) {
                    this.alerts.push({
                        uid: shortid.generate(),
                        title: title,
                        message: message,
                        button: button
                    })
                }
            },

            mounted() {
                
            },

            destroyed() {

            }
        });        

    }

    static get Self() {
        return AlertComponent._component;
    }

}