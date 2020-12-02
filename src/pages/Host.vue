<template>
  <base-centre-container>
    <div class="form-wrapper text-center">
      <h2 class="my-3 mb-2">Anfitrión</h2>
      <div v-if="showActions">
        <label>Introduce cantidad de jugadores</label>
        <div class="controls">
          <base-button v-if="!game" mode="flat" @click="decreasePlayers">
            -
          </base-button>
          <span class="form-control">{{ players }}</span>
          <base-button
            v-if="!game"
            mode="flat"
            @click="increasePlayers"
            class="pb-0"
          >
            +
          </base-button>
        </div>
        <base-button mode="animation" v-if="showCreateBtn" @click="createGame">
          Crear partida
        </base-button>
      </div>
      <base-card v-if="game">
        <h3 class="mb-4">Partida creada</h3>
        <h5>
          Copia el código
          <span class="d-block mt-2 mb-3">
            <span class="black">{{ game.hash }}</span>
            <img
              class="ml-3 copy-svg"
              src="@/assets/icons/copy.svg"
              @click="copyHash"
            />
            <div class="black mt-2">{{ copiedText }}</div>
          </span>
        </h5>
        <base-button class="mb-5" mode="animation" link :to="hostUrl">
          Entrar en la partida
        </base-button>
      </base-card>
    </div>
  </base-centre-container>
</template>

<script>
import helpers from '@/utils/helpers.js';
import fb from '@/services/firebase/fb.js';
import gameApi from '@/services/api/game.js';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      players: 0,
      game: null,
      copiedText: '',
    };
  },
  computed: {
    ...mapState(['user']),
    showCreateBtn() {
      return !this.game && this.players > 0 && this.players <= 20;
    },
    showActions() {
      return !this.game;
    },
    hostUrl() {
      return `/games/host/${this.game.hash}`;
    },
  },
  methods: {
    copyHash() {
      navigator.clipboard.writeText(this.game.hash);
      this.copiedText = '¡Copiado!';
    },
    increasePlayers() {
      this.players++;
      if (this.players > 20) {
        this.players = 20;
      }
    },
    decreasePlayers() {
      this.players--;
      if (this.players < 0) {
        this.players = 0;
      }
    },
    async createGame() {
      const theGame = {
        hash: helpers.createHash(),
        maxPlayers: this.players,
        host: this.user.uuid,
      };
      this.$store.dispatch('gam/createGame', theGame);
      const gameData = this.$store.getters['gam/getGame'];
      await gameApi.createGame(gameData);
      await gameApi.addGameToUser(gameData);
      this.game = theGame;
    },
  },
  created() {
    fb.getUserGame(this.user.uuid).then((game) => {
      if (game && game.hasFinished) {
        this.$router.push(`/games/host/${game.hash}`);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
label {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.controls {
  margin-bottom: 1.2rem;
  span {
    width: 7rem;
    height: 5rem;
    font-size: 5rem;
    margin: 0 0.5rem;
    display: inline-block;
    line-height: 0.8;
    color: #fff;
    background: transparent;
    border: 0 none;
  }
  button {
    position: relative;
    top: -10px;
    display: inline-block;
    width: 5rem;
    height: 5rem;
    font-size: 3rem;
    outline: none;
    padding: 0;
    padding-bottom: 0.4rem;
  }
}

.black {
  color: #000;
}

.copy-svg {
  cursor: pointer;
}
</style>
