<template>
    <v-content>
        <v-snackbar
                v-for="user in joinUsers"
                :key="user.connectedAt"
                v-model="snackbar"
                :bottom="true"
                :color="user.color"
                :timeout="10000"
                :top="true"
        >
            {{ user.name }} {{ user.type }}
            <v-btn
                    dark
                    text
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
        <v-row v-if="!hasUsername">
            <v-col cols="12" class="col-lg-12 col-sm-12 col-md-12">
                <v-form
                        @submit.prevent="setUsername">
                    <v-text-field
                            v-model="username"
                            placeholder="Entrer votre nom d'utilisateur"
                            class="col-lg-12 col-sm-12 col-md-12"
                            required
                    />
                </v-form>

            </v-col>
        </v-row>
        <v-row v-if="hasUsername">
            <v-col

                    cols="12"
                    class="col-lg-12 col-sm-12 col-md-12">
                <v-card

                        elevation="0"
                >
                    <v-card-title

                            class="white box-shadow"
                            dark
                    >
                        <h4 class="primary--text">Liste des conversations</h4>
                        <v-spacer/>
                        <small v-if="isTyping" class="red--text">{{ isTypingUser }} entrain d'écrire...</small>
                    </v-card-title>
                    <v-content
                            id="chat-listing-container"
                            class="chat-scroll-view"
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
                                        :class="{'float-right' : m.myself, 'float-left': !m.myself}"
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
                                                <v-list-item-title>{{ !m.myself ? m.username : 'Moi' }}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card-actions>
                                    <v-card-text>
                                        {{ m.content }}
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-content>

                </v-card>
            </v-col>
        </v-row>
        <v-row
                v-if="hasUsername"
        >
            <v-col
                    class="col-lg-12 col-sm-12 col-md-12 v-bottom-navigation--fixed"
                    style="position: relative!important; bottom: 0!important; top: 0!important;">
                <v-form
                        @submit.prevent="send"
                        fixed
                >
                    <v-textarea
                            @keyup.enter="send"
                            v-model="newMessage"
                            placeholder="Tapez votre message maintenant"
                            class="col-lg-12 col-sm-12 col-md-12"
                            required
                            rows="3"
                    />
                </v-form>
            </v-col>
        </v-row>
    </v-content>
</template>

<script>
    export default {
        name: 'Chat',
        data() {
            return {
                username: '',
                newMessage: '',
                snackbar: false,
                message: {
                    id: '',
                    username: '',
                    content: '',
                    myself: false
                },
                onlineUsers: 0,
                joinUsers: [],
                isConnected: false,
                socketMessage: '',
                hasUsername: false,
                messages: [],
                isTyping: false,
                isTypingUser: '',
                /* dictionary: {
                     attributes: {
                         username: 'E-mail Address',
                         // custom attributes
                     },
                     custom: {
                         username: {
                             required: () => 'Le nom d\'utilisateur est obligatoire',
                             max: 'Votre nom d\'utilisateur ne doit dépasser les 20 caractères',
                             min: 'Votre nom d\'utilisateur doit faire au moins les 4 caractères',
                             // custom messages
                         },
                         message: {
                             required: () => 'Votre message ne peut être vide',
                             max: 'Votre nom message ne doit dépasser les 10000 caractères',
                             min: 'Votre nom message doit faire au moins 2 caractères',
                         },
                     },
                 },*/
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
            updateOnlineUsers(data) {
                this.onlineUsers = data;
            },
            sendMessage(data) {
                this.messages.push(data);
                let container = this.$el.querySelector("#chat-listing-container");
                container.scrollTop = container.scrollHeight + 190;
            },
            joinChat(data) {
                this.joinUsers.unshift(data);
                setTimeout(() => {
                    this.joinUsers = [];
                }, 5000)
            },
            unJoinChat(data) {
                this.joinUsers.unshift(data);
                setTimeout(() => {
                    this.joinUsers = [];
                }, 5000);
            },
            typingNotification(data) {
                this.isTyping = data.isTyping;
                this.isTypingUser = data.user;
            }
        },
        watch: {
            newMessage(value) {
                this.$socket.emit('typingNotification', {isTyping: !!value, user: this.username});
            },

        },
        methods: {
            setOnlineUsers(data) {
                this.$socket.on('updateOnlineUsers', data);
            },
            setUsername() {
                this.message.username = this.username;
                this.hasUsername = !this.hasUsername;
                this.snackbar = true;
                this.$socket.emit('joinChat', {
                    connectedAt: Date.now(),
                    color: 'success',
                    name: this.username,
                    type: 'vient de se connecter'
                })
            },
            unJoinChat() {
                window.onbeforeunload = () => {
                    this.$socket.emit('unJoinChat', {
                        connectedAt: Date.now(),
                        color: 'danger',
                        name: this.username,
                        type: 'vient de se deconnecter'
                    })
                }
            },
            send() {
                this.message.id = Date.now();
                this.message.content = this.newMessage;
                this.message.username = this.username;
                this.$socket.emit('sendMessage', this.message);
                this.message.myself = true;
                this.messages.push(this.message);
                this.clear();
                let container = this.$el.querySelector("#chat-listing-container");
                container.scrollTop = container.scrollHeight + 190;
            },
            clear() {
                this.newMessage = null;
                this.message = {}
            },
        }
    };
</script>
<style scoped>
    .conversation-card {
        border-radius: 20px 0 20px 0!important;
        box-shadow: 2px -2px 10px 10px whitesmoke !important;
    }

    .box-shadow {
        box-shadow: 2px -2px 10px 10px whitesmoke !important;
    }

    .chat-scroll-view {
        overflow: hidden;
        overflow-y: scroll;
        overflow-style: unset;
        height: calc(100vh - 300px);
    }
</style>
