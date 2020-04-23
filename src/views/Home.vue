<template>
  <div class="home">
    <h1>البحث على مستوى:</h1>
    <router-link :to="'/sura'">
      <h3>السورة</h3>
    </router-link>

    <router-link :to="'/allSuras'">
      <h3>مجموعة من السور</h3>
    </router-link>
    
    <router-link :to="'/quran'">
      <h3>كامل مساحة المصحف</h3>
    </router-link>
    
    <router-link :to="'/search'">
      <h3>الجملة أو العبارة أو الكلمة</h3>
    </router-link>




  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {  }
};
</script>
