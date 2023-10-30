<template>
  <base-spinner v-if="isLoading"></base-spinner>
  <base-card class="bingo-card" v-else>
    <div class="ticket" v-if="bingoCard && bingoCard.length > 0">
      <div class="wrapper" v-for="(row, idx) in bingoCard" :key="idx">
        <div
          class="number"
          :class="{ empty: num === 0 }"
          v-for="num in row"
          :key="num"
          :ref="`ref${num}`"
          @click="toggleSelected"
        >
          {{ num === 0 ? '' : num }}
        </div>
      </div>
    </div>
    <div class="controls" v-if="!isBingoCardAssigned">
      <base-button :ico="icon" mode="animation" class="generate-card" @click="generateBingoCard">
        Generar {{ bingoCard && bingoCard.length > 0 ? 'otro' : 'un' }} cartón
      </base-button>
      <base-button
        v-if="bingoCard && bingoCard.length > 0"
        mode="flat"
        class="assign-card"
        @click="assignBingoCard"
      >
        Elegir este cartón
      </base-button>
    </div>
  </base-card>
</template>

<script>
import BingoCard from '@/utils/bingoCard.js';
import Constants from '@/constants.js';

export default {
  props: ['game', 'add-bingo-card'],
  data() {
    return {
      isBingoCardAssigned: false,
      numbers: [],
      bingoCard: [],
      isLoading: false,
    };
  },
  computed: {
    icon() {
      return this.bingoCard.length > 0 ? 'fa-undo-alt' : null;
    },
  },
  methods: {
    toggleSelected(e) {
      e.target.classList.toggle('selected');
    },
    assignBingoCard() {
      this.isBingoCardAssigned = true;
      this.$emit('add-bingo-card', {
        numbers: this.numbers,
        bingoCard: this.bingoCard,
      });
    },
    generateBingoCard() {
      this.numbers = [];
      this.bingoCard = [];
      this.isLoading = true;
      setTimeout(() => {
        this.createBingoCard();
        this.isLoading = false;
      }, 1000);
    },
    createBingoCard() {
      let bingoCard = new BingoCard({
        cols: Constants.BINGO_CARD_COLS,
        rows: Constants.BINGO_CARD_ROWS,
        series: Constants.BINGO_CARD_SERIES,
        numsInRow: Constants.BINGO_CARD_NUMS_IN_ROW,
        numsInCol: Constants.BINGO_CARD_NUMS_IN_COL,
      });

      const result = bingoCard.generateCard();

      this.numbers = result.numbers;
      this.bingoCard = result.matrix;
    },
  },
  created() {
    const game = this.$store.getters['gam/getGame'];
    const user = this.$store.getters['getUser'];
    if (game.players && game.players[user.uuid]) {
      this.numbers = game.players[user.uuid].numbers ?? [];
      this.bingoCard = game.players[user.uuid].bingoCard ?? [];
      if (this.bingoCard.length > 0) {
        this.isBingoCardAssigned = true;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.bingo-card {
  max-width: 76%;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(9, 10.2%);
  grid-gap: 1%;
  padding: 1%;

  .number {
    font-size: 5rem;
    color: #000;
    position: relative;
    z-index: 100;
    text-align: center;
    border-radius: 15%;
    background-color: #fff;
    cursor: pointer;

    &.selected {
      background-color: $fifth;
    }

    &.empty {
      background-color: #333333;
      cursor: initial;
    }
  }
}

.generate-card {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.assign-card {
  margin-left: 1.5rem;
}

.row__number.-is-marked {
  position: relative;
  background-color: #3366cc;
  color: snow;
  z-index: 200;
  animation: 0.75s ease-in-out reverse button-marked;
}

@keyframes button-marked {
  to {
    transform: scale(2);
  }
}

@media (max-width: 575px) {
  .wrapper .number {
    font-size: 1.6rem;
  }

  .controls {
    .assign-card {
      display: block;
      margin: 0 auto;
    }

    .generate-card {
      display: block;
      margin: 1.5rem auto;
    }
  }

  .bingo-card {
    max-width: 90%;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .wrapper .number {
    font-size: 2.8rem;
  }

  .bingo-card {
    max-width: 90%;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .wrapper .number {
    font-size: 3.2rem;
  }

  .bingo-card {
    max-width: 90%;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .wrapper .number {
    font-size: 4rem;
  }

  .bingo-card {
    max-width: 90%;
  }
}

@media (min-width: 1200px) and (max-width: 1359px) {
  .wrapper .number {
    font-size: 4rem;
  }
}

@media (min-width: 1360px) and (max-width: 1449px) {
  .wrapper .number {
    font-size: 4.5rem;
  }
}
</style>
