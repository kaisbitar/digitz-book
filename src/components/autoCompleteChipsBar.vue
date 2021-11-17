<template>
  <div class="d-flex">
    <v-chip-group class="autoChips black--text" mandatory show-arrows>
      <div v-for="(item, index) in chipsData" :key="index">
        <div :class="getClass(index)">
          <div class="d-flex labelsHolder mr-3">
            <span class="blue white--text pl-1 pr-1 ml-2">
              {{ item.resultsCount }}
            </span>
            <span
              class="green white--text pl-1 pr-1"
              v-if="item.parentSearch"
              v-html="item.parentSearch"
            ></span>
          </div>
          <v-chip
            @click.prevent="$emit('chipClicked', index)"
            @click:close="$emit('chipRemoved', index)"
            close-label
            close
          >
            {{ item.inputText }}
          </v-chip>
        </div>
      </div>
    </v-chip-group>
  </div>
</template>

<script>

export default {
  name: 'autoCompleteChipsBar',
  props: ['chipsData', 'selectedChipIndex'],
  components: {},
  data: () => ({}),
  methods: {
    getClass (index) {
      if (index === this.selectedChipIndex) return
      return 'notActive'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {}
}
</script>

<style>
.autoChips .v-chip__content {
  font-size: 16px;
  font-weight: bold;
}
.notActive {
  opacity: 0.2;
}
span.v-badge.theme--light {
  padding-right: 6px;
  margin-bottom: 12px;
}
.labelsHolder {
  width: max-content;
  font-size: 10px;
  position: absolute;
  z-index: 1;
}
</style>
