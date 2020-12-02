<template>
  <base-centre-container v-if="!isLoading">
    <host-card
      v-if="!game.hasFinished"
      :game="game"
      :numbers="totalNumbers"
      :number="drawnNumber"
      :automode="automode"
      @draw-number="drawNumber"
      @game-has-finished="finishGame"
    />
    <div v-else>
      <h3>¡La partida ha finalizado!</h3>
      <div v-if="winner">
        <h2 class="mb-5">El ganador es:</h2>
        <h1>
          <b>{{ winner }}</b>
        </h1>
      </div>
    </div>
    <base-slide>
      <numbers-card :game="game" :uuid="user.uuid" />
    </base-slide>
    <base-slide multiple="true">
      <info-card :game="game" />
    </base-slide>
    <base-dialog :show="showYell" :title="yellTitle" @close="notValidWinner()">
      <div>
        <p>
          Identificador del jugador: <b>{{ yell.uuid }}</b>
        </p>
        <div class="user-bingo-card-wrapper" v-if="yellCard">
          <div
            class="user-bingo-card"
            v-for="(row, idx) in yellCard"
            :key="idx"
          >
            <div
              class="user-number"
              :class="{
                empty: num === 0,
                selected: game.drawnNumbers.includes(num),
              }"
              v-for="num in row"
              :key="num"
            >
              {{ num === 0 ? '' : num }}
            </div>
          </div>
        </div>
      </div>
      <template #actions>
        <base-button class="black" mode="flat" @click="notValidWinner()">
          No válido
        </base-button>
        <base-button class="ml-5" @click="setValidWinner()">
          Válido
        </base-button>
      </template>
    </base-dialog>
  </base-centre-container>
</template>

<script>
import Constants from '@/constants.js';
import HostCard from '@/components/game/HostCard';
import InfoCard from '@/components/game/InfoCard';
import NumbersCard from '@/components/game/NumbersCard';
import gameApi from '@/services/api/game.js';
import { mapState } from 'vuex';
import { wsManager } from '@/services/ws/webSocketManager';

export default {
  components: {
    InfoCard,
    HostCard,
    NumbersCard,
  },
  props: ['id'],
  data() {
    return {
      totalNumbers: Constants.BINGO_CARD_TOTAL_NUMBERS,
      isLoading: false,
      ws: null,
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapState('gam', ['yell', 'game']),
    drawnNumber() {
      return this.$store.getters['gam/getLastDrawnNumber'];
    },
    automode() {
      return this.yell.type !== null ? 'stop' : null;
    },
    showYell() {
      return this.yell.type !== null;
    },
    yellCard() {
      let card = null;
      if (this.showYell) {
        const player = this.game.players[this.yell.uuid];
        card = player.bingoCard;
      }
      return card;
    },
    yellTitle() {
      return this.yell
        ? `¡Comprobar resultados de ${
            this.yell.type !== 'line' ? 'bingo' : 'línea'
          }!`
        : '';
    },
    winner() {
      return this.game.winners.bingo;
    },
  },
  methods: {
    closeYell() {
      this.$store.dispatch('gam/resetYell');
    },
    async drawNumber() {
      let loop = true;
      while (loop) {
        let randNum =
          Math.floor(Math.random() * Constants.BINGO_CARD_TOTAL_NUMBERS) + 1;
        if (!this.game.drawnNumbers.includes(randNum)) {
          this.$store.dispatch('gam/addDrawnNumber', randNum);
          await gameApi.addDrawnNumbers(this.game);
          break;
        }
        if (
          this.game.drawnNumbers.length >= Constants.BINGO_CARD_TOTAL_NUMBERS
        ) {
          break;
        }
      }

      this.sendWsMsg({
        type: 'num',
        num: this.drawnNumber,
        uuid: this.user.uuid,
      });

      this.isGameStarted();
    },
    async finishGame() {
      this.sendWsMsg({
        type: 'finish',
        uuid: this.user.uuid,
      });
      await gameApi.hasFinished(this.game.hash);
    },
    async getGameInfo() {
      this.isLoading = true;

      // Get game
      const theGame = await gameApi.fetchGame(this.id);
      this.$store.dispatch('gam/updateGame', theGame);

      if (!this.game || this.game.host !== this.user.uuid) {
        this.$router.replace('/game-not-found');
      } else {
        this.isLoading = false;
      }
    },
    async isGameStarted() {
      if (
        !this.game.hasStarted &&
        this.game.drawnNumbers &&
        this.game.drawnNumbers.length > 0
      ) {
        await gameApi.hasStarted(this.id);
        this.$store.dispatch('gam/hasStarted');
      }
    },
    notValidWinner() {
      this.sendWsMsg({
        type: 'notwinner',
        winType: this.yell.type,
        uuid: this.yell.uuid,
      });
      this.closeYell();
    },
    sendWsMsg(data) {
      this.ws.send({
        ...data,
        gameId: this.id,
      });
    },
    async setValidWinner() {
      if (this.yell.type !== null) {
        this.$store.dispatch('gam/setWinner', {
          uuid: this.yell.uuid,
          type: this.yell.type,
        });

        // We wait to update the firebase before we send websocket message
        const winners = this.$store.getters['gam/getWinners'];
        await gameApi.updateWinners(this.game.hash, winners);

        this.sendWsMsg({
          type: 'winner',
          winType: this.yell.type,
          uuid: this.yell.uuid,
        });

        if (this.yell.type === 'bingo') {
          this.finishGame();
        }
      }
      this.closeYell();
    },
  },
  created() {
    this.getGameInfo();
  },
  mounted() {
    this.ws = wsManager;
    this.ws.connect(this.id, this.user.uuid);
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

b {
  font-weight: 800;
}
.user-bingo-card-wrapper {
  border: 1px solid #000;
  border-radius: 1rem;
  .user-bingo-card {
    display: grid;
    grid-template-columns: repeat(9, 10.2%);
    grid-gap: 1%;
    padding: 1%;
    .user-number {
      font-size: 1.8rem;
      color: #000;
      position: relative;
      z-index: 100;
      text-align: center;
      border-radius: 15%;
      background-color: #fff;
      &.selected {
        background-color: $fifth;
      }
      &.empty {
        background-color: #333333;
        cursor: initial;
      }
    }
  }
}
</style>