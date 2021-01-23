<template>
<div>
  <!-- <v-list dense class="mainWrap">
    <v-list-item>
      <v-list-item-action>
        <v-icon>mdi-home</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          <router-link :to="'/'">
            <h4>الرئيسية</h4>
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item> -->

    <!-- <h4 class="mr-2">البحث في:</h4> -->
<!--
    <v-list-item>
      <v-list-item-action>
        <v-icon>mdi-book-open-outline</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          <router-link :to="'/single-sura'">
            <h4>سورة</h4>
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-action>
        <v-icon>mdi-book-open-outline</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          <router-link :to="'/group-of-suras'">
            <h4>مجموعة من  السور</h4>
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-action>
        <v-icon>mdi-book-open-outline</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          <router-link :to="'/full-book'">
            <h4>المصحف كاملاً</h4>
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-action>
        <v-icon>mdi-book-open-outline</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          <router-link :to="'/search'">
            <h4>المزيد..</h4>
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list> -->

</div>
</template>

<script>

export default {
  name: 'siteMenu',
  components: {
  },

  data: () => ({
    drawer: false
  })
}
</script>

<style >
.mainWrap a{
  color: #000009 !important;
}
</style>
