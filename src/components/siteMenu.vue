<template>
<div>
  <v-list dense>
    <v-list-item>
      <v-list-item-action>
        <v-icon>mdi-home</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          <router-link :to="'/'">
            <h3>الرئيسية</h3>
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <h4 class="mr-2">البحث في:</h4>

    <v-list-item>
      <v-list-item-action>
        <v-icon>mdi-book-open-outline</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          <router-link :to="'/single-sura'">
            <h3>سورة</h3>
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
            <h3>مجموعة من  السور</h3>
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
            <h3>المصحف كاملاً</h3>
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
            <h3>المزيد..</h3>
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>     
      
    
	</div>
</template>

<script>

export default {
  components: {
  },

  data: () => ({
    drawer: false
  })
};
</script>