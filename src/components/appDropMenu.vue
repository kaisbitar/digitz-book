<template>
  <div class="text-center">
    <label @click="show"><v-icon > mdi-dots-horizontal </v-icon></label>
    <v-menu
      offset-y
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
    >
      <v-list>
        <v-list-item
          @click="handleClick(item)"
          class="menuItem"
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: ['items'],
  data: () => ({
    showMenu: false,
    x: 0,
    y: 0
  }),
  methods: {
    handleClick (item) {
      if (item.instuction === 'cancel') return
      this.$emit('itemClicked', item)
    },
    show (e) {
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
    }
  }
}
</script>
<style scoped>
.menuItem:hover {
  background: #bbdefb !important;
  cursor: pointer;
  color: white !important;
}
</style>
