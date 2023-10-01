<template>
  <div class="player-drawn-number">
    <span class="drawn-number" v-if="drawnNumber">
      <router-link to="/">
        <img class="main-logo" src="@/assets/logo-white.svg" alt="31ngo" />
      </router-link>
      <span>{{ drawnNumber }}</span>
    </span>
    <span class="game-finished mr-3" v-if="game.hasFinished">
      ¡El juego ha finalizado!
      {{ winner }}
    </span>
    <div v-else>
      <base-button
        class="line-btn"
        :class="{ show: showLineBtn }"
        @click="yell($event, 'line')"
      >
        ¡Línea!
      </base-button>
      <base-button
        class="bingo-btn ml-3"
        v-if="showFullHouseBtn"
        @click="yell($event, 'bingo')"
      >
        ¡Bingo!
      </base-button>
      <base-button v-if="drawnNumber" class="mark-btn" @click="markNums">
        Marcar números
      </base-button>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'yell-action',
    'game',
    'drawn-number',
    'mark-numbers',
    'show-full-house-btn',
    'show-line-btn',
    'winner',
  ],
  methods: {
    yell(e, type) {
      e.target.blur();
      this.$emit('yell-action', type);
    },
    markNums(e) {
      e.target.blur();
      this.$emit('mark-numbers');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.player-drawn-number {
  position: relative;
  text-align: center;

  .drawn-number {
    color: #000;
    background-color: $secondary;
    display: inline-block;
    width: 2em;
    height: 1.7em;
    position: fixed;
    left: 0;
    top: 0;
    border-radius: 0 0 1em 0;
    z-index: 101;
    font-size: 4rem;
    border: 1px solid #000;
    border-top: 0 none;
    border-left: 0 none;

    span {
      position: relative;
      top: 5px;
    }

    .main-logo {
      position: absolute;
      top: 3px;
      left: 3px;
      max-width: 54px;
      z-index: 1;
    }
  }

  .game-finished {
    font-size: 1rem;
  }

  .bingo-btn,
  .line-btn,
  .mark-btn {
    cursor: pointer;
    width: 100px;
    background: $secondary;
    border-color: $secondary;
    position: fixed;
    box-shadow: none;
    border: 1px solid #000;
    border-top: 0 none;
    border-radius: 0 0 1rem 1rem;
    top: 0;

    &:hover,
    &:focus,
    &:active {
      position: fixed;
      top: 0;
      background: $third;
    }
  }

  .line-btn {
    left: 30%;
    visibility: hidden;

    &.show {
      visibility: visible;
    }
  }

  .bingo-btn {
    left: 45%;
  }

  .mark-btn {
    width: auto;
    right: 15%;
  }
}

.spinner-border {
  margin: 3rem;
  width: 3rem;
  height: 3rem;
}

@media (max-width: 575px) {
  .player-drawn-number {
    .drawn-number {
      font-size: 2.5rem;

      span {
        top: 14px;
      }
    }

    .line-btn,
    .bingo-btn,
    .mark-btn {
      font-size: 1rem;
      padding: 5px;
      width: auto;
    }

    .line-btn {
      left: 27%;
    }

    .bingo-btn {
      left: 40%;
    }

    .mark-btn {
      right: 1%;
    }
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .player-drawn-number {
    .drawn-number {
      font-size: 3rem;

      span {
        top: 14px;
      }
    }

    .line-btn {
      left: 20%;
    }

    .bingo-btn {
      left: 38%;
    }

    .mark-btn {
      right: 8%;
    }
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .player-drawn-number {
    .drawn-number {
      font-size: 3rem;

      span {
        top: 14px;
      }
    }

    .mark-btn {
      right: 8%;
    }
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .player-drawn-number {
    .drawn-number {
      font-size: 3.6rem;

      span {
        top: 10px;
      }
    }
  }
}
</style>
