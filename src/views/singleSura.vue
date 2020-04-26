<template>
  <div class="singleSura">
    <h1>سورة {{this.$store.state.fileName}}</h1>
    
    <quranIndex/>

  </div>
</template>


<script>
import quranIndex from "../components/quranIndex.vue";

export default {
  name: "App",
  components: {
    quranIndex
  },
  data: () =>({
  }),
  computed:{  },
  methods:{ }
}
</script>