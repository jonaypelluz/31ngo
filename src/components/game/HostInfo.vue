<template>
  <div class="game-info mt-4">
    <h3 class="mb-0">ID. de la partida</h3>
    <p class="game-tag black">{{ game.hash }}</p>
    <div v-if="Object.keys(game.players).length > 0 && !game.hasFinished">
      <h4 class="mt-3">Jugadores online</h4>
      <p class="online-players">
        {{ onlinePlayers }}
      </p>
    </div>
    <div class="player-names mb-3">
      <h4 class="mt-3">Nombres de los jugadores</h4>
      <span v-for="(player, idx) in game.players" :key="idx">
        {{ player.name }}{{ addComa(this.game.players.length, idx) }}
      </span>
    </div>
    <div class="game-codes mb-3" v-if="showPlayersCodes">
      <h4 class="mt-3">Códigos de jugadores</h4>
      <span
        v-for="(code, idx) in game.codes"
        :key="code"
        :class="{
          selected: game.usedCodes.includes(code),
        }"
      >
        {{ code }}{{ addComa(this.game.codes.length, idx) }}
      </span>
    </div>
    <base-button class="mt-3" mode="flat" @click="deleteGame">
      Borrar partida
    </base-button>
  </div>
</template>

<script>
import fb from '@/services/firebase/fb.js';
import Constants from '@/constants.js';

export default {
  props: ['game'],
  computed: {
    onlinePlayers() {
      let players = '';
      if (this.game.players !== 0) {
        if (this.game.mode === Constants.BINDO_MODE_PRIVATE) {
          players =
            Object.keys(this.game.players).length + '/' + this.game.maxPlayers;
        } else {
          players = Object.keys(this.game.players).length;
        }
      }
      return players;
    },
    showPlayersCodes() {
      return this.game.mode === Constants.BINDO_MODE_PRIVATE;
    },
  },
  methods: {
    addComa(length, idx) {
      return idx + 1 < length ? ', ' : '';
    },
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
    font-size: 1.3rem;
  }

  .game-codes {
    max-width: 80%;
    margin: 0 auto;
    .selected {
      text-decoration: line-through;
      color: #000;
    }
  }

  .online-players {
    font-size: 3rem;
    line-height: 1;
  }
}
</style>