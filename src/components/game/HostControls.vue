<template>
    <base-card class="host-card">
        <div class="game-control">
            <mode-switcher
                :timer="timer"
                :show-timer="showTimer"
                :automatic="automatic"
                @set-bingo-mode="setBingoMode"
            />
            <div class="drawn-number">
                <span>{{ shownNumber }}</span>
            </div>
            <div class="controls">
                <base-button class="finish-btn" mode="flat" @click="finishGame">
                    Final de la partida
                </base-button>
                <base-button v-if="showStartBtn" class="action-btn" @click="drawTheNumber">
                    {{ btnText }}
                </base-button>
            </div>
        </div>
        <host-info :game="game" />
    </base-card>
</template>

<script>
import { computed, onUnmounted, ref, watch } from 'vue';
import Constants from '@constants';
import HostInfo from '@game/HostInfo.vue';
import ModeSwitcher from './ModeSwitcher.vue';

export default {
    name: 'HostControls',
    components: {
        HostInfo,
        ModeSwitcher,
    },
    props: {
        game: {
            type: Object,
            default: null,
        },
        maxDrawnNumbers: {
            type: Number,
            default: null,
        },
        number: {
            type: Number,
            default: null,
        },
        isAutomodeEnabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['setBingoMode', 'drawNumber', 'finishGame'],
    setup(props, { emit }) {
        const timer = ref(10);
        const showTimer = ref(true);
        const automatic = ref(false);
        let counterInterval = null;
        let bingoInterval = null;

        const showStartBtn = computed(() => {
            return props.game.drawnNumbers.length < props.maxDrawnNumbers;
        });

        const shownNumber = computed(() => {
            return props.number &&
                props.game &&
                props.game.drawnNumbers.length < Constants.BINGO_CARD_TOTAL_NUMBERS
                ? props.number
                : '-';
        });

        const btnText = computed(() => {
            return props.number ? 'Nuevo número' : 'Empezar';
        });

        watch(
            () => props.isAutomodeEnabled,
            () => {
                if (!props.isAutomodeEnabled) {
                    stopAutomaticMode();
                }
            },
        );

        const setBingoMode = (mode) => {
            automatic.value = mode;
            if (automatic.value) {
                counterInterval = setInterval(() => {
                    timer.value--;
                    if (timer.value <= 0) {
                        timer.value = Constants.BINDO_MODE_AUTOMATIC_TIMER;
                        showTimer.value = false;
                        drawANumber();
                        clearInterval(counterInterval);
                    }
                }, 1000);
            } else {
                stopAutomaticMode();
            }
        };

        const stopAutomaticMode = () => {
            automatic.value = false;
            timer.value = Constants.BINDO_MODE_AUTOMATIC_TIMER;
            showTimer.value = true;
            clearInterval(counterInterval);
            clearInterval(bingoInterval);
        };

        const drawANumber = () => {
            emit('drawNumber');
            bingoInterval = setInterval(() => {
                emit('drawNumber');
                if (props.game.drawnNumbers.length >= props.maxDrawnNumbers) {
                    setTimeout(() => {
                        finishGame();
                    }, 2000);
                }
            }, Constants.BINDO_MODE_AUTOMATIC_DRAW);
        };

        const finishGame = () => {
            stopAutomaticMode();
            emit('finishGame');
        };

        const drawTheNumber = (e) => {
            stopAutomaticMode();
            e.target.blur();
            emit('drawNumber');
        };

        onUnmounted(() => {
            clearInterval(counterInterval);
            clearInterval(bingoInterval);
        });

        return {
            timer,
            showTimer,
            automatic,
            showStartBtn,
            shownNumber,
            btnText,
            setBingoMode,
            stopAutomaticMode,
            drawANumber,
            finishGame,
            drawTheNumber,
        };
    },
};
</script>

<style lang="scss" scoped>
.host-card {
    max-width: 80%;
    display: flex;
    align-items: center;
    padding: 12px;
    justify-content: space-evenly;
    margin: 0 auto;

    .game-control {
        border-right: 1px solid #fff;
        padding-right: 48px;
    }
}

.drawn-number {
    font-size: 9rem;
    line-height: 1;
    margin-bottom: 1rem;
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
