<template>
  <base-centre-container>
    <h2>404</h2>
    <p>{{ title }}</p>
  </base-centre-container>
</template>

<script>
import helpers from '@/utils/helpers.js';

export default {
  data() {
    return {
      type: 'Page',
    };
  },
  computed: {
    title() {
      return helpers.capitalize(this.type) + ' not found';
    },
  },
  created() {
    if (this.$route.meta.type) {
      this.type = this.$route.meta.type;
    }
  },
};
</script>
