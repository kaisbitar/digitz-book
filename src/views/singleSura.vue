<template>
  <div class="singleSura">
    <h1 class="text-center">سورة {{this.$store.state.fileName}}</h1>
    <h1 class="text-center">آية {{this.$store.state.targetedVerse}}</h1>
    
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