<template>
  <div 
    class="sample-pack-view-page"
  >
    <div class="position-relative pr1 pl1" style="z-index: 1;">
      <breadcrumbs style="padding-top: 0.25rem;" class="pb1" />
      <div class="flex">
        <form-image
          :url="`${selectedSamplePack.imgUrl}`"
        />
        <div class="pl1 flex flex-column">
          <div class="font-bold">
            {{ selectedSamplePack.name }}
          </div>
          <div 
            style="color: #6aef6ae3;"
            class="font-bold"
          >
            {{ selectedSamplePack.cost }}
          </div>
          <div style="opacity: 0.8;font-size: 1rem;"
          >
            {{  samplePackSeller }}
          </div>
          <div style="font-size: 0.9rem;">
            {{ selectedSamplePack.description }}
          </div>
        </div>
      </div>
      <div class="pt1">
        <form-sortable-table
          :data="selectedSamplePack.samples"
          :is-list-view="true"
        >
          <template v-slot:row="{ row: samplePack }">
            <sortable-table-row
            :table-definition="samplePackTableDefinition"
          >
            <template v-slot:Image>
              <form-sortable-table-cell
                class="grid-image position-relative"
              >
                <form-image
                  :url="`${selectedSamplePack.imgUrl}`"
                />
              </form-sortable-table-cell>
            </template>
            <template v-slot:Name>
              <form-sortable-table-cell>
                {{ samplePack.name }}
              </form-sortable-table-cell>
            </template>
            <template v-slot:Description>
              <form-sortable-table-cell>
                {{ samplePack.description }}
                <!-- <audio-player :sample="sample" /> -->
              </form-sortable-table-cell>
            </template>
          </sortable-table-row>
          </template>
        </form-sortable-table>
      </div>
    </div>
    <div 
      class="backdrop" 
      :style="{'background-image': `url(${selectedSamplePack.imgUrl})`}"
    >
      <div class="backdrop-filter">
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { samplePackTableDefinition } from '@/components/pages/sample/samplePackTableDefinition';
import FormImage from '@/components/form/FormImage.vue';
import FormSortableTable from '@/components/form/FormSortableTable.vue';
import SortableTableRow from '@/components/form/SortableTableRow.vue';
import FormSortableTableCell from '@/components/form/FormSortableTableCell.vue';
import FormIcon from '@/components/form/FormIcon.vue';
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';

export default {
  name: 'SamplePackView',
  data: () => ({
    samplePackTableDefinition,
  }),
  components: {
    FormImage,
    FormSortableTable,
    SortableTableRow,
    FormSortableTableCell,
    FormIcon,
    Breadcrumbs
  },
  computed:{
    ...mapState('samplePack', ['selectedSamplePack']),
    samplePackId() {
      return this.$route.params["id"] || '';
    },
    samplePackSeller() {
      return (this.selectedSamplePack.samples || [{seller: ''}])[0].seller;
    },
  },
  async mounted() {
    await this.$store.dispatch('samplePack/getSamplePackById', this.samplePackId);
  }
}
</script>