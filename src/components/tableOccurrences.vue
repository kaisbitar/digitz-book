<template>
  <div class="webKitWidth">
    <appSearchBox
      @searchChanged="changeSearch"
      @matchChanged="changeMatchingStatus"
      :inputText="search"
      :dataType="dataType"
    />
    <v-data-table
      :items="tableData"
      :headers="tableHeaders"
      :items-per-page="75"
      :search="search"
      :height="getTableHeight() - 130"
      :footer-props="footerProps"
      :loading="isLoading"
      loading-text="جاري تحميل البيانات القرآنية ... الرجاء الانتظار"
      class="tableStyle webKitWidth"
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
      <!-- :class="{ active: props.item.x === selectedId }" -->
      <template v-slot:item="props">
        <v-chip
          @click="$emit('rowClicked', props.index, props.item)"
          class="tableItem text-right pa-2 ma-1"
          :class="{ 'orange lighten-4 font-weight-bold': props.item.x === detailElement }"
          label
          v-html="highlight(props.item.x , search)"
        >
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { tableOccMixin } from '../mixins/tableOccMixin'

export default {
  name: '',
  mixins: [tableOccMixin]
}
</script>

<style>
.groupHeader {
  /* height: 26px; */
  font-weight: bold;
  /* font-size: 12px; */
  cursor: pointer;
}
.v-chip {
  display: -webkit-inline-box;
}
</style>
