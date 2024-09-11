<template>
  <div class="text-center">
    <label class="detailIcon" @click="show"><v-icon> mdi-dots-horizontal </v-icon></label>
    <v-menu offset-y v-model="showMenu" :position-x="x" :position-y="y" absolute>
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

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps(['items'])
const emit = defineEmits(['itemClicked'])

const showMenu = ref(false)
const x = ref(0)
const y = ref(0)

const handleClick = item => {
  if (item.instuction === 'cancel') return
  emit('itemClicked', item)
}

const show = e => {
  e.preventDefault()
  showMenu.value = false
  x.value = e.clientX
  y.value = e.clientY
  nextTick(() => {
    showMenu.value = true
  })
}
</script>

<style scoped>
.menuItem:hover {
  background: #bbdefb !important;
  cursor: pointer;
  color: white !important;
}
.detailIcon {
  border: 1px solid;
  border-radius: 15px;
  width: 27px;
}
.detailIcon:hover {
  background: #ccc;
}
</style>
