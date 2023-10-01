<template>
  <player-actions @yell-action="yellAction" @mark-numbers="markNumbers" :game="game" :drawn-number="drawnNumber"
    :show-full-house-btn="showFullHouseBtn" :show-line-btn="showLineBtn" :winner="winner" />
  <base-centre-container v-if="!isLoading">
    <player-card :game="game" @add-bingo-card="addName" />
    <base-dialog :show="showNameForm">
      Añade un nombre de jugador
      <input type="text" placeholder="Nombre" class="form-control" v-model="userName" />
      <span class="text-danger" v-if="showNameError">
        Tienes que añadir un nombre
      </span>
      <template #actions>
        <base-button @click="addBingoCard">Enviar</base-button>
      </template>
    </base-dialog>
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
import PlayerActions from '@/components/game/PlayerActions.vue';
import PlayerCard from '@/components/game/PlayerCard.vue';
import fb from '@/services/firebase/fb.js';
import { wsManager } from '@/services/ws/webSocketManager';
import { mapState } from 'vuex';

export default {
  components: {
    PlayerCard,
    PlayerActions,
  },
  props: ['id'],
  data() {
    return {
      isLoading: false,
      ws: null,
      showNameForm: false,
      showNameError: false,
      userName: null,
      userData: null,
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
            : `El ganador es ${this.game.players[this.game.winners.bingo].name
            }`;
      }
      return winner;
    },
    yellTitle() {
      return this.yell
        ? `¡Han cantado ${this.yell.type !== 'line' ? 'bingo' : 'línea'
        }!... se está revisando...`
        : '';
    },
  },
  methods: {
    addName(data) {
      this.showNameForm = true;
      this.userData = data;
    },
    async addBingoCard() {
      if (this.userName === null || this.userData === null) {
        this.showNameError = true;
      } else {
        const data = {
          ...this.userData,
          name: this.userName,
        };
        this.showNameError = false;
        this.showNameForm = false;
        this.$store.dispatch('gam/addUserInfo', data);
        await fb.addUserInfo(this.id, this.user.uuid, data);
        this.sendWsMsg({
          type: 'adduser',
          data: data,
          uuid: this.user.uuid,
        });
      }
    },
    markNumbers() {
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
    yellAction(type) {
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
    const theGame = await fb.getGame(this.id);
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
