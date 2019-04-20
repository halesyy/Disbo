import Vue from 'vue';
import LoginComposer from '../../../networking/composers/LoginComposer'
import RegisterComposer from '../../../networking/composers/RegisterComposer'
import UserInterface from '../../UserInterface';

export default class LoginComponent {

    private static _component: any;

    public static Register() {
        LoginComponent._component = Vue.component('login', {

            data() {
                return {
                    'connecting': false,
                    'connectionString': 'Connecting',
                    'username': "",
                    'password': "",
                    'registerModule': false
                }
            },

            template: `

                <div v-if="!this.$root.logged_in" class="login-container">


                    <div v-if="!registerModule" class="register-link">
                        <span class="register-title">First time here?</span>
                        <span v-on:click="registerModule = true" class="register-text">Haven't got a Habbo yet?<br><u>You can create one here.</u></span>
                    </div>

                    <div v-if="!registerModule" class="login">

                        <span class="login-title">What's your Habbo called?</span>
                        <span class="login-input-label">Name of your Habbo</span>
                        <input v-on:keyup.enter="login()" type="text" v-model="username" autofocus></input>

                        <span class="login-input-label">Password</span>
                        <input v-on:keyup.enter="login()" type="password" v-model="password"></input>

                        <div>
                            <div v-if="!connecting" @click="login()" class="inline-block">
                                <btn-bold>OK</btn-bold>
                            </div>   
                            
                            <span v-if="connecting" class="connecting" >{{ connectionString }}</span>
                        </div>                    
                        
                    </div>

                    <div v-if="registerModule" class="login" style="margin-top: 131px">

                        <span class="login-title">Create your Habbo</span>
                        <span class="login-input-label">Name of your Habbo</span>
                        <input v-on:keyup.enter="register()" type="text" v-model="username" autofocus></input>

                        <span class="login-input-label">Password</span>
                        <input v-on:keyup.enter="register()" type="password" v-model="password"></input>

                        <div>
                            <div v-if="!connecting" @click="registerModule = false" class="inline-block">
                                <btn-bold>CANCEL</btn-bold>
                            </div>

                            <div v-if="!connecting" @click="register()" class="inline-block">
                                <btn-bold>REGISTER</btn-bold>
                            </div>    
                            
                            <span v-if="connecting" class="connecting" >{{ connectionString }}</span>
                        </div>                    
                        
                    </div>

                </div>
            
            `,

            methods: {
                login() {

                    if(!this.username || !this.password) {
                        UserInterface.Alert('Notice!', 'You must enter a username and password', '');
                        return;
                    }

                    this.connecting = true;
                    new LoginComposer(this.username, this.password);
                },

                register() {

                    if(!this.username || !this.password) {
                        UserInterface.Alert('Notice!', 'You must enter a username and password', '');
                        return;
                    }

                    this.connecting = true;
                    new RegisterComposer(this.username, this.password);
                },

                retry() {
                    this.connecting = false;
                }
            },

            mounted() {
                let self = this;
                let connectionStringInterval = setInterval(() => {
                    if(self.connectionString === 'Connecting') {
                        self.connectionString = 'Connecting.';
                    }
                    else if(self.connectionString === 'Connecting.') {
                        self.connectionString = 'Connecting..';
                    }
                    else if(self.connectionString === 'Connecting..') {
                        self.connectionString = 'Connecting...';
                    }
                    else if(self.connectionString === 'Connecting...') {
                        self.connectionString = 'Connecting';
                    }
                }, 500);
            },

            destroyed() {

            }
        });        

    }

    static get Self() {
        return LoginComponent._component;
    }

}