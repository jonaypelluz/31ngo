<template>
  <base-card class="host-card">
    <mode-switcher
      @set-bingo-mode="setBingoMode"
      :timer="timer"
      :showTimer="showTimer"
      :automatic="automatic"
    />
    <div class="drawn-number">
      <span>{{ shownNumber }}</span>
    </div>
    <div class="controls">
      <base-button
        v-if="number"
        class="finish-btn"
        mode="flat"
        @click="finishGame"
      >
        Final de la partida
      </base-button>
      <base-button
        class="action-btn"
        @click="drawTheNumber"
        v-if="showStartBtn"
      >
        {{ btnText }}
      </base-button>
      <p class="black" v-else>
        Mínimo tiene que haber un jugador online para poder empezar
      </p>
    </div>
  </base-card>
</template>

<script>
import Constants from '@/constants.js';
import ModeSwitcher from './ModeSwitcher.vue';

export default {
  components: {
    ModeSwitcher,
  },
  props: [
    'game',
    'draw-number',
    'numbers',
    'number',
    'game-has-finished',
    'automode',
  ],
  data() {
    return {
      timer: 10,
      showTimer: true,
      automatic: false,
      counterInterval: null,
      bingoInterval: null,
    };
  },
  computed: {
    showStartBtn() {
      return (
        this.game.drawnNumbers.length < this.numbers &&
        Object.keys(this.game.players).length > 0
      );
    },
    shownNumber() {
      return this.number &&
        this.game &&
        this.game.drawnNumbers.length < Constants.BINGO_CARD_TOTAL_NUMBERS
        ? this.number
        : '-';
    },
    btnText() {
      return this.number ? 'Nuevo número' : 'Empezar';
    },
  },
  methods: {
    setBingoMode(mode) {
      this.automatic = mode;
      if (this.automatic) {
        this.counterInterval = setInterval(() => {
          this.timer--;
          if (this.timer <= 0) {
            this.timer = Constants.BINDO_MODE_AUTOMATIC_TIMER;
            this.showTimer = false;
            this.drawANumber();
            clearInterval(this.counterInterval);
          }
        }, 1000);
      } else {
        this.stopAutomaticMode();
      }
    },
    stopAutomaticMode() {
      this.automatic = false;
      this.timer = Constants.BINDO_MODE_AUTOMATIC_TIMER;
      this.showTimer = true;
      clearInterval(this.counterInterval);
      clearInterval(this.bingoInterval);
    },
    drawANumber() {
      this.$emit('draw-number');
      this.bingoInterval = setInterval(() => {
        this.$emit('draw-number');
        if (this.game.drawnNumbers.length >= this.numbers) {
          setTimeout(() => {
            this.finishGame();
          }, 2000);
        }
      }, Constants.BINDO_MODE_AUTOMATIC_DRAW);
    },
    finishGame() {
      this.stopAutomaticMode();
      this.$emit('game-has-finished');
    },
    drawTheNumber(e) {
      this.stopAutomaticMode();
      e.target.blur();
      this.$emit('draw-number');
    },
  },
  watch: {
    automode(val) {
      if (val && val === 'stop') {
        this.stopAutomaticMode();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.host-card {
  max-width: 50%;
}
.drawn-number {
  font-size: 10rem;
  line-height: 1;
  margin-bottom: 3rem;
}
.finish-btn {
  font-size: 1rem;
  margin-right: 1.5rem;
}

@media (max-width: 320px) {
  .host-card {
    max-width: 80%;
    margin-top: 1.4rem;
  }
  .drawn-number {
    font-size: 8rem;
    margin-bottom: 1rem;
  }
  .controls {
    .finish-btn {
      margin-right: 0;
      margin-bottom: 2rem;
    }
  }
}

@media (min-width: 321px) and (max-width: 575px) {
  .host-card {
    max-width: 80%;
    margin-top: 1.4rem;
  }
  .drawn-number {
    font-size: 8rem;
    margin-bottom: 1rem;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .host-card {
    max-width: 96%;
  }
  .drawn-number {
    font-size: 8rem;
    margin-bottom: 1rem;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .host-card {
    max-width: 96%;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .host-card {
    max-width: 66%;
  }
}
</style>