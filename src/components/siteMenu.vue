<template>
<div>
	<v-navigation-drawer v-model="drawer" app right>
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

        <h3>البحث على مستوى:</h3>

        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-book-open-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link :to="'/sura'">
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
              <router-link :to="'/allSuras'">
                <h3>مجموعة من السور</h3>
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
              <router-link :to="'/quran'">
                <h3>كامل مساحة المصحف</h3>
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
                <h3>جملة أو عبارة أو كلمة</h3>
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>     
      
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title >الكتاب المرقوم</v-toolbar-title>
      </div>
        <v-text-field
          label="ابحث عن كلمة أو رقم في المصحف"
          single-line
          class="mr-12 mt-2"
        ></v-text-field>
      <v-spacer></v-spacer>
    </v-app-bar>
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