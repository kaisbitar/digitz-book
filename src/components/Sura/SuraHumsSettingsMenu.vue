<template>
  <v-menu location="top" :close-on-content-click="false">
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        icon="mdi-tune"
        variant="text"
        size="small"
        title="إعدادات التشغيل"
      />
    </template>
    <!-- A fixed width and height for the whole panel, so neither tab can resize
         it and nothing inside needs horizontal scrolling. The longer tab scrolls
         vertically inside the same box. -->
    <v-list
      density="compact"
      class="pa-3 hums-settings"
    >
      <v-tabs v-model="tab" density="compact" align-tabs="center" class="mb-2">
        <v-tab value="speed">سرعة</v-tab>
        <v-tab value="sound">صوت</v-tab>
      </v-tabs>
      <div class="hums-settings-body">
        <SuraHumsSpeedTab
          v-if="tab === 'speed'"
          v-model:tone-on="toneOn"
          :timing="timing"
          :mode="mode"
        />
        <SuraHumsSoundMenu v-else v-model:volume="volume" :tune="soundTune" />
      </div>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref } from "vue"
import SuraHumsSpeedTab from "./SuraHumsSpeedTab.vue"
import SuraHumsSoundMenu from "./SuraHumsSoundMenu.vue"

defineProps({
  // The player's live settings; reactive() unwraps their refs, so the tabs read
  // and write the player's own values.
  timing: { type: Object, required: true },
  mode: { type: String, required: true },
  soundTune: { type: Object, required: true },
})

const volume = defineModel("volume", { type: Number, required: true })
// Whether the fixed reference tone replaces the verse's own sound.
const toneOn = defineModel("toneOn", { type: Boolean, required: true })

const tab = ref("speed")
</script>

<style scoped>
/* Vuetify's list has no width of its own, so both tabs agree on one here. */
.hums-settings {
  width: 360px;
  max-width: 92vw;
  overflow-x: hidden;
}
.hums-settings-body {
  /* Tall enough for the longest tab, short enough to fit a laptop screen.
     `clip` rather than `auto`: the slider thumb ripple pokes a few pixels past
     the edge, which would otherwise give the panel a horizontal scrollbar. */
  height: min(58vh, 520px);
  overflow: hidden auto;
  /* Room for the thumb halo at either end of a slider. The halo is wider than
     the track inset Vuetify gives, so without this the end thumb looks cut. */
  padding-inline: 12px;
}
</style>
