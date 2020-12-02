<template>
  <base-centre-container v-if="!isLoading">
    <div class="player-drawn-number mb-2">
      <span class="drawn-number" v-if="drawnNumber">{{ drawnNumber }}</span>
      <span class="game-finished mr-3" v-if="game.hasFinished">
        ¡El juego ha finalizado!
        {{ winner }}
      </span>
      <div v-else>
        <base-button
          class="line-btn"
          :class="{ show: showLineBtn }"
          @click="yellAction($event, 'line')"
        >
          ¡Línea!
        </base-button>
        <base-button
          class="bingo-btn ml-3"
          v-if="showFullHouseBtn"
          @click="yellAction($event, 'bingo')"
        >
          ¡Bingo!
        </base-button>
        <base-button v-if="drawnNumber" class="mark-btn" @click="markNumbers">
          Marcar números
        </base-button>
      </div>
    </div>
    <player-card :game="game" @add-bingo-card="addBingoCard" />
    <base-dialog :show="yell && yell.type !== null">
      <div class="text-center">
        <p>{{ yellTitle }}</p>
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Comprobando...</span>
        </div>
      </div>
      <template #actions></template>
    </base-dialog>
  </base-centre-container>
</template>

<script>
import gameApi from '@/services/api/game.js';
import PlayerCard from '@/components/game/PlayerCard';
import { wsManager } from '@/services/ws/webSocketManager';
import { mapState } from 'vuex';

export default {
  components: {
    PlayerCard,
  },
  props: ['id'],
  data() {
    return {
      isLoading: false,
      ws: null,
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapState('gam', ['game', 'yell']),
    drawnNumber() {
      return this.$store.getters['gam/getLastDrawnNumber'];
    },
    showLineBtn() {
      return (
        this.yell &&
        this.game.drawnNumbers.length > 4 &&
        !this.game.winners.line &&
        this.yell.type === null
      );
    },
    showFullHouseBtn() {
      return (
        this.yell &&
        this.game.drawnNumbers.length > 14 &&
        !this.game.winners.bingo &&
        this.yell.type === null
      );
    },
    winner() {
      let winner = '';
      if (this.game.winners.bingo) {
        winner =
          this.game.winners.bingo === this.user.uuid
            ? '¡Has ganado!'
            : `El ganador es ${this.game.winners.bingo}`;
      }
      return winner;
    },
    yellTitle() {
      return this.yell
        ? `¡Han cantado ${
            this.yell.type !== 'line' ? 'bingo' : 'línea'
          }!... se está revisando...`
        : '';
    },
  },
  methods: {
    async addBingoCard(data) {
      this.$store.dispatch('gam/addUserInfo', data);
      await gameApi.addUserInfo(this.id, this.user.uuid, data);
      this.sendWsMsg({
        type: 'adduser',
        data: data,
        uuid: this.user.uuid,
      });
    },
    markNumbers(e) {
      e.target.blur();
      document.querySelectorAll('.number').forEach((number) => {
        if (
          this.game.drawnNumbers.includes(parseInt(number.innerText)) &&
          !number.classList.contains('selected')
        ) {
          number.classList.add('selected');
        }
      });
    },
    sendWsMsg(data) {
      this.ws.send({
        ...data,
        gameId: this.id,
      });
    },
    yellAction(e, type) {
      e.target.blur();
      this.$store.dispatch('gam/updateYell', {
        type: type,
        uuid: this.user.uuid,
      });
      this.sendWsMsg({
        type: type,
        uuid: this.user.uuid,
      });
    },
  },
  async mounted() {
    this.isLoading = true;

    // Get game
    const theGame = await gameApi.fetchGame(this.id);
    this.$store.dispatch('gam/updateGame', theGame);
    this.isLoading = false;

    if (!this.game.hash || this.game.host === this.user.uuid) {
      this.$router.replace('/game-not-found');
    }
    this.ws = wsManager;
    this.ws.connect(this.id, this.user.uuid);
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.player-drawn-number {
  max-width: 76%;
  margin: 0 auto;
  position: relative;
  font-size: 2rem;
  .drawn-number {
    color: #000;
    background-color: $secondary;
    display: inline-block;
    font-weight: 800;
    width: 1.5em;
    border-radius: 5em;
    position: absolute;
    left: -0.5em;
    top: 0.5em;
    z-index: 101;
    font-size: 3rem;
  }
  .game-finished {
    font-size: 1rem;
  }
}

.spinner-border {
  margin: 3rem;
  width: 3rem;
  height: 3rem;
}

.bingo-btn,
.line-btn,
.mark-btn {
  background: $secondary;
  border-color: $secondary;
  position: relative;
  box-shadow: none;
  border-radius: 1rem 1rem 0 0;
  top: 8px;
  &:hover,
  &:focus {
    position: relative;
    top: 8px;
    background: $secondary;
  }
}

.mark-btn {
  float: right;
  margin-right: 3rem;
  top: 14px;
  &:hover,
  &:focus {
    top: 14px;
  }
}

.line-btn {
  visibility: hidden;
  &.show {
    visibility: visible;
  }
}

@media (min-width: 320px) {
  .player-drawn-number {
    .drawn-number {
      font-size: 2.3rem;
      top: 0.7em;
    }
  }
  .bingo-btn,
  .line-btn,
  .mark-btn {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    top: 32px;
    &:hover,
    &:focus {
      top: 32px;
    }
  }

  .mark-btn {
    margin-right: 2rem;
  }
}

@media (max-width: 575px) {
  .player-drawn-number {
    max-width: 96%;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .player-drawn-number {
    max-width: 96%;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .player-drawn-number {
    max-width: 96%;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .player-drawn-number {
    max-width: 96%;
  }
}
</style>