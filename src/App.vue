<template>
  <v-app>
    
    <v-navigation-drawer v-model="drawer" app right>
      <siteMenu/>
    </v-navigation-drawer>

    <v-app-bar app :height="100" color="#BBDEFB" >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title >الكتاب المرقوم</v-toolbar-title>
      </div>
      <autoComplete/>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
    
    <v-footer id="footer" href="#footer">All rights reserved @2020</v-footer>
  </v-app>
</template>

<script>
import siteMenu from "./components/siteMenu.vue";
import autoComplete from "./components/autoComplete.vue";

export default {
  name: "App",

  components: {
    siteMenu,
    autoComplete
  },

  data: () => ({
    drawer: false
  })
};
</script>

<style lang="scss">
  @import 'styles/styles.scss';

  .v-application{
    font-family: $body-font-family !important;
  }
  .v-btn {
    letter-spacing: 0px !important;
  }
  a {
    text-decoration: none;
  }
</style>