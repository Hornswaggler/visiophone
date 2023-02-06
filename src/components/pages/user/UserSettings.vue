<template>
  <scrolling-container
    class="user-settings-page"
  >
    <template v-slot:scrolling-content>
      <div class="form-base">
        <div class="form-column">
          <div class="vp-form-row">
            <form-image-editor
              class="flex-3"
              :value="imageSrc"
              :change-handler="onImageChanged"
            />
          </div>

          <div 
            v-if="stripeAccountStatus === 'NO_ACCOUNT'"
            class="vp-form-row"
          >
            <form-input-base>
              <template v-slot:title>
                Account Type
              </template>
              <template
                v-slot:input
              >
                <div style="width:100%;">
                  <span style="padding:1em;text-align:left;font-size:0.8rem;display:inline-block;">
                    You have a <span style="color: var(--vp-highlight-color); display: inline-block;">buyer's</span> 
                    account. With this account, you can purchase samples 
                    from Visiophone sellers but you cannot upload your samples. 
                    Upgrade to a seller's account to put your creations up for sale.
                  </span>

                  <form-redirect-button
                    :action="accountUpgradeUri"
                    :idToken="idToken"
                  >
                    <template v-slot:content>
                      <div
                        style="width:100%;"
                        class="vp-button"
                      >UPGRADE</div>
                    </template>
                  </form-redirect-button>

                </div>
              </template>
            </form-input-base>
          </div>

          <div 
            v-if="stripeAccountStatus === 'PENDING'"
            class="vp-form-row"
          >
            <form-input-base>
              <template v-slot:title>
                Account Type
              </template>
              <template
                v-slot:input
                style="height:initial;" 
              >
                <div style="width:100%;">
                  <span style="padding:1em;text-align:left;font-size:0.8rem;display:inline-block;">
                    Seller account access is pending authentication with Stripe, please sign into stripe and (maybe we should include a link to that? :|)
                  </span>
                </div>
              </template>
            </form-input-base>
          </div>

          <div 
            v-if="stripeAccountStatus === 'APPROVED'"
            class="vp-form-row flex-1"
          >
            <form-input-base>
              <template v-slot:title>
                Account Type
              </template>
              <template
                v-slot:input
                style="height:initial;" 
              >
                <!-- TODO: Fix this: -->
                <div style="width:100%;">
                  <span style="padding:1em;text-align:left;font-size:0.8rem;display:inline-block;">
                    You have a <span style="color: var(--vp-highlight-color); display: inline-block;">seller</span> 
                    account. With this account, you can upload your samples for sale to Visiophone users. 
                  </span>
                </div>
              </template>
            </form-input-base>
          </div>

          <div class="flex-1" />
            <div class="vp-form-row flex"> 
            <div class="flex-1" />
            <button
              class="vp-button"
              type="button"
              @click="onSaveChanges"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </template>
    
  </scrolling-container>

</template>
<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import FormInputBase from '../../form/FormInputBase.vue';
import ScrollingContainer from '../../layout/ScrollingContainer.vue';
import FormUploadFile from '@/components/form/FormUploadFile.vue';
import FormImageEditor from '@/components/form/FormImageEditor.vue';
import FormInput from '@/components/form/FormInput.vue';
import FormRedirectButton from '@/components/form/FormRedirectButton.vue';
import config from '@/config';
import {slugs, getUriForSlug} from '@/slugs';

export default {
  name:'UserSettings',
  components:{
    FormUploadFile,
    FormImageEditor,
    FormInput,
    FormInputBase,
    FormRedirectButton,
    ScrollingContainer
  },
  data: () => ({
    initialized: false,
    resampledBlob: {},
    imageBlob: {},
    imageSrc: '',
    profileImage: {},
    IMAGE_MIME_TYPE: config.IMAGE_MIME_TYPE,
    accountUpgradeUri: getUriForSlug(slugs.StripeProvisionUser)
  }),
  computed: {
    ...mapState('user',['customUserName', 'isStripeApproved', 'profileImg', 'idToken']),
    ...mapGetters('user', ['stripeAccountStatus'])
  },
  mounted() {
    this.imageSrc = this.profileImg;
    this.$nextTick( async () => {
      this.initialized = true;
    });
  },
  methods:{
    onImageSelected(file){
      Vue.set(this.imageBlob, file);
      this.imageSrc =  URL.createObjectURL(file);
    },

    onImageChanged(newImage) {
      Vue.set(this, 'resampledBlob', newImage);
    },
    
    async onSaveChanges() {
      this.$store.commit('app/isLoading', true);

      await this.$store.dispatch(
        'user/uploadUserProfile', {
          blob: this.resampledBlob,
        }
      );

      this.$router.push('/sample');
    },

  }
}
</script>