<template>
  <scrolling-container
    :on-scroll-limit-reached="onScrollLimitReached"
  >
    <template v-slot:header>
      <div
        class="flex"
        style="background-color: black"
      >
        <div class="flex-1 flex">
          
          <form-input
            class="header-search-input"
            style="padding:0;border:none;"
            :on-changed="onSearchChanged"
          />
              
          <div class="header-search-input-background" />
        </div>

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
      </div>
      <form-sortable-table-header
        :table-definition="sampleTableDefinition"
        :on-column-clicked="onColumnClicked"
        :selected="true"
      />
    </template>

    <template v-slot:scrolling-content>
      <div class="scrolling-content">
        <form-sortable-table
          :table-definition="sampleTableDefinition"
          :data="sampleArray"
          :is-collapsed="isCollapsed"
        >
          <template v-slot:row="{ row: sample }">
            <sortable-table-row
              :class="{ expanded : !isCollapsed }"
              :table-definition="sampleTableDefinition"
              :is-collapsed="isCollapsed"
            >
              <template v-slot:Image>
                <form-image
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
                <form-redirect-button
                  :action="samplePurchaseUrl"
                  :idToken="idToken"
                  :payload="JSON.stringify([sample.priceId])"
                >
                  <template v-slot:content>
                    <form-icon
                      icon-size="1em"
                      class="vp-icon flex justify-end align-end download-icon"
                      icon="fa-plus"
                    />
                  </template>
                </form-redirect-button>
              </template>
            </sortable-table-row>
          </template>
        </form-sortable-table>
      </div>

      <div class="flex" />
    </template>
  </scrolling-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import {SORT_TYPES} from '@/store/modules/sample';
import FormImage from '@/components/form/FormImage.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormSortableTable from '@/components/form/FormSortableTable.vue';
import FormIcon from '@/components/form/FormIcon.vue';
import SortableTableRow from '@/components/form/SortableTableRow.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import BootlegListIcon from '@/components/form/BootlegListIcon.vue';
import BootlegGroupIcon from '@/components/form/BootlegGroupIcon.vue';
import FormSortableTableHeader from '../../form/FormSortableTableHeader.vue';
import FormSortableTableCell from '@/components/form/FormSortableTableCell.vue';
import AudioPlayer from '@/components/form/AudioPlayer.vue';
import FormRedirectButton from '@/components/form/FormRedirectButton.vue';
import Carousel from '@/components/form/Carousel.vue';

export default {
  name:'SampleSearch',
  components:{
    FormImage,
    FormSortableTable,
    FormIcon,
    SortableTableRow,
    ScrollingContainer,
    BootlegListIcon,
    BootlegGroupIcon,
    FormSortableTableHeader,
    FormSortableTableCell,
    AudioPlayer,
    FormRedirectButton,
    Carousel,
    FormInput
  },
  data: () => ({
    page: 0,
  }),
  computed: {
    ...mapGetters('sample', ['sampleArray']),
    ...mapState('sample', ['isLoaded', 'sortType', 'sampleTableDefinition', 'samplePurchaseUrl']),
    ...mapState('user', ['idToken']),

    isCollapsed() {
      return this.sortType === SORT_TYPES.LIST;
    },

    isGroupTypeSelected() {
      return this.sortType === SORT_TYPES.GROUP;
    },

    isListTypeSelected(){
      return this.sortType === SORT_TYPES.LIST;
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

    onSearchChanged(query) {
      this.$store.dispatch('sample/search', {query });
    },
  }
}
</script>
<style lang="scss">
// TODO: What's up w/ this???
.header-search-input {
  .form-input-base {
    border:0;
    .form-input-body {
      padding-left: 1em;
    }
    .form-input-icon-underlay {
      left: 1em;
    }
  }
}
</style>