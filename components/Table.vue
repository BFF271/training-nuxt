<template>
  <b-table hover :fields='table.fields' :items='table.activities' head-variant='dark'
           :tbody-tr-class='rowClass'></b-table>
</template>

<script>
export default {
  props: {
    table: {
      type: Object,
      default: () => ({
        fields: [],
        activities: []
      })
    }
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== 'row') return
      // if there is status row, return it as row style
      if (item.status && item.status !== '') return item.status
    }
  }
}
</script>
