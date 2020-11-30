<template>
  <base-centre-container>
    <div class="form-wrapper">
      <h2 class="my-3 mb-2">Anfitrión</h2>
      <div class="text-center" v-if="showActions">
        <label>{{ secondTitle }}</label>
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
        <base-button
          mode="animation"
          v-if="showCreateBtn && !game"
          @click="createGame"
        >
          Crear partida
        </base-button>
        <base-card v-if="game">
          <h3 class="mb-4">Partida creada</h3>
          <h5>
            Copia el código
            <span class="d-block mt-2 mb-5">
              <span class="black">{{ game.hash }}</span>
              <img
                class="ml-3 copy-svg"
                src="@/assets/icons/copy.svg"
                @click="copyHash"
              />
            </span>
          </h5>
          <base-button class="mb-5" mode="animation" link :to="hostUrl">
            Entrar en la partida
          </base-button>
        </base-card>
      </div>
    </div>
  </base-centre-container>
</template>

<script>
import helpers from '@/utils/helpers.js';
import fb from '@/services/firebase/fb.js';

export default {
  data() {
    return {
      players: 0,
      game: null,
      uuid: null,
      hash: '',
      showCreateBtn: false,
      showActions: false,
    };
  },
  computed: {
    secondTitle() {
      return this.game
        ? 'Cantidad de jugadores'
        : 'Introduce cantidad de jugadores';
    },
    hostUrl() {
      return `/games/host/${this.game.hash}`;
    },
  },
  methods: {
    copyHash() {
      navigator.clipboard.writeText(this.game.hash);
    },
    increasePlayers() {
      if (!this.hash) {
        this.createHash();
      }
      this.players++;
    },
    decreasePlayers() {
      if (!this.hash) {
        this.createHash();
      }
      this.players--;
    },
    async createGame() {
      const theGame = {
        hash: this.hash,
        maxPlayers: this.players,
        host: this.uuid,
      };
      await this.$store.dispatch('gam/createGame', theGame);
      this.game = theGame;
    },
    createHash() {
      this.hash = helpers.createHash();
    },
  },
  watch: {
    players() {
      if (this.players > 20) {
        this.players = 20;
      }
      if (this.players < 0) {
        this.players = 0;
      }
      this.showCreateBtn = this.players > 0 && this.players <= 20;
    },
  },
  created() {
    const user = this.$store.getters['getUser'];
    this.uuid = user.uuid;
    fb.getUserGame(this.uuid).then((game) => {
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
