<template>
  <scrolling-container
    class="sample-pack-search-page"
    :on-scroll-limit-reached="onScrollLimitReached"
  >
    <template v-slot:header>
      <!-- <div class="search-header">
        <div class="flex-1 flex">
          <form-input
            class="header-search-input border-none p0"
            :on-changed="onSearchChanged"
          />
          <div class="header-search-input-background"></div>
        </div>

        <div
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
      </div> -->

      <form-sortable-table-header
        :table-definition="samplePackTableDefinition"
        :on-column-clicked="onColumnClicked"
        :selected="true"
      />
    </template>

    <template v-slot:scrolling-content>
      <form-sortable-table
        :data="samplePackArray"
        :is-list-view="routeParams.mode === 'search'"
      >
        <template v-slot:row="{ row: samplePack }">
          <sortable-table-row
            :table-definition="samplePackTableDefinition"
          >
            <template v-slot:Image>
              <form-sortable-table-cell
                class="grid-image position-relative"
              >
                <div
                  class="position-absolute flex flex-column p025"
                  style="
                    font-size: 0.8rem;
                    background-color: #00000078;
                    top:75%;
                    bottom:0;
                    left:0;
                    right:0;"
                >
                  <div style="
                    color: var(--primary-highlight-color);"
                  >
                    {{ samplePack.name }}
                  </div>
                  <div>
                    {{ samplePack.description }}
                  </div>
                </div>

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
            <template v-slot:Purchase>
              <div 
                style="padding: 0 0.25rem;"
                @click="addSamplePackToCart(samplePack)"
              >
                <form-icon
                  icon-size="1rem"
                  class="vp-icon flex justify-end align-end download-icon"
                  icon="fa-plus"
                />
              </div>
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
  components: {
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
    },

    routeParams() {
      return this.$route.params;
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
    addSamplePackToCart(samplePack) {
      this.$store.dispatch('cart/addSamplePackToCart', samplePack);
    },

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