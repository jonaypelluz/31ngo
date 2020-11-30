<template>
  <div class="game-info mt-4">
    <h3 class="mb-0">ID. de la partida</h3>
    <p class="game-tag">{{ game.hash }}</p>
    <div v-if="Object.keys(game.players).length > 0 && !game.hasFinished">
      <h4 class="mt-3">Jugadores online</h4>
      <p class="online-players">
        {{ Object.keys(game.players).length }}/{{ game.maxPlayers }}
      </p>
    </div>
    <div v-else>
      <h4 class="mt-3">Cantidad de jugadores</h4>
      <p class="total-players">{{ game.maxPlayers }}</p>
    </div>
    <base-button class="mt-3" mode="flat" @click="deleteGame">
      Borrar partida
    </base-button>
  </div>
</template>

<script>
import fb from '@/services/firebase/fb.js';

export default {
  props: ['game'],
  methods: {
    deleteGame() {
      fb.deleteGame(this.game.hash, this.game.host).then((deleted) => {
        if (deleted) {
          this.$router.push('/');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.game-info {
  h3 {
    margin-bottom: 2rem;
    span {
      font-weight: 800;
    }
  }
  h3,
  h4 {
    font-size: 1.3rem;
  }
  .game-tag {
    font-size: 1rem;
  }

  .online-players {
    font-size: 3rem;
    line-height: 1;
  }
}
</style>