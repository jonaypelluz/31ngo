<template>
  <div class="game-info mt-4">
    <div class="row">
      <div class="col">
        <h3 class="mb-0">ID. de la partida</h3>
        <p class="game-tag black">{{ game.hash }}</p>
      </div>
      <div class="col">
        <div v-if="!game.hasFinished">
          <h4>Jugadores online</h4>
          <p class="online-players">
            {{ onlinePlayers }}
          </p>
        </div>
      </div>
    </div>
    <div class="player-names mb-3" v-if="showPlayerNames">
      <h4 class="mt-3">Nombres de los jugadores</h4>
      <span v-for="(player, idx) in game.players" :key="idx">
        {{ player.name }}{{ addComa(this.game.players.length, idx) }}
      </span>
    </div>
    <div class="game-codes mb-3" v-if="showPlayersCodes">
      <h4 class="mt-3">Códigos de jugadores</h4>
      <ul class="player-codes">
        <li
          v-for="code in game.codes"
          :key="code"
          :class="{
            selected: game.usedCodes.includes(code),
          }"
          @click="copyHash($event, code)"
        >
          {{ code }} <span class="black">!Copiado!</span>
        </li>
      </ul>
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
      if (this.game.mode === Constants.BINDO_MODE_PRIVATE) {
        players =
          Object.keys(this.game.players).length + '/' + this.game.maxPlayers;
      } else {
        players = Object.keys(this.game.players).length;
      }
      return players;
    },
    showPlayersCodes() {
      return this.game.mode === Constants.BINDO_MODE_PRIVATE;
    },
    showPlayerNames() {
      return (
        this.game.mode !== Constants.BINDO_MODE_PRIVATE &&
        this.game.players &&
        Object.keys(this.game.players).length > 0
      );
    },
  },
  methods: {
    addComa(length, idx) {
      return idx + 1 < length ? ', ' : '';
    },
    copyHash(e, code) {
      e.target.parentElement.querySelectorAll('.black').forEach((el) => {
        el.classList.remove('show');
      });
      e.target.blur();
      navigator.clipboard.writeText(code);
      e.target.querySelector('.black').classList.toggle('show');
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
    width: 80%;
    margin: 0 auto;

    .player-codes {
      width: 100%;
      height: 90px;
      overflow: auto;
      margin: 0;
      padding: 0;
      list-style: none;

      &::-webkit-scrollbar {
        -webkit-appearance: none;

        &:vertical {
          width: 12px;
        }

        &:horizontal {
          height: 12px;
        }
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        border: 2px solid #ffffff;
      }

      &::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: #ffffff;
      }

      li {
        font-size: 1.2rem;
        border-bottom: 1px dashed #fff;
        padding: 2px 0;

        &.selected {
          text-decoration: line-through;
          color: #000;
        }

        span {
          display: none;

          &.show {
            display: inline-block;
          }
        }
      }
    }
  }

  .online-players {
    margin-bottom: 0.2rem;
    font-size: 3rem;
    line-height: 1;
  }
}
</style>
