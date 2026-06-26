<template>
    <div class="rotate-hint">
        <span>↻ Gira el móvil para ver mejor el cartón</span>
    </div>
    <player-actions
        :game="game"
        :drawn-number="drawnNumber"
        :show-full-house-btn="showFullHouseBtn"
        :show-line-btn="showLineBtn"
        :winner="winner"
        @yell-action="yellAction"
        @mark-numbers="markNumbers"
    />
    <base-centre-container v-if="!isLoading">
        <player-card @add-bingo-card="addName" />
        <base-dialog :show="showNameForm">
            Añade un nombre de jugador
            <input v-model="userName" type="text" placeholder="Nombre" class="form-control" />
            <span v-if="showNameError" class="text-danger">Tienes que añadir un nombre</span>
            <template #actions>
                <base-button @click="addBingoCard">Enviar</base-button>
            </template>
        </base-dialog>
        <base-dialog :show="yell && yell.type !== null" fixed>
            <div class="yell-msg text-center">
                <p>{{ yellTitle }}</p>
                <div class="spinner-border text-info" role="status">
                    <span class="sr-only">Comprobando...</span>
                </div>
            </div>
        </base-dialog>
    </base-centre-container>
</template>

<script>
import { computed, onMounted, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import PlayerActions from '@game/PlayerActions.vue';
import PlayerCard from '@game/PlayerCard.vue';
import useSendWs from '@utils/useSendWs';

export default {
    components: {
        PlayerCard,
        PlayerActions,
    },
    props: {
        id: {
            type: String,
            default: null,
        },
    },
    setup(props) {
        const store = useStore();
        const router = useRouter();

        const { sendWsMsg } = useSendWs(props.id);

        const isLoading = ref(false);
        const showNameForm = ref(false);
        const showNameError = ref(false);
        const userName = ref(null);
        const userData = ref(null);

        const user = computed(() => store.state.user);
        const game = computed(() => store.state.gam.game);
        const yell = computed(() => store.state.gam.yell);
        const drawnNumber = computed(() => store.getters['gam/getLastDrawnNumber']);

        const showLineBtn = computed(() => {
            return (
                yell.value &&
                game.value.drawnNumbers.length > 4 &&
                !game.value.winners.line &&
                yell.value.type === null
            );
        });

        const showFullHouseBtn = computed(() => {
            return (
                yell.value &&
                game.value.drawnNumbers.length > 14 &&
                !game.value.winners.bingo &&
                yell.value.type === null
            );
        });

        const winner = computed(() => {
            let winnerText = '';
            if (game.value.winners.bingo) {
                winnerText =
                    game.value.winners.bingo === user.value.uuid
                        ? '¡Has ganado!'
                        : `El ganador es ${game.value.players[game.value.winners.bingo].name}`;
            }
            return winnerText;
        });

        const yellTitle = computed(() => {
            return yell.value
                ? `¡Han cantado ${
                      yell.value.type !== 'line' ? 'bingo' : 'línea'
                  }!... se está revisando...`
                : '';
        });

        onMounted(() => {
            if (!game.value.hash || game.value.host === user.value.uuid) {
                router.replace('/game-not-found');
                return;
            }
            store.dispatch('gam/connectPeerAsPlayer', {
                gameId: props.id,
                uuid: user.value.uuid,
            });
        });

        const addName = (data) => {
            showNameForm.value = true;
            userData.value = data;
        };

        const addBingoCard = () => {
            if (!userName.value || !userData.value) {
                showNameError.value = true;
            } else {
                const data = { ...userData.value, name: userName.value };

                const privateCode = sessionStorage.getItem(`privateCode-${game.value.hash}`);
                if (privateCode) {
                    data.code = privateCode;
                    sessionStorage.removeItem(`privateCode-${game.value.hash}`);
                }

                showNameError.value = false;
                showNameForm.value = false;
                store.dispatch('gam/addPlayerUuid', { uuid: toRaw(data.uuid), name: data.name });

                sendWsMsg({ type: 'addplayer', data, uuid: user.value.uuid });
            }
        };

        const markNumbers = () => {
            document.querySelectorAll('.number').forEach((number) => {
                if (
                    game.value.drawnNumbers.includes(parseInt(number.innerText)) &&
                    !number.classList.contains('selected')
                ) {
                    number.classList.add('selected');
                }
            });
        };

        const yellAction = (type) => {
            store.dispatch('gam/updateYell', {
                type: type,
                uuid: user.value.uuid,
            });
            sendWsMsg({
                type: type,
                uuid: user.value.uuid,
            });
        };

        return {
            isLoading,
            showNameForm,
            showNameError,
            userName,
            game,
            yell,
            drawnNumber,
            showLineBtn,
            showFullHouseBtn,
            winner,
            yellTitle,
            addName,
            addBingoCard,
            markNumbers,
            yellAction,
        };
    },
};
</script>

<style lang="scss" scoped>
.yell-msg .spinner-border {
    margin: 3rem;
    width: 3rem;
    height: 3rem;
}

.rotate-hint {
    display: none;
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    z-index: 200;
    white-space: nowrap;
    pointer-events: none;
}

@media (max-width: 767px) and (orientation: portrait) {
    .rotate-hint {
        display: block;
    }
}
</style>
