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
          <sortable-table
            :table-definition="sampleTableDefinition"
            :data="sampleArray"
            :is-collapsed="isCollapsed"
          >
            <template v-slot:row="{ row:sample }">
              <sortable-table-row
                class="form-sortable-table-row"
                :class="{expanded : !isCollapsed}"
                :table-definition="sampleTableDefinition"
                :is-collapsed="isCollapsed"
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
                    {{ sample.name }}
                  </form-sortable-table-cell>
                </template>
                <template v-slot:Genre>
                  <form-sortable-table-cell>
                    {{ sample.tag }}
                    <!-- <audio-player :sample="sample" /> -->
                  </form-sortable-table-cell>
                </template>
                <template v-slot:BPM>
                  <form-sortable-table-cell>
                    {{ sample.bpm }}
                  </form-sortable-table-cell>
                </template>
                <template v-slot:Cost>
                  <form-sortable-table-cell>
                    {{ `$${sample.cost * 0.01}` }}
                  </form-sortable-table-cell>
                </template>
                <template v-slot:Buy>
                  <div
                    class="column-cell-right-aligned" 
                    @click="handlePurchaseSample(sample)"
                  >
                    <form-icon
                      icon-size="1em"
                      style="padding-right:0.5em;"
                      class="vp-icon flex justify-end align-end download-icon"
                      icon="fa-plus"
                    />
                  </div>
                </template>
              </sortable-table-row>
            </template>
          </sortable-table>
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
import FormImage from '@/components/form/FormImage.vue';
import SortableTable from '@/components/form/SortableTable.vue';
import FormIcon from '@/components/form/FormIcon.vue';
import SortableTableRow from '@/components/form/SortableTableRow.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import BootlegListIcon from '@/components/form/BootlegListIcon.vue';
import BootlegGroupIcon from '@/components/form/BootlegGroupIcon.vue';
import FormSortableTableHeader from '../../form/FormSortableTableHeader.vue';
import FormSortableTableCell from '@/components/form/FormSortableTableCell.vue';
import AudioPlayer from '@/components/form/AudioPlayer.vue';

export default {
  name:'SampleSearch',
  components:{
    FormImage,
    SortableTable,
    FormIcon,
    SortableTableRow,
    ScrollingContainer,
    BootlegListIcon,
    BootlegGroupIcon,
    FormSortableTableHeader,
    FormSortableTableCell,
    AudioPlayer
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
    if(!this.isLoaded) {
      try {
        const {page} = this;
        await this.$store.dispatch(
          'sample/initialize',
          {page}
        );
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

    handlePurchaseSample(sample){

      console.log('Purchasing Sample');

      this.$store.dispatch('user/purchaseSample', {sample})
    }

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

  .sortable-column-row {
    height: 2em;
  }


  &.expanded {
    height:10em;
    width: 10em;
    .sortable-column-row {
      height:10em;
    }
  }
}

.icon-group {
  height: 2em;
  padding: 0 0.5em;
  padding-right: 20px;
}

.search-album-art {
  height: var(--vp-cover-art-hw);
  width: var(--vp-cover-art-hw);
  &.expanded {
    height: var(--vp-cover-art-hw-expanded);
    width: var(--vp-cover-art-hw-expanded);
  }
}

.sortable-column-content {
  width:100%;
  .expanded{
    .sortable-column-row{
      height: var(--vp-cover-art-hw);
    }
  }

  .sortable-column-row {
    cursor:pointer;
    height: var(--vp-cover-art-hw-expanded);
    transition: background-color 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
    background-color: var(--vp-form-button-background-color);
    
    &:hover {
      background-color: var(--vp-side-navigation-background-color);
    }
    
  };
};
</style>