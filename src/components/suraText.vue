<template>
<div>
  <v-row class="mr-1">
    <div class="mr-4"><strong>عدد الآيات: </strong>{{items.numberOfVerses}}</div>
    <div class="mr-4"><strong>عدد الكلمات: </strong> {{items.numberOfWords}}</div>
    <div class="mr-4"><strong>عدد الأحرف: </strong>{{items.numberOfLetters}}</div>
  </v-row>{{selectedVerse}}
  <v-btn @click="clicked()">
  </v-btn>
  <v-card
  class="suraBlock mt-1 pa-6 grey lighten-2 pt-2"
  id='suraBlock'
  herf='#suraBlock'
  outlined
  >
    <div 
      class="d-inline suraText"
       v-for="(item, index) in items.suraString" :key="index"
      :class="index-1"
    >
      <v-hover
        v-slot:default="{ hover }"
        close-delay="200"
      >
      <div 
        class="d-inline "
      >
        <v-card 
          v-show="showSura"
          class="d-inline "
          :color="hover ? 'grey lighten-4 black--text' : ' '"
          :class="{ 'activeVerse': index+1===verseNumber, 'notActive': index+1!==verseNumber, 'normalState': verseNumber===null }"
          flat
        >
          <div 
          :id="'v' + index"
          :href="'#v' + index"
          class="d-inline ml-2">
            {{item}}
            <div class="d-inline blue--text subtitle-2 mb-8 mr-n1">*</div>
            <div class="d-inline subtitle-2 mb-8">{{index+1}}</div>
          </div>
        <!-- <v-chip :href="'#v' + index" class=" indigo lighten-3" dark > -->
            <!-- <v-icon color="" class=" mr-n7">mdi-border-none-variant </v-icon> -->
         <!-- </v-chip> -->
        </v-card>

        </div>
      </v-hover>
      
    </div>
    
    <v-overlay
      :absolute=true
      :opacity=.5
      :value="isLoading"
    >
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
          
  </v-card>
</div>
</template>

<script>
// @ is an alias to /src
import { fetchSuraText } from "@/api/api.js";
import * as easings from 'vuetify/es5/services/goto/easing-patterns'

export default {
  name: "suraText",
  data: () => ({
    items:[],
    offset: 0,
    easing: 'easeInOutCubic',
    easings: Object.keys(easings),
    isActive:true,
    verseNumber: 1,
    isLoading:true,
    showSura:false
  }),
  components: { },
  computed:{  
    selectedVerse(){
      if(!isNaN(this.$store.state.targetedVerse)){
        var target = parseInt(this.$store.state.targetedVerse)-4
        let value = '#v' + target
        return value
      }
      else return 1
    },
    options () {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing,
      }
    }
  },
  methods: {
    fetchSura(){
      this.isLoading = true
      this.showSura = false
      let appApi = process.env.VUE_APP_API_URL;
      fetchSuraText(appApi, this.$store.state.fileName).then(items => {
        this.items = items
        

        // return items
      });
      this.$nextTick(() => {
        // if(isNaN(this.selectedVerse))return
      //   console.log(this.selectedVerse)
      // return

        if((this.selectedVerse == '#vNaN'))
        {
          
          return
        }
        console.log(this.selectedVerse)
        // this.$vuetify.goTo('#footer');
  });
    },
    clicked: function() {
    // this.show = true;
    console.log(this.selectedVerse)
    // return
    // var suraBlock = document.getElementsByClassName('suraBlock')
    // var elmnt = document.getElementById(this.selectedVerse);
    // elmnt.scrollIntoView();
    // this.$vuetify.goTo(this.selectedVerse)
    
}
},
  created(){
    this.fetchSura()
    this.verseNumber = this.$store.state.targetedVerse
  },
  updated(){
      if((this.selectedVerse  !== null))
      {
    this.$vuetify.goTo(this.selectedVerse, { container: '#suraBlock' })
    this.isLoading = false
            this.showSura = true
        // if((this.selectedVerse == '#vNaN'))return
        // else this.clicked()
        // this.$vuetify.goTo('#footer');

        // console.log(this.$vuetify.$refs.suraBlock)
        // console.log(this.$vuetify)
      }

  },
  mounted(){
        // this.$vuetify.goTo(this.selectedVerse)
 
    this.$store.watch(
      state => state.fileName,
      () => {
        this.fetchSura()  
    this.verseNumber = this.$store.state.targetedVerse

      }
    )
    
  }
  
};
</script>
<style scoped>
.v-chip.v-size--default {
  height: 17px;
}
.suraText{
  /* font-size:18px; */
}
.suraBlock{
  text-align: justify;
}
.activeVerse{
  background: yellow;
  /* color: ; */
}
.notActive{
  color: #ccc;
}
.normalState{
  color: black;
  background: #e0e0e0;
}
.starIcon{
  /* z-index:-1; */
}
#suraBlock{
    max-width: 800px;
    max-height: 450px;
    min-height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    margin: auto;
  }
</style>
