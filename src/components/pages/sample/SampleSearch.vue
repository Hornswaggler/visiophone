<template>
  <div style="position:relative;">
    <scrolling-container
      :on-scroll-limit-reached="onScrollLimitReached"
      style="flex:1;"
    >
      <template v-slot:header>
        <div class="flex justify-end icon-group">
          <bootleg-list-icon
            :on-click="onViewListClicked"
            :selected="isListTypeSelected"
          />
          <bootleg-group-icon 
            :on-click="onViewGroupClicked"
            :selected="isGroupTypeSelected"
          />
        </div>
        
        <form-sortable-table-header
          :table-definition="sampleTableDefinition"
          :on-column-clicked="onColumnClicked"
          :selected="true"
        />
      </template>

      <template v-slot:scrolling-content>
        <div class="sortable-column-content">
          <form-sortable-table
            :table-definition="sampleTableDefinition"
            :data="sampleArray"
            :is-collapsed="isCollapsed"
          >
            <template v-slot:row="{ row:sample }">
              <form-sortable-table-row
                class="form-sortable-table-row"
                :table-definition="sampleTableDefinition"
              >
                <template v-slot:Image>
                  <form-image
                    class="search-album-art"
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
                <template v-slot:Cost>
                  <form-sortable-table-cell>
                    {{ sample.cost }}
                  </form-sortable-table-cell>
                </template>
                <template v-slot:Buy>
                  <div class="column-cell-right-aligned">
                    <form-icon
                      icon-size="1em"
                      style="padding-right:0.5em;"
                      class="vp-icon flex justify-end align-end download-icon"
                      icon="fa-plus"
                    />
                  </div>
                </template>
              </form-sortable-table-row>
            </template>
          </form-sortable-table>
        </div>

        <div
          class="flex"
        />
      </template>
    </scrolling-container>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import {SORT_TYPES} from '@/store/modules/sample';
import FormImage from '@/components/form/FormImage';
import FormSortableTable from '@/components/form/FormSortableTable';
import FormIcon from '@/components/form/FormIcon';
import FormSortableTableRow from '@/components/form/FormSortableTableRow';
import ScrollingContainer from '@/components/layout/ScrollingContainer';
import BootlegListIcon from '@/components/form/BootlegListIcon';
import BootlegGroupIcon from '@/components/form/BootlegGroupIcon';
import FormSortableTableHeader from '../../form/FormSortableTableHeader.vue';
import FormSortableTableCell from '@/components/form/FormSortableTableCell';

export default {
  name:'SampleSearch',
  components:{
    FormImage,
    FormSortableTable,
    FormIcon,
    FormSortableTableRow,
    ScrollingContainer,
    BootlegListIcon,
    BootlegGroupIcon,
    FormSortableTableHeader,
    FormSortableTableCell
  },
  data: () => ({
    page: 0,
    bufferIndex: 0,
  }),
  computed: {
    ...mapGetters('sample', ['sampleArray']),
    ...mapState('sample', ['isLoaded', 'sortType', 'sampleTableDefinition']),

    isCollapsed() {
      return this.sortType === SORT_TYPES.LIST;
    },

    isGroupTypeSelected() {
      return this.sortType === SORT_TYPES.GROUP;
    },

    isListTypeSelected(){
      return this.sortType === SORT_TYPES.LIST;
    },

    bufferLength() {
      return this.sampleArray.length;
    },

    bufferRemaining() {
      return this.sampleBufferLength - this.bufferIndex;
    }
  },

  async mounted() {
    this.$store.commit('app/setSideNavigationIndex', 0);
    if(!this.isLoaded) {
      try {
        const {page} = this;
        await this.$store.dispatch(
          'sample/initialize',
          {page});
      } finally {
        this.$store.dispatch('sample/setIsLoaded', true);
      }
    }
  },

  methods: {
    onScrollLimitReached(){
      this.$store.dispatch('sample/loadMoreSamples');
    },

    onViewGroupClicked(){
      if(!this.isGroupTypeSelected) {
        this.$store.dispatch('sample/setSortType', SORT_TYPES.GROUP);
      }
    },

    onViewListClicked(){
      if(!this.isListTypeSelected) {
        this.$store.dispatch('sample/setSortType', SORT_TYPES.LIST);
      }
    },

    onColumnClicked(column) {
      this.$store.dispatch('sample/orderBy', column);
    },

  }
}
</script>

<style lang="scss">
.column-cell-right-aligned {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 0.5em;
}

.form-sortable-table-row {
  height: var(--vp-cover-art-hw);
  overflow: hidden;
}

.icon-group {
  height: 2em;
  padding: 0 0.5em;
  padding-right: 20px;
}

.search-album-art {
  height: var(--vp-cover-art-hw);
  width: var(--vp-cover-art-hw);
}

.sortable-column-content {

  .sortable-column-row {
    cursor:pointer;
    
    &:hover {
      background-color:rgba(253, 33, 216, 0.58);
    }

    &:nth-child(even) {
      background-color:rgba(128, 128, 128, 0.209);
      &:hover {
        background-color:rgba(253, 33, 216, 0.58);
      }
    }
    
  };
};
</style>