<template>
  <scrolling-container
    class="user-library-page"
  >
    <template v-slot:scrolling-content>
      <div>
        <div v-if="isStripeApproved">
          <div class="vp-form-row" >
            <h3 @click="isGridView = !isGridView">
              Uploads
            </h3>
          </div>
          <sample-packs-detail-component
            :samplePacks="uploads"
          ></sample-packs-detail-component>
        </div>

        <div class="vp-form-row text-align-left">
          <h3 @click="isGridView = !isGridView">
            Purchases
          </h3>
        </div>
        <sample-packs-detail-component
          :samplePacks="purchases"
        ></sample-packs-detail-component>
      </div>
    </template>
  </scrolling-container>
</template>

<script>
import { mapState} from 'vuex';
import FormSortableTable from '@/components/form/FormSortableTable.vue'
import SortableTableRow from '@/components/form/SortableTableRow.vue';
import ScrollingContainer from '@/components/layout/ScrollingContainer.vue';
import FormImage from '@/components/form/FormImage.vue';
import FormIcon from '@/components/form/FormIcon.vue';
import FormSortableTableCell from '@/components/form/FormSortableTableCell.vue';
import SamplePacksDetailComponent from '@/components/common/SamplePacksDetailComponent.vue';

export default {
  name:'UserLibrary',
  components:{
    FormSortableTable,
    SortableTableRow,
    FormSortableTableCell,
    FormImage,
    FormIcon,
    ScrollingContainer,
    SamplePacksDetailComponent
  },
  data: () => ({
    isGridView: true,
  }),
  computed: {
    ...mapState('user',['uploads', 'isStripeApproved', 'purchases']),
  },
  mounted(){
    this.$store.dispatch('user/initializeLibrary');
  }
}
</script>
