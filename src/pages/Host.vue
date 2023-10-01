<template>
  <base-centre-container>
    <div class="form-wrapper text-center">
      <h2 class="mb-2">Anfitrión</h2>
      <div v-if="showActions">
        <div class="game-mode" v-if="!mode">
          <label>Elige el modo de juego</label>
          <p class="description">
            En el modo de juego <b>PÚBLICO</b> podrán participar los jugadores
            que quieran, en el <b>PRIVADO</b> se limita hasta 40 jugadores que
            tendrán un código de partida privado para cada uno de ellos. Una vez
            que el anfitrión empieza la partida no se podrá acceder a ella.
          </p>
          <base-button mode="flat" @click="chooseGameMode('private')">
            Privado
          </base-button>
          <base-button class="ml-3" @click="chooseGameMode('public')">
            Público
          </base-button>
        </div>
        <div v-if="mode === 'private'">
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
        </div>
        <base-button mode="animation" v-if="showCreateBtn" @click="createGame">
          Crear partida
        </base-button>
      </div>
      <base-card v-if="game">
        <h3 class="mb-2">Partida creada</h3>
        <h5>
          Copia el código de la partida y envíalo a quien quieras que participe
          <span class="d-block mt-2 mb-3">
            <span class="black">{{ game.hash }}</span>
            <img
              class="ml-3 copy-svg"
              src="@/assets/icons/copy.svg"
              @click="copyHash"
            />
            <div class="black mt-2">{{ copiedText }}</div>
          </span>
          <div v-if="mode === 'private'">
            Los códigos individuales los encontrarás al entrar en la partida en
            la barra lateral.
          </div>
        </h5>
        <base-button class="mb-2" mode="animation" link :to="hostUrl">
          Entrar en la partida
        </base-button>
      </base-card>
    </div>
  </base-centre-container>
</template>

<script>
import Constants from '@/constants.js';
import helpers from '@/utils/helpers.js';
import fb from '@/services/firebase/fb.js';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      players: 0,
      game: null,
      copiedText: '',
      mode: null,
    };
  },
  computed: {
    ...mapState(['user']),
    showCreateBtn() {
      return (
        !this.game &&
        (this.mode === Constants.BINDO_MODE_PUBLIC ||
          (this.players > 0 &&
            this.players <= Constants.BINDO_MODE_PRIVATE_MAX_PLAYERS))
      );
    },
    showActions() {
      return !this.game;
    },
    hostUrl() {
      return `/games/host/${this.game.hash}`;
    },
  },
  methods: {
    chooseGameMode(mode) {
      if (
        mode === Constants.BINDO_MODE_PRIVATE ||
        mode === Constants.BINDO_MODE_PUBLIC
      ) {
        this.mode = mode;
      }
    },
    copyHash() {
      navigator.clipboard.writeText(this.game.hash);
      this.copiedText = '¡Copiado!';
    },
    increasePlayers() {
      this.players++;
      if (this.players > Constants.BINDO_MODE_PRIVATE_MAX_PLAYERS) {
        this.players = Constants.BINDO_MODE_PRIVATE_MAX_PLAYERS;
      }
    },
    decreasePlayers() {
      this.players--;
      if (this.players < 0) {
        this.players = 0;
      }
    },
    async createGame() {
      let codes = [];
      if (this.mode === Constants.BINDO_MODE_PRIVATE) {
        for (let i = 0; i < this.players; i++) {
          codes.push(helpers.createHash(8));
        }
      }
      const theGame = {
        hash: helpers.createHash(),
        maxPlayers: this.players,
        host: this.user.uuid,
        mode: this.mode,
        codes: codes,
      };
      this.$store.dispatch('gam/createGame', theGame);
      const gameData = this.$store.getters['gam/getGame'];
      await fb.createGame(gameData);
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

.game-mode {
  label {
    display: block;
  }
}

.description {
  max-width: 460px;
  margin: 0 auto 1.5rem;

  b {
    font-weight: 800;
  }
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

.copy-svg {
  cursor: pointer;
}
</style>
