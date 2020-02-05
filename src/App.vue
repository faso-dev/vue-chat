<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col class="col-lg-12 col-sm-12 col-md-12">
          <Chat/>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
  import Chat from './components/Chat';
  export default {
    name: 'App',
    components: {
      Chat,
    },

    data: () => ({
      //
    }),
  };
</script>
