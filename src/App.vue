<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app right>
      <siteMenu/>
    </v-navigation-drawer>
    <v-app-bar app color="#BBDEFB" >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title >الكتاب المرقوم</v-toolbar-title>
      </div>
        <v-text-field
          label="ابحث عن سورة أو آية أو كلمة أو حرف أو رقم في الكتاب"
          single-line
          class="mr-12 mt-2"
        ></v-text-field>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>

    
    <v-footer>All rights reserved @2020</v-footer>
  </v-app>
</template>

<script>
import siteMenu from "./components/siteMenu.vue";

export default {
  name: "App",

  components: {
    siteMenu
  },

  data: () => ({
    drawer: false
  })
};
</script>
