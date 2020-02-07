<template>
    <v-app>
        <v-content>
            <v-app-bar
                    elevation="6"
                    height="80"
                    fixed
                    v-if="authAcces"
                    class="white"
            >
                <template>
                    <v-card
                            elevation="0"
                    >
                        <v-tabs
                                background-color="white"
                                show-arrows
                                color="primary"
                        >
                            <v-tabs-slider color="primary"/>

                            <v-tab
                                    v-for="u in onlineUsers"
                                    :key="u.id"
                                    :href="'#tab-' + u.id"

                            >
                                <v-badge
                                        :dot="true"
                                        :color="userOnline"
                                        style="letter-spacing: 1px"
                                >
                                    {{ u.username }}
                                    <span v-if="!!new Date(u.connectedAt)" class="posted-at font-weight-light font-size-10 " style="text-transform: lowercase; letter-spacing: 0"> {{ new Date(u.connectedAt) | moment("from", "now") | lower }}</span>
                                </v-badge>
                            </v-tab>
                        </v-tabs>
                    </v-card>
                </template>
            </v-app-bar>
            <v-container :class="{'mt-50' : authAcces}">
                <v-row v-if="showLoginForm">
                    <v-col cols="12" class="col-lg-12 col-sm-12 col-md-12">
                        <template>
                            <v-app id="inspire">
                                <v-content>
                                    <v-container
                                            class="fill-height"
                                            fluid
                                    >
                                        <v-row
                                                align="center"
                                                justify="center"
                                        >
                                            <v-col
                                                    cols="12"
                                                    sm="12"
                                                    md="12"
                                                    sx="12"

                                            >
                                                <v-card class="elevation-12">
                                                    <v-toolbar
                                                            color="primary"
                                                            dark
                                                            flat
                                                    >
                                                        <v-spacer/>
                                                        <v-toolbar-title class="text-center">Inscrivez vous
                                                        </v-toolbar-title>
                                                        <v-spacer/>
                                                    </v-toolbar>
                                                    <v-card-text>
                                                        <ValidationObserver v-slot="{ handleSubmit }">
                                                            <v-form
                                                                    @submit.prevent="handleSubmit(register)"
                                                            >
                                                                <ValidationProvider name="nom d'utilisateur"
                                                                                    rules="required|min:4|max:15|alpha"
                                                                                    v-slot="{ errors }">
                                                                    <v-text-field
                                                                            placeholder="Votre nom d'utilisateur"
                                                                            prepend-icon="mdi-account"
                                                                            v-model="joinUsername"
                                                                            type="text"
                                                                    />
                                                                    <span class="red--text">{{ errors[0] }}</span>
                                                                </ValidationProvider>
                                                                <ValidationProvider name="mot de passe"
                                                                                    rules="required|min:6|max:255"
                                                                                    v-slot="{ errors }">
                                                                    <v-text-field
                                                                            v-model="joinUserPassword"
                                                                            placeholder="Votre mot de passe"
                                                                            prepend-icon="mdi-lock"
                                                                            type="password"
                                                                    />
                                                                    <span class="red--text">{{ errors[0] }}</span>
                                                                </ValidationProvider>
                                                                <v-card-actions>
                                                                    <v-spacer/>
                                                                    <v-btn type="submit" color="primary">Joindre le
                                                                                                         chat
                                                                    </v-btn>
                                                                </v-card-actions>
                                                            </v-form>
                                                        </ValidationObserver>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-content>
                            </v-app>
                        </template>
                    </v-col>
                </v-row>
                <v-row v-if="!showLoginForm">
                    <v-col
                            v-if="!authAcces"
                            class="col-lg-12 col-sm-12 col-md-12 mt-50">

                        <v-skeleton-loader
                                v-for="i in 10"
                                :key="i"

                                :type="type"
                                :tile="tile"
                                class="mx-auto"
                        />
                    </v-col>

                    <v-col
                            v-if="authAcces"
                            cols="12"
                            class="col-lg-12 col-sm-12 col-md-12 mt-50">

                        <v-card

                                elevation="0"
                        >
                            <v-card-title
                            >
                                <h4>{{ messages.length }} message(s)</h4>
                                <v-spacer/>
                                <small v-if="isTyping" class="red--text font-weight-light">{{ isTypingUser }} est
                                                                                           entrain d'écrire...</small>
                            </v-card-title>
                            <div
                                    class="chat-scroll-view"
                                    id="chat-listing-container"
                            >
                                <v-row
                                        v-for="m in messages"
                                        :key="m.id"
                                >
                                    <v-col class="col-lg-12">
                                        <v-card
                                                elevation="0"
                                                class="ma-2 conversation-card"
                                                color="white"
                                                :class="{'float-right' : m.user.id === user.id, 'float-left': m.user.id !== user.id}"
                                                max-width="400"
                                        >
                                            <v-card-actions>
                                                <v-list-item>
                                                    <v-list-item-avatar>
                                                        <v-img
                                                                src="../assets/user-avatar.png"
                                                        />
                                                    </v-list-item-avatar>
                                                    <v-list-item-content>
                                                        <v-list-item-title>
                                                            {{ m.user.id !== user.id ? m.user.username : 'Moi' }}
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-card-actions>
                                            <v-card-text>
                                                {{ m.content }}
                                            </v-card-text>
                                            <v-card-actions>
                                                <span v-if="!!new Date(m.createdAt)" class="posted-at font-weight-light font-size-10 letter-sapcing-0"> {{ new Date(m.createdAt) | moment("from", "now") }}</span>
                                                <span v-else class="posted-at font-weight-light font-size-10 letter-sapcing-0"> many day ago </span>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row
                        class="mt-5"
                        v-if="authAcces"
                >
                    <v-col
                            class="col-lg-12 col-sm-12 col-md-12"
                    >
                        <ValidationObserver v-slot="{ handleSubmit }">
                            <v-form
                                    @submit.prevent="handleSubmit(send)"
                                    style="position: relative!important;
                                    bottom: 0!important;
                                    left: 0!important;
                                    right: 0!important;
                                    z-index: 10000;
                                    margin: auto!important;"
                            >
                                <ValidationProvider name="message"
                                                    rules="min:2|max:100000"
                                                    v-slot="{ errors }">
                                    <v-textarea
                                            @keyup.enter="handleSubmit(send)"
                                            v-model="newMessage"
                                            placeholder="Tapez votre message maintenant"
                                            class="col-lg-12 col-sm-12 col-md-12"
                                            required
                                            rounded
                                            :outlined="true"
                                            rows="1"
                                    />
                                    <span class="red--text">{{ errors[0] }}</span>
                                </ValidationProvider>
                            </v-form>
                        </ValidationObserver>
                    </v-col>
                </v-row>
                <v-snackbar
                        v-for="u in joinUsers"
                        :key="u.connectedAt"
                        v-model="snackbar"
                        :bottom="true"
                        :color="u.color"
                        :timeout="10000"
                        :top="true"
                >
                    {{ u.name }} {{ u.type }}
                    <v-btn
                            dark
                            text
                            @click="snackbar = false"
                    >
                        Close
                    </v-btn>
                </v-snackbar>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    import bcrypt from "bcryptjs";
    import iniqid from 'uniqid';
    import $ from 'jquery';

    export default {
        name: 'Chat',
        data() {
            return {
                userOnline: '#008000',
                tile: false,
                type: 'list-item-avatar-three-line',
                user: {
                    id: '',
                    username: '',
                    connectedAt: '',
                    token: '',
                },
                authAcces: false,
                showLoginForm: false,
                joinUsername: '',
                joinUserPassword: '',
                newMessage: '',
                snackbar: false,
                message: {
                    id: '',
                    user: '',
                    content: '',
                    createdAt: ''
                },
                online: 0,
                onlineUsers: [],
                joinUsers: [],
                isConnected: false,
                messages: [],
                isTyping: false,
                isTypingUser: '',

            }
        },
        sockets: {
            connect() {
                // Fired when the socket connects.
                this.isConnected = true;
            },

            disconnect() {
                this.isConnected = false;
            },
            sendMessage(data) {
                this.messages.push(data);
                this.updateUserMessages();
                this.scrollToTheLastMessage();
            },
            updateOnlineUsers() {
                this.online += 1;
            },
            joinChat(data) {
                this.onlineUsers = Object.assign([], this.onlineUsers.filter(user => user.id !== data.user.id));
                this.onlineUsers.unshift(data.user);
                this.joinUsers.unshift({
                    color: data.color,
                    type: data.type,
                    name: data.user.username,
                    connectedAt: data.connectedAt
                });
                setTimeout(() => {
                    this.joinUsers = [];
                }, 5000)
            },
            unJoinChat(data) {
                this.updateOnlineUsersWhenUserDisconnect();
                this.onlineUsers = Object.assign([], this.onlineUsers.filter(u => u.id !== data.user.id));
                this.joinUsers.unshift({
                    color: data.color,
                    type: data.type,
                    name: data.user.username,
                    connectedAt: data.connectedAt
                });
                setTimeout(() => {
                    this.joinUsers = [];
                }, 2000);
            },
            typingNotification(data) {
                this.isTyping = data.isTyping;
                this.isTypingUser = data.user;
            }
        },
        watch: {
            newMessage(value) {
                this.$socket.emit('typingNotification', {isTyping: !!value, user: this.user.username});
            },

        },
        mounted() {
            this.leaveChat();
            setTimeout(this.scrollToTheLastMessage, 5000);
        },
        created() {
            this.login();
        },
        filters: {
            lower:  value => {
                if (!value) return '';
                return value.toString().toLowerCase()
            }
        },
        methods: {
            //When user register
            register() {
                this.user = Object.assign({}, {
                    id: iniqid(),
                    username: this.joinUsername,
                    connectedAt: Date.now(),
                    token: bcrypt.hashSync(this.joinUserPassword, 12)
                });
                window.localStorage.setItem('_FSDV_USER_', JSON.stringify({
                    info: this.user,
                    _pass: this.joinUserPassword
                }));
                this.authAcces = true;
                this.showLoginForm = false;
                this.snackbar = true;
                this.setJoinNotification();
            },
            //Update user message
            updateUserMessages() {
                window.localStorage.setItem('_FSDV_SESSION_MESSAGES', JSON.stringify(this.messages))
            },
            //Load user old messages
            loadUserMessages() {
                this.messages = Object.assign([], JSON.parse(window.localStorage.getItem('_FSDV_SESSION_MESSAGES')) || [])
            },
            //When user loging
            async login() {
                let _token = window.localStorage.getItem('_FSDV_USER_');
                let user = JSON.parse(_token);
                if (user && user._pass && user.info && user.info.token) {
                    const match = await bcrypt.compare(user._pass, user.info.token);
                    if (match) {
                        this.authAcces = true;
                        this.showLoginForm = false;
                        this.snackbar = true;
                        this.user = Object.assign({}, user.info);
                        this.user.connectedAt = Date.now();
                        let sessionToken = window.localStorage.getItem('_FSDV_SESSION_') || null;
                        this.onlineUsers.unshift(this.user);
                        this.loadUserMessages();
                        if (!sessionToken) {
                            window.localStorage.setItem('_FSDV_SESSION_', iniqid());
                            this.setJoinNotification();
                            this.onlineUserCountUpdate();
                        }
                    } else {
                        this.showLoginForm = true;
                    }
                } else {
                    this.showLoginForm = true;
                }
            },
            //When user disconnected
            leaveChat() {
                window.onbeforeunload = () => {
                    if (this.user.id) {
                        this.updateOnlineUsersWhenUserDisconnect();
                        this.setUnjoinNotification();
                        window.localStorage.removeItem('_FSDV_SESSION_');
                    }
                }
            },
            //Update the online number connected when user leaved
            updateOnlineUsersWhenUserDisconnect() {
                this.online !== null && this.online > 0 ? this.online -= 1 : this.online = 0;
            },
            //Send a message
            send() {
                this.message.id = iniqid();
                this.message.content = this.newMessage;
                this.message.user = this.user;
                this.message.createdAt = Date.now();
                this.$socket.emit('sendMessage', this.message);
                this.message.myself = true;
                this.messages.push(this.message);
                this.clear();
                this.scrollToTheLastMessage();
                this.updateUserMessages();
            },
            //Update online user number
            onlineUserCountUpdate() {
                this.online += 1;
                this.$socket.emit('updateOnlineUsers');
            },
            //Reset the message textarea field
            clear() {
                this.newMessage = null;
                this.message = {}
            },
            //Display a notification when a user is connected
            setJoinNotification() {
                this.$socket.emit('joinChat', {
                    connectedAt: Date.now(),
                    color: 'success',
                    user: this.user,
                    type: 'vient de se connecter'
                });
            },
            userExist() {
                return this.onlineUsers.findIndex(u => u.id === this.user.id);
            },
            //Display a notification when a user is disconnected
            setUnjoinNotification() {
                this.$socket.emit('unJoinChat', {
                    connectedAt: Date.now(),
                    color: 'error',
                    user: this.user,
                    type: 'vient de se deconnecter'
                })
            },
            scrollToTheLastMessage() {
                let container = this.$el.querySelector('#chat-listing-container');
                if(container !== undefined && container !== null){
                    $(container).scrollTop($(container)[0].scrollHeight);
                }

            }
        }
    };
</script>
<style scoped>
    .conversation-card {
        border-radius: 20px 0 20px 0 !important;
        box-shadow: 2px -2px 10px 10px whitesmoke !important;
        -moz-box-shadow: 2px -2px 10px 10px whitesmoke !important;
        -webkit-box-shadow: 2px -2px 10px 10px whitesmoke !important;
    }

    .box-shadow {
        box-shadow: 5px -2px 10px 10px whitesmoke !important;
    }

    .mt-50 {
        margin-top: 30px !important;
    }
    .posted-at{
        color: #ff0000;
    }
    .letter-sapcing-0{
        letter-spacing: 0;
    }
    .user-online{
        color: #008000;
    }
    .font-size-10{
        font-size: 10px!important;
    }
    .chat-scroll-view {
        overflow: hidden;
        overflow-y: scroll;
        height: 460px;
        padding-bottom: 203px !important;
    }
</style>
