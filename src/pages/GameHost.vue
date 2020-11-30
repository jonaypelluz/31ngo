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
    <base-dialog
      :show="showDialog"
      :title="dialogTitle"
      @close="notValidWinner(userUuid, userWin)"
    >
      <div>
        <p>
          Identificador del jugador: <b>{{ userUuid }}</b>
        </p>
        <div class="user-bingo-card-wrapper" v-if="userBingoCard">
          <div
            class="user-bingo-card"
            v-for="(row, idx) in userBingoCard"
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
        <base-button
          class="black"
          mode="flat"
          @click="notValidWinner(userUuid, userWin)"
        >
          No válido
        </base-button>
        <base-button class="ml-5" @click="setValidWinner(userUuid, userWin)">
          Válido
        </base-button>
      </template>
    </base-dialog>
  </base-centre-container>
</template>

<script>
import Constants from '@/constants.js';
import HostCard from '@/components/game/HostCard';
import NumbersCard from '@/components/game/NumbersCard';
import { wsManager } from '@/services/ws/webSocketManager';
import InfoCard from '@/components/game/InfoCard';

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
      drawnNumber: null,
      game: null,
      user: null,
      isLoading: false,
      ws: null,
      showDialog: false,
      userBingoCard: null,
      userUuid: null,
      userYell: null,
      automode: null,
      userWin: null,
    };
  },
  computed: {
    hasFinished() {
      return this.game.hasFinished;
    },
    dialogTitle() {
      return `Comprobar resultados de ${this.userYell}`;
    },
    winner() {
      return this.game.winners.bingo;
    },
  },
  methods: {
    async finishGame() {
      this.game.hasFinished = true;
      this.ws.send({
        gameId: this.id,
        type: 'finish',
        uuid: this.user.uuid,
      });
      await this.$store.dispatch('gam/hasFinished', this.game.hash);
    },
    drawNumber() {
      let loop = true;
      while (loop) {
        let randNum =
          Math.floor(Math.random() * Constants.BINGO_CARD_TOTAL_NUMBERS) + 1;
        if (!this.game.drawnNumbers.includes(randNum)) {
          this.game.drawnNumbers.push(randNum);
          this.$store.dispatch('gam/addDrawNumber', randNum);
          this.drawnNumber = randNum;
          break;
        }
        if (
          this.game.drawnNumbers.length === Constants.BINGO_CARD_TOTAL_NUMBERS
        ) {
          break;
        }
      }
      this.remaingingNumbers =
        this.totalNumbers - this.game.drawnNumbers.length;

      this.ws.send({
        gameId: this.id,
        type: 'num',
        num: this.drawnNumber,
        uuid: this.user.uuid,
      });

      if (
        !this.game.hasStarted &&
        this.game.drawnNumbers &&
        this.game.drawnNumbers.length > 0
      ) {
        this.game.hasStarted = true;
        this.$store.dispatch('gam/hasStarted', this.id);
      }
    },
    async getGameInfo() {
      this.isLoading = true;
      this.user = this.$store.getters['getUser'];
      this.game = await this.$store.dispatch('gam/getGame', this.id);
      if (!this.game || this.game.host !== this.user.uuid) {
        this.$router.replace('/game-not-found');
      } else {
        this.getDrawnNumber();
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
    handleWsMsg(data) {
      if (data.message) {
        const response = data.message;
        if (response.gameId === this.id) {
          this.addUserToPlayers(response);
          this.yellCheck(response);
        }
      }
    },
    addUserToPlayers(response) {
      if (response.type === 'adduser') {
        if (!(response.uuid in this.game.players)) {
          this.game.players[response.uuid] = response.data;
        }
      }
    },
    yellCheck(response) {
      if (
        !this.showDialog &&
        (response.type === 'line' || response.type === 'bingo')
      ) {
        const player = this.game.players[response.uuid];
        this.showDialog = true;
        this.userBingoCard = player.bingoCard;
        this.userUuid = response.uuid;
        this.userWin = response.type;
        this.userYell = response.type === 'line' ? 'línea' : 'bingo';
        this.automode = 'stop';
      }
    },
    async setValidWinner(uuid, type) {
      if (type === 'line' || type === 'bingo') {
        await this.$store.dispatch('gam/setWinner', {
          uuid: uuid,
          type: type,
        });
        this.ws.send({
          gameId: this.id,
          type: 'winner',
          winType: type,
          uuid: uuid,
        });
        if (type === 'bingo') {
          this.finishGame();
        }
      }
      this.closeDialog();
    },
    notValidWinner(uuid, type) {
      this.ws.send({
        gameId: this.id,
        type: 'notwinner',
        winType: type,
        uuid: uuid,
      });
      this.closeDialog();
    },
    closeDialog() {
      this.showDialog = false;
      this.automode = null;
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