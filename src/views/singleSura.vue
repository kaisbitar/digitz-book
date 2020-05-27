<template>
  <div class="singleSura pa-10 pt-0 pb-0">
      <quranIndex/>
    <h1 class="text-center titeAndIndex">
      سورة {{this.$store.state.fileName}}
    </h1>

      <h5 class=" text-center mb-2 subtitle-1">بسم الله الرحمن الرحيم</h5>
    <!-- <div class="text-center">آية {{this.$store.state.targetedVerse}} </div> -->

    <suraText class='suraBlock'/>

  </div>
</template>

<script>
import quranIndex from '../components/quranIndex.vue'
import suraText from '../components/suraText.vue'

export default {
  name: 'App',
  components: {
    quranIndex,
    suraText
  },
  data: () => ({
  }),
  computed: { },
  methods: {
    resetTargetedVerse () {
      this.$store.state.targetedVerse = null
      this.$store.commit('setTargetedVerse', null)
    }
  }
}
</script>

<style scoped>
  .titeAndIndex{
    height: 48px;
  }

</style>
