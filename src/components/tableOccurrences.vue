<template>
  <div>
    <v-text-field
      :label="'ابحث ' + dataType"
      v-model="search"
      append-icon="mdi-magnify"
      class="mb-1 mr-1 pa-3 searchField rounded mt-1"
      background-color="grey lighten-5 mb-0"
      single-line
      hide-details
      autofocus
      clearable
      clear-icon="mdi-close"
      @click:close="collapseHeaders()"
    ></v-text-field>
    <v-data-table
      :items="tableData"
      :headers="tableHeaders"
      :items-per-page="75"
      :search="search"
      :height="getHeight()"
      :footer-props="footerProps"
      :loading="isLoading"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      class="tableStyle"
      fixed-header
      :group-by="groupBy"
      :loader-height="2"
      :show-expand="false"
    >
      <!-- :item-key="selectedId" -->
      <template v-slot:[`group.header`]="{ items, group, isOpen, toggle }">

        <div @click="toggle" class="groupHeader">
          <v-btn  icon small :ref="'expand' + group">
            <v-icon small>
              {{ isOpen ? "$minus" : "$plus" }}
            </v-icon>
          </v-btn>
          <span class="text-center ">
            <span class="blue--text text--darken-3">{{ group }}</span> تكرار
            </span>
            <span class="mr-4"> ({{items.length}} كلمة)</span>
        </div>
      </template>

      <template v-slot:item="props">
        <v-chip
          @click="$emit('rowClicked', props.index, props.item)"
          :class="{ active: props.item.x === selectedId }"
          class="indexItem text-right pa-2 ma-1"
          label
          v-html="highlight(props.item.x , search)"
        >
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { appMixin } from '../mixins/mixins'
import { tableOccMixin } from '../mixins/tableOccMixin'

export default {
  name: '',
  mixins: [appMixin, tableOccMixin]
}
</script>

<style scoped>
.groupHeader {
  height: 26px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
}
.v-chip {
  display: -webkit-inline-box;
}
</style>
