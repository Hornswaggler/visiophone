<template>
  <div style="position:relative;">


    <div v-if="isStripeApproved">
      <div
        class="vp-form-row"
        style="text-align:left;"
      >
        <h3 @click="isCollapsed = !isCollapsed">
          Uploads
        </h3>
      </div>

      <form-sortable-table
        style="width:100%;"
        :table-definition="tableDefinition"
        :data="uploads"
        :is-collapsed="isCollapsed"
      >
        <template v-slot:row="{ row:sample }">
          <sortable-table-row
            class="sortable-column-row"
            :class="{expanded : !isCollapsed}"
            :table-definition="tableDefinition"
          >
            <template v-slot:Image>
            </template>
            <template v-slot:Name>
              <form-sortable-table-cell>
                {{sample.name}}
              </form-sortable-table-cell>
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
      </form-sortable-table>
    </div>



    <div
      class="vp-form-row"
      style="text-align:left;"
    >
      <h3 @click="isCollapsed = !isCollapsed">
        Purchases
      </h3>
    </div>

    <form-sortable-table
      style="width:100%;"
      :table-definition="tableDefinition"
      :data="purchases"
      :is-collapsed="isCollapsed"
    >
      <template v-slot:row="{ row:sample }">
        <sortable-table-row
          class="sortable-column-row"
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
          <template v-slot:Name>
            <form-sortable-table-cell>
              {{sample.name}}
            </form-sortable-table-cell>
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
    </form-sortable-table>
  </div>
</template>

<script>
import { mapState} from 'vuex';
import FormSortableTable from '@/components/form/FormSortableTable.vue'
import SortableTableRow from '@/components/form/SortableTableRow.vue';
import FormImage from '@/components/form/FormImage.vue';
import FormSortableTableCell from '@/components/form/FormSortableTableCell.vue';

export default {
  name:'UserLibrary',
  components:{
    FormSortableTable,
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
          ratio:'1',
          name:'Name',
          isSort: false,
          show: true
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
    ...mapState('user',['uploads', 'isStripeApproved', 'purchases']),
  }
}
</script>
<style lang="scss">

</style>