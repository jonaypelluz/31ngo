<template>
  <div class="container-fluid">
    <header>
      <router-link to="/">
        <img class="main-logo" src="@/assets/logo-white.svg" alt="31ngo" />
      </router-link>
    </header>
  </div>
</template>

<style lang="scss" scoped>
a {
  color: #fff;
  &:hover,
  &:focus {
    text-decoration: none;
  }
}

header {
  position: fixed;
  left: 5px;
  top: 5px;
  z-index: 1001;
}

.main-logo {
  max-width: 60px;
}
</style>
