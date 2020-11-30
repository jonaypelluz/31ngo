<template>
  <div class="slide-wrapper" :class="{ show: showSlide, multiple: multiple }">
    <div class="slide-btn-wrapper">
      <button @click="toggleSlide"></button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['multiple'],
  data() {
    return {
      showSlide: false,
    };
  },
  methods: {
    toggleSlide(e) {
      e.target.blur();
      this.showSlide = !this.showSlide;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.slide-wrapper {
  position: fixed;
  right: -35em;
  top: 0;
  bottom: 0;
  min-width: 35em;
  background-color: $secondary;
  z-index: 101;
  border-left: 1px solid #000;
  transition: 0.5s ease-in-out;
  &.multiple {
    .slide-btn-wrapper {
      top: 7.2em;
    }
  }
  &.show {
    right: 0;
    z-index: 102;
  }
  .slide-btn-wrapper {
    cursor: pointer;
    position: absolute;
    left: -4em;
    top: 1em;
    width: 4em;
    height: 4em;
    border: 1px solid #000;
    border-right: 0 none;
    border-radius: 1em 0 0 1em;
    background-color: $secondary;
    text-align: center;
    button {
      border: 1px solid #000;
      margin-top: 0.45em;
      width: 3em;
      height: 3em;
      border-radius: 1em;
      background-color: #fff;
    }
  }
}

@media (max-width: 320px) {
  .slide-wrapper {
    width: 19em;
    min-width: 19em;
    right: -19em;
    .slide-btn-wrapper {
      top: 3em;
      left: -3.96em;
    }
  }
}

@media (min-width: 321px) and (max-width: 575px) {
  .slide-wrapper {
    width: 30em;
    min-width: 30em;
    right: -30em;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .slide-wrapper {
    width: 30em;
    min-width: 30em;
    right: -30em;
  }
}
</style>