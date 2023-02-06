<template>
  <scrolling-container
    class="sample-pack-search-page"
    :on-scroll-limit-reached="onScrollLimitReached"
  >
    <template v-slot:header>
      <div class="search-header">
        <div style="width: 50%;" class="flex-1 flex">
          <form-input
            class="header-search-input"
            style="padding:0;border:none;"
            :on-changed="onSearchChanged"
          />
          <div class="header-search-input-background"></div>
        </div>

        <div
          style="width: 50%;"
          class="flex justify-end icon-group"
        >
          <bootleg-list-icon
            :on-click="onViewListClicked"
            :selected="isListTypeSelected"
          />
          <bootleg-group-icon
            :on-click="onViewGroupClicked"
            :selected="!isListTypeSelected"
          />
        </div>
      </div>
      <form-sortable-table-header
        :table-definition="samplePackTableDefinition"
        :on-column-clicked="onColumnClicked"
        :selected="true"
      />
    </template>

    <template v-slot:scrolling-content>
      <form-sortable-table
        :data="samplePackArray"
        :is-list-view="isListTypeSelected"
      >
        <template v-slot:row="{ row: samplePack }">
          <sortable-table-row
            :table-definition="samplePackTableDefinition"
          >
            <template v-slot:Image>
              <form-sortable-table-cell class="grid-image">
                <form-image
                  :url="`${samplePack.imgUrl}`"
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
    </template>
  </scrolling-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { SORT_TYPES } from '@/store/modules/sample';
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
import { samplePackTableDefinition } from '@/components/pages/sample/samplePackTableDefinition';

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
    samplePackTableDefinition
  }),
  computed: {
    ...mapGetters('samplePack', ['samplePackArray']),
    ...mapState('samplePack', ['isLoaded', 'sortType']),
    ...mapState('user', ['idToken']),

    isListView() {
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
          'samplePack/initialize',
          {page}
        );
      } finally {
        this.$store.dispatch('samplePack/setIsLoaded', true);
      }
    }
  },

  methods: {
    onScrollLimitReached(){
      this.$store.dispatch('samplePack/loadMoreSamples');
    },

    onViewGroupClicked(){
      if(this.isListTypeSelected) {
        this.$store.dispatch('samplePack/setSortType', SORT_TYPES.GROUP);
      }
    },

    onViewListClicked(){
      if(!this.isListTypeSelected) {
        this.$store.dispatch('samplePack/setSortType', SORT_TYPES.LIST);
      }
    },

    onColumnClicked(column) {
      this.$store.dispatch('samplePack/orderBy', column);
    },

    onSearchChanged(query) {
      this.$store.dispatch('samplePack/search', { query });
    },
  }
}
</script>