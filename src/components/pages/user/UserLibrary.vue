<template>
  <div style="position:relative;">
    <div
      class="vp-form-row"
      style="text-align:left;"
    >
      <h3 @click="isCollapsed = !isCollapsed">
        Uploads
      </h3>
    </div>


    <sortable-table
      style="width:100%;"
      :table-definition="tableDefinition"
      :data="getForSale"
      :is-collapsed="isCollapsed"
    >
      <template v-slot:row="{ row:sample }">
        <sortable-table-row
          class="form-sortable-table-row"
          :class="{expanded : !isCollapsed}"
          :table-definition="tableDefinition"
        >
          <template v-slot:Image>
            <form-image
              class="search-album-art"
              :class="{expanded: !isCollapsed}"
              :url="`${sample.imgUrl}`"
            />
          </template>
          <template v-slot:Title>
            <form-sortable-table-cell>
              {{ sample.description }}
            </form-sortable-table-cell>
          </template>
          <template v-slot:Genre>
            <form-sortable-table-cell>
              {{ sample.tag }}
            </form-sortable-table-cell>
          </template>
          <template v-slot:BPM>
            <form-sortable-table-cell>
              {{ sample.bpm }}
            </form-sortable-table-cell>
          </template>
        </sortable-table-row>
      </template>
    </sortable-table>

    <div
      class="vp-form-row"
      style="text-align:left;"
    >
      <h3 @click="isCollapsed = !isCollapsed">
        Purchases
      </h3>
    </div>


    <sortable-table
      style="width:100%;"
      :table-definition="tableDefinition"
      :data="getOwned"
      :is-collapsed="isCollapsed"
    >
      <template v-slot:row="{ row:sample }">
        <sortable-table-row
          class="form-sortable-table-row"
          :class="{expanded : !isCollapsed}"
          :table-definition="tableDefinition"
        >
          <template v-slot:Image>
            <form-image
              class="search-album-art"
              :class="{expanded: !isCollapsed}"
              :url="`${sample.imgUrl}`"
            />
          </template>
          <template v-slot:Title>
            <form-sortable-table-cell>
              {{ sample.description }}
            </form-sortable-table-cell>
          </template>
          <template v-slot:Genre>
            <form-sortable-table-cell>
              {{ sample.tag }}
            </form-sortable-table-cell>
          </template>
          <template v-slot:BPM>
            <form-sortable-table-cell>
              {{ sample.bpm }}
            </form-sortable-table-cell>
          </template>
        </sortable-table-row>
      </template>
    </sortable-table>


    <!-- <div class="vp-form-row">
      <div
        v-for="sample in getForSale"
        :key="sample._id"
      >
        <img :src="sample.imgUrl">
      </div>
    </div> -->

    
    <!-- <div class="vp-form-row">
      <h3>Purchases</h3>
    </div>
    <div class="vp-form-row">
      <div
        v-for="sample in getOwned"
        :key="sample._id"
      >
        <img :src="sample.imgUrl">
      </div>
    </div> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import SortableTable from '@/components/form/SortableTable'
import SortableTableRow from '@/components/form/SortableTableRow';
import FormImage from '@/components/form/FormImage';
import FormSortableTableCell from '@/components/form/FormSortableTableCell';

export default {
  name:'UserLibrary',
  components:{
    SortableTable,
    SortableTableRow,
    FormSortableTableCell,
    FormImage
  },
  data: () => ({
    isCollapsed:true,
    tableDefinition: {
      columns: [
        { 
          ratio:'1',
          name:'Image',
          isSort: false,
          show:false
        },
        {
          ratio:'2',
          name: 'Title',
          path: 'description',
          isSort: true,
          show: true
        },
        {
          ratio:'2',
          name: 'Genre',
          path: 'tag',
          isSort: true,
          show: true
        },
        {
          ratio:'1',
          name: 'BPM',
          path: 'bpm',
          isSort: true,
          show: true
        }
      ].map((col, _id) => ({...col, _id}))
    }
  }),
  computed:{
    ...mapGetters('user', ['getForSale', 'getOwned'])
  },
  mounted(){
    this.$store.commit('app/setSideNavigationIndex', 1);
  }
}
</script>
<style lang="scss">

</style>