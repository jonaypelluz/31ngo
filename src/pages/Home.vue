<template>
  <base-centre-container>
    <h1><img class="logo mt-4 mb-2" src="@/assets/logo.svg" alt="31ngo" /></h1>
    <base-button v-if="showActions" link :to="hostUrl" class="mr-5"
      >Anfitrión</base-button
    >
    <base-button v-if="showActions" link :to="playerUrl">Jugador</base-button>
  </base-centre-container>
</template>

<script>
import helpers from '@/utils/helpers.js';
import fb from '@/services/firebase/fb.js';

export default {
  data() {
    return {
      games: [],
      showActions: false,
    };
  },
  computed: {
    hostUrl() {
      return 'host';
    },
    playerUrl() {
      return 'player';
    },
  },
  created() {
    const uuid = this.$store.getters['getUser'];
    if (!uuid) {
      this.showActions = true;
      const uuid = helpers.uuidv4();
      this.$store.dispatch('setUser', { uuid: uuid });
    } else {
      fb.getUserGame(uuid.uuid).then((game) => {
        if (!game) {
          this.showActions = true;
        } else {
          if (game.hasFinished) {
            this.showActions = true;
          } else {
            this.$router.push(`/games/host/${game.hash}`);
          }
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  max-width: 10em;
}

@media (max-width: 575px) {
  .logo {
    max-width: 5em;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
}
</style>
