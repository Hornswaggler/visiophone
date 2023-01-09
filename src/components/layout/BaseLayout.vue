<template>
  <div>
    <!-- TODO: Inline Styles -->
    <background style="position:absolute;z-index: -1;" />
    <div style="z-index:-2">
      <div class="overlay" />
    </div>
    <form-dropdown />
    <loading />
    <router-view />
  </div>
</template>

<script>
import Loading from '@/components/layout/Loading.vue';
import FormDropdown from '../form/FormDropdown.vue';
import Background from './Background.vue';

export default {
  name: 'BaseLayout',
  components: {
    Loading,
    FormDropdown,
    Background
  }
}
</script>