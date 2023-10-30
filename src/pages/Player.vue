<template>
  <base-centre-container>
    <div class="form-wrapper">
      <h2 class="mb-5">Jugador</h2>
      <div class="form-group">
        <label for="players">Introduce un código de partida</label>
        <input id="players" type="text" placeholder="Código de partida" class="form-control" :value="gameId"
          @input="gameId = $event.target.value.toUpperCase()" />
        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          {{ error }}
        </div>
        <base-button v-if="gameId && !isLoading" class="mt-3" mode="animation" @click="checkGame">
          Entrar en la partida
        </base-button>
      </div>
    </div>
    <base-dialog :show="showCodeModal">
      Te quieres unir a una partida privada, tienes que introducir un segundo código de jugador
      invitado para poder entrar.
      <input v-model="gameCode" type="text" placeholder="Código de jugador" class="form-control" />
      <span v-if="showCodeError" class="text-danger">
        El código no es correcto, vuelve a pedirle al anfitrión un código que sea correcto.
      </span>
      <template #actions>
        <base-button @click="sendGameCode">Enviar</base-button>
      </template>
    </base-dialog>
  </base-centre-container>
</template>

<script>
import Constants from '@/constants.js';

export default {
  data() {
    return {
      gameId: null,
      isLoading: false,
      user: null,
      error: '',
      game: null,
      gameCode: null,
      showCodeModal: false,
      showCodeError: false,
    };
  },
  created() {
    this.user = this.$store.getters['getUser'];
    this.$store.dispatch('gam/resetGame');
  },
  methods: {
    async checkGame() {
      this.isLoading = true;
      console.log('GET THE GAME');
      // this.game = await fb.getGame(this.gameId);
      this.game = [];
      this.checkIfExists();
      this.isLoading = false;
    },
    async sendGameCode() {
      if (this.game.codes.includes(this.gameCode)) {
        if (!this.game.usedCodes) {
          this.game.usedCodes = [];
        }
        this.game.usedCodes.push(this.gameCode);
        console.log('ADD USER CODE');
        // await fb.addUsedCode(this.game.hash, this.game.usedCodes);
        this.$router.push(`/games/player/${this.game.hash}`);
      } else {
        this.showCodeError = true;
      }
      this.gameCode;
    },
    checkIfExists() {
      if (!this.game.hash) {
        this.error = 'No se ha encontrado esa partida.';
      } else {
        this.checkIfHasFinished();
      }
    },
    checkIfHasFinished() {
      if (this.game.hasFinished) {
        this.error = 'Esa partida ya ha finalizado.';
      } else {
        this.checkIfInPlayers();
      }
    },
    checkIfInPlayers() {
      if (this.game.players && Object.keys(this.game.players).includes(this.user.uuid)) {
        this.$router.push(`/games/player/${this.game.hash}`);
      } else {
        this.checkIfHasStarted();
      }
    },
    checkIfHasStarted() {
      if (this.game.hasStarted) {
        this.error = 'Esa partida ya ha empezado.';
      } else {
        this.checkIfPrivate();
      }
    },
    checkIfPrivate() {
      if (this.game.mode === Constants.BINDO_MODE_PRIVATE) {
        this.showCodeModal = true;
      } else {
        this.$router.push(`/games/player/${this.game.hash}`);
      }
    },
  },
};
</script>

<style scoped>
</style>
