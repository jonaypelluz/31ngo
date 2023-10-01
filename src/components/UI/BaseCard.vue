<template>
  <div class="card-box">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.card-box {
  background: $secondary;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 0 auto 2rem;
}
</style>
