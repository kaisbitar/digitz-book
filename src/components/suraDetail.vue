<template>
<div>
    suraDetail
</div>
</template>

<script>
import { fetchTableData } from '@/api/api.js'

export default {
  components: {
  },

  data: () => ({
    drawer: false
  }),
  methods: {
    fetchData () {
      this.isLoading = true
      const appApi = process.env.VUE_APP_API_URL
      fetchTableData(appApi, this.$store.state.fileName, this.radios).then(items => {})
    }
  }
}
</script>
