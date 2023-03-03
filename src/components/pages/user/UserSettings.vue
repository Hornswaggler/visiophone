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
                <div class="fill-width">
                  <span class="info-block">
                    You have a <span class="info-highlight">buyer's</span> 
                    account. With this account, you can purchase samples 
                    from Visiophone sellers but you cannot upload your samples. 
                    Upgrade to a seller's account to put your creations up for sale.
                  </span>

                  <form-redirect-button
                    :action="accountUpgradeUri"
                    :idToken="idToken"
                    :payload="returnUri"
                  >
                    <template v-slot:content>
                      <div class="vp-button fill-width">UPGRADE</div>
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
               
              >
                <div class="fill-width">
                  <span class="info-block">
                    Seller account access is pending authentication with Stripe.
                  </span>
                  <form-redirect-button
                    :action="accountUpgradeUri"
                    :idToken="idToken"
                    :payload="returnUri"
                  >
                    <template v-slot:content>
                      <div class="vp-button fill-width">UPGRADE</div>
                    </template>
                  </form-redirect-button>
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
              >
                <!-- TODO: Fix this: -->
                <div class="fill-width">
                  <span class="info-block">
                    You have a <span class="info-highlight">seller</span> 
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
    accountUpgradeUri: getUriForSlug(slugs.StripeProvisionUser),
  }),
  computed: {
    ...mapState('user',['customUserName', 'isStripeApproved', 'profileImg', 'idToken']),
    ...mapGetters('user', ['stripeAccountStatus']),
    returnUri() {
      return JSON.stringify({returnUri: document.location.href});
    }
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