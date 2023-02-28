<template>
  <form-sortable-table 
    :table-definition="tableDefinition" 
    :data="samplePacks"
    :is-grid-view="true"
  >
    <template v-slot:row="{ row: samplePack }">
      <a 
        v-for="link in libraryLinks[samplePack._id]"
        :key="link.sampleId"
        :ref="samplePack._id"
        :href="link.link"
      >
        {{link.sampleId}}
      </a>

      <div ref="links"></div>
      <div class="purchase-detail">
        <sortable-table-row
          class="sortable-column-row" 
          style="padding-left:0;"
          :class="{expanded : !isGridView}"
          :on-click="() => toggleRowExpand(samplePack._id)" 
          :table-definition="tableDefinition"
        >
       
        <!-- :on-click="() => toggleRowExpand(samplePack._id)" -->
        <!-- :on-click="() => onPurchaseClicked(samplePack)" -->

          <template v-slot:Image>
            <form-image 
              class="search-album-art" 
              :class="{expanded: !isGridView}" 
              :url="`${samplePack.imgUrl}`" 
            />
          </template>
          <template v-slot:Name>
            <form-sortable-table-cell>
              {{samplePack.name}}
            </form-sortable-table-cell>
          </template>
          <template v-slot:Title>
            <form-sortable-table-cell>
              {{ `${samplePack.samples.length} sample${samplePack.samples.length > 1 ? 's': ''}` }}
            </form-sortable-table-cell>
          </template>
          <template v-slot:Cost>
            <form-sortable-table-cell>
              {{ samplePack.costFormatted }}
            </form-sortable-table-cell>
          </template>
          <template v-slot:Download>
            <form-sortable-table-cell
              class="align-center flex pr025"
            >
              <div @click="$event => onPurchaseClicked(samplePack, $event)">
                <form-icon
                  icon-size="1rem"
                  class="vp-icon download-icon"
                  icon="fa-floppy-disk"
                />
              </div>
            </form-sortable-table-cell>
          </template>
        </sortable-table-row>

        <form-sortable-table
          v-if="isExpanded(samplePack._id)"
          :table-definition="sampleDefinition" 
          :data="samplePack.samples"
        >
          <template v-slot:row="{ row: sample }">
            <sortable-table-row
              class="sortable-column-row" 
              :class="{expanded : !isGridView}"
              :table-definition="sampleDefinition"
            >
              <template v-slot:Image>
                <div class="form-image" />
              </template>
              <template v-slot:Name>
                <form-sortable-table-cell>
                  {{ sample.name }}
                </form-sortable-table-cell>
              </template>
              <template v-slot:Title>
                <form-sortable-table-cell>
                  {{ sample.description }}
                </form-sortable-table-cell>
              </template>
              <template v-slot:Key>
                <form-sortable-table-cell>
                  {{ sample.key }}
                </form-sortable-table-cell>
              </template>
              <template v-slot:Download>
                <form-sortable-table-cell
                  class="align-center flex pr025"
                >
                  <div>
                    <form-icon
                      icon-size="1rem"
                      class="vp-icon download-icon"
                      icon="fa-floppy-disk"
                    />
                  </div>
                </form-sortable-table-cell>
              </template>
            </sortable-table-row>
          </template>
        </form-sortable-table>
        
        <!-- <div>
          {{ links }} -->
          <!-- <div
            v-for="{id} in links"
            :key="id"
          >
            <a
              ref="links"
              href="http://localhost:8080/Crispy_Clap 1.wav"
              download
            >{{ samplePack.samples.find(sample => sample._id)  }}</a>
          </div> -->
        <!-- </div> -->
        <!-- <button 
          class="vp-button"
          type="button"
        >
          Download All
        </button> -->
      </div>
    </template>
  </form-sortable-table>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';
import FormSortableTable from '@/components/form/FormSortableTable.vue'
import SortableTableRow from '@/components/form/SortableTableRow.vue';
import FormSortableTableCell from '@/components/form/FormSortableTableCell.vue';
import FormImage from '@/components/form/FormImage.vue';
import FormIcon from '@/components/form/FormIcon.vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'SamplePackDetailComponent',
  components:{
    FormSortableTable,
    SortableTableRow,
    FormSortableTableCell,
    FormImage,
    FormIcon,
  },
  props:{
    samplePacks: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    expandState: {},
    isGridView: true,
    links: {},
    sampleDefinition :{
      columns:[
      {
          name: 'Image',
          path: 'imgUrl',
          isSort: false,
          show: false
        },
      {
          ratio:'2',
          name:'Name',
          isSort: false,
          show: true
        },
        {
          ratio:'3',
          name: 'Title',
          path: 'description',
          isSort: true,
          show: true
        },
        {
          ratio:'1',
          name: 'Key',
          path: 'key',
          isSort: true,
          show: true
        },
        {
          name: 'Download',
          path: 'download',
          isSort: true,
          show: false
        },
      ]
    },
    tableDefinition: {
      columns: [
        {
          name: 'Image',
          path: 'imgUrl',
          isSort: false,
          show: false
        },
        {
          ratio:'2',
          name:'Name',
          isSort: false,
          show: true
        },
        {
          ratio:'3',
          name: 'Title',
          path: 'description',
          isSort: true,
          show: true
        },
        {
          ratio: '1',
          name: 'Cost',
          path: 'cost',
          isSort: true,
          show:true
        },
        {
          name: 'Download',
          path: 'download',
          isSort: true,
          show: false
        },
        // {
        //   ratio:'2',
        //   name: 'Genre',
        //   path: 'tag',
        //   isSort: true,
        //   show: true
        // },
        // {
        //   ratio:'1',
        //   name: 'BPM',
        //   path: 'bpm',
        //   isSort: true,
        //   show: true
        // }
      ].map((col, _id) => ({...col, _id}))
    }
  }),
  computed:{
    ...mapState('user', ['libraryLinks'])
  },
  methods:{
    isExpanded(samplePackId) {
      return this.expandState[samplePackId] != null && this.expandState[samplePackId];
    },
    toggleRowExpand(samplePackId){
      Vue.set(
        this,
        'expandState',
        {
          ...this.expandState,
          [samplePackId]: !(this.expandState[samplePackId] != null && this.expandState[samplePackId])
        }
      );
    },
    async onPurchaseClicked(samplePack, event) {
      event.cancelBubble = true;
      if(this.libraryLinks[samplePack._id] == null){
        await this.$store.dispatch('user/getPurchasedSamplePack', {samplePack});
      } 

      this.$nextTick(() => {
        this.$nextTick(() => {
          for(let i = 0; i < this.$refs[samplePack._id].length; i++) {
            //TODO: UNCOMMENT!!!
            // this.$refs[samplePack._id][i].click();
          }
        });
      });
    }
  }
}
</script>
<style lang="scss">
.purchase-detail .sortable-table.isListView {
  padding-left:0;  
}

.purchase-detail {
  .sortable-table {
    .sortable-table-row {
      .sortable-column-row {
        border-radius: 0px;
      }
    }
    
    &.isListView {
      padding:0;
      padding-left: 0;

      .sortable-table-row {
        padding-left: 0;
      }

      .sortable-table-row:nth-child(odd) .sortable-column-row{
        background-color:rgb(150, 154, 154);
        color:black;
      }
    }
  } 
}
</style>
