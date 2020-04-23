<template>
  <v-app>
    
    <siteMenu/>
    <v-content>
        <router-view/>
      <!-- <HelloWorld /> -->
    </v-content>
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
