<template>
  <base-centre-container v-if="!isLoading">
    <div class="player-drawn-number mb-2">
      <span class="drawn-number" v-if="drawnNumber">{{ drawnNumber }}</span>
      <span class="game-finished mr-3" v-if="hasFinished">
        ¡El juego ha finalizado!
        {{ winner }}
      </span>
      <div v-else>
        <base-button
          class="line-btn"
          :class="{ show: isNotLineWinner }"
          @click="yellLine"
        >
          ¡Línea!
        </base-button>
        <base-button
          class="bingo-btn ml-3"
          v-if="isNotFullHouseWinner"
          @click="yellFullHouse"
        >
          ¡Bingo!
        </base-button>
        <base-button v-if="drawnNumber" class="mark-btn" @click="markNumbers">
          Marcar números
        </base-button>
      </div>
    </div>
    <player-card :game="game" @add-bingo-card="addBingoCard" />
    <base-dialog :show="yell !== null" :title="dialogTitle">
      <div class="text-center">
        <p>
          El anfitrión está revisando
          {{ yell !== 'line' ? 'el bingo' : 'la línea' }}...
        </p>
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <template #actions></template>
    </base-dialog>
  </base-centre-container>
</template>

<script>
import PlayerCard from '@/components/game/PlayerCard';
import { wsManager } from '@/services/ws/webSocketManager';

export default {
  components: {
    PlayerCard,
  },
  props: ['id'],
  data() {
    return {
      drawnNumber: null,
      game: null,
      user: null,
      isLoading: false,
      ws: null,
      yell: null,
    };
  },
  computed: {
    dialogTitle() {
      return `¡Han cantado ${this.yell !== 'line' ? 'bingo' : 'línea'}!`;
    },
    isHost() {
      return this.game && this.game.host === this.user.uuid;
    },
    hasFinished() {
      return this.game.hasFinished;
    },
    isNotLineWinner() {
      return (
        this.game.drawnNumbers.length > 4 &&
        !this.game.winners.line &&
        this.yell === null
      );
    },
    isNotFullHouseWinner() {
      return (
        this.game.drawnNumbers.length > 14 &&
        !this.game.winners.bingo &&
        this.yell === null
      );
    },
    winner() {
      if (this.game.winners.bingo) {
        return this.game.winners.bingo === this.user.uuid
          ? '¡Has ganado!'
          : `El ganador es ${this.game.winners.bingo}`;
      } else {
        return '';
      }
    },
  },
  methods: {
    yellLine(e) {
      e.target.blur();
      this.yell = 'line';
      this.ws.send({
        gameId: this.id,
        type: 'line',
        uuid: this.user.uuid,
      });
    },
    yellFullHouse(e) {
      e.target.blur();
      this.yell = 'bingo';
      this.ws.send({
        gameId: this.id,
        type: 'bingo',
        uuid: this.user.uuid,
      });
    },
    addBingoCard(data) {
      this.$store.dispatch('gam/addUserInfo', {
        numbers: data.numbers,
        bingoCard: data.bingoCard,
      });
      this.ws.send({
        gameId: this.id,
        type: 'adduser',
        data: data,
        uuid: this.user.uuid,
      });
    },
    async getGameInfo() {
      this.isLoading = true;
      this.user = this.$store.getters['getUser'];
      this.game = await this.$store.dispatch('gam/getGame', this.id);
      if (!this.game.hash || this.game.host === this.user.uuid) {
        this.$router.replace('/game-not-found');
      } else {
        this.getDrawnNumber();
        this.addUserInfo();
        this.isLoading = false;
      }
    },
    getDrawnNumber() {
      if (this.game.drawnNumbers.length > 0 && !this.game.hasFinished) {
        this.drawnNumber = this.game.drawnNumbers[
          this.game.drawnNumbers.length - 1
        ];
      }
    },
    addUserInfo() {
      let players = this.$store.getters['gam/getPlayers'];
      if (this.user.uuid in players) {
        // The user is in the game
      } else if (
        Object.keys(players).length < this.game.maxPlayers ||
        this.game.maxPlayers === 0
      ) {
        this.$store.dispatch('gam/addUserInfo', {});
      } else {
        this.$router.replace('/game-not-found');
      }
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
    handleWsMsg(data) {
      if (data.message) {
        const response = data.message;
        if (response.gameId === this.id) {
          this.addDrawnNumber(response);
          this.isGameFinished(response);
          this.setWinners(response);
        }
        if (response.type === 'line' || response.type === 'bingo') {
          this.yell = response.type;
        }
        if (response.type === 'notwinner') {
          this.yell = null;
        }
      }
    },
    setWinners(response) {
      if (response.type === 'winner') {
        this.yell = null;
        let winners = this.$store.getters['gam/getWinners'];
        winners[response.winType] = response.uuid;
        this.$store.dispatch('gam/setLocalWinners', winners);
      }
    },
    isGameFinished(response) {
      if (response.type === 'finish') {
        this.game.hasFinished = true;
      }
    },
    addDrawnNumber(response) {
      if (response.type === 'num' && response.num !== null) {
        this.drawnNumber = response.num;
        if (!this.game.drawnNumbers.includes(response.num)) {
          this.game.drawnNumbers.push(response.num);
        }
      }
    },
  },
  created() {
    this.getGameInfo();
  },
  mounted() {
    this.ws = wsManager;
    this.ws.connect(this.id, this.user.uuid);
    this.ws.on('ws-msg', this.handleWsMsg);
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