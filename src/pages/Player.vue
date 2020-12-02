<template>
  <base-centre-container>
    <div class="form-wrapper">
      <h2 class="mb-5">Jugador</h2>
      <div class="form-group">
        <label for="players">Introduce un código de partida</label>
        <input
          type="text"
          id="players"
          placeholder="Código de partida"
          class="form-control"
          :value="gameId"
          @input="gameId = $event.target.value.toUpperCase()"
        />
        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          {{ error }}
        </div>
        <base-button
          v-if="gameId && !isLoading"
          @click="checkGame"
          class="mt-3"
          mode="animation"
        >
          Entrar en la partida
        </base-button>
      </div>
    </div>
  </base-centre-container>
</template>

<script>
import fb from '@/services/firebase/fb.js';

export default {
  data() {
    return {
      gameId: null,
      isLoading: false,
      user: null,
      error: '',
    };
  },
  methods: {
    async checkGame() {
      this.isLoading = true;
      const game = await fb.getGame(this.gameId);
      if (!game.hash) {
        this.error = 'No se ha encontrado esa partida.';
      } else {
        if (game.hasFinished) {
          this.error = 'Esa partida ya ha finalizado.';
        } else if (
          game.players &&
          Object.keys(game.players).includes(this.user.uuid)
        ) {
          this.$router.push(`/games/player/${game.hash}`);
        } else if (game.hasStarted) {
          this.error = 'Esa partida ya ha empezado.';
        } else if (
          game.players &&
          game.players.length >= game.maxPlayers &&
          !Object.keys(game.players).includes(this.user.uuid)
        ) {
          this.error = 'Esta partida ya tiene el número de jugadores máximos.';
        } else {
          this.$router.push(`/games/player/${game.hash}`);
        }
      }
      this.isLoading = false;
    },
  },
  created() {
    this.user = this.$store.getters['getUser'];
    this.$store.dispatch('gam/resetGame');
  },
};
</script>

<style scoped></style>
