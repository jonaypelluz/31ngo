<template>
    <base-centre-container>
        <host-controls
            v-if="!game.hasFinished"
            :game="game"
            :max-drawn-numbers="maxDrawnNumbers"
            :number="drawnNumber"
            :is-automode-enabled="isAutomodeEnabled"
            class="p-2"
            @draw-number="drawNumber"
            @finish-game="finishGame"
        />
        <winner-announcement
            v-if="game.hasFinished"
            :winner="game.winners.bingo"
            @delete-game="deleteGame"
        />
        <base-slide>
            <host-numbers v-if="game" :game="game" :uuid="user.uuid" />
        </base-slide>
        <yell-dialog
            v-if="showYell"
            :show="showYell"
            :yell-title="yellTitle"
            :yell-data="yellData"
            @close="notValidWinner"
            @not-valid="notValidWinner"
            @validate-winner="setValidWinner"
        />
    </base-centre-container>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Constants from '@constants';
import HostControls from '@game/HostControls.vue';
import HostNumbers from '@game/HostNumbers.vue';
import WinnerAnnouncement from '@game/WinnerAnnouncement.vue';
import YellDialog from '@game/YellDialog.vue';
import { peerHostService } from '@services/peerHostService';
import useSendWs from '@utils/useSendWs';

export default {
    components: {
        WinnerAnnouncement,
        HostControls,
        HostNumbers,
        YellDialog,
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

        const maxDrawnNumbers = Constants.BINGO_CARD_TOTAL_NUMBERS;
        const players = ref({});

        const user = computed(() => store.state.user);
        const game = computed(() => store.state.gam.game);

        const drawnNumber = computed(() => store.getters['gam/getLastDrawnNumber']);
        const isAutomodeEnabled = computed(() => yell.value.type !== null);

        const yell = computed(() => store.state.gam.yell);
        const showYell = computed(() => yell.value.type !== null);
        const yellCard = ref(null);

        watch([showYell, yell], ([newShowYell, newYell], [, oldYell]) => {
            if (newShowYell && newYell && newYell.uuid !== oldYell.uuid) {
                if (!players.value[newYell.uuid]) {
                    const player = peerHostService.getPlayerData(newYell.uuid);
                    if (player) {
                        players.value[newYell.uuid] = player;
                        yellCard.value = player.bingoCard;
                    }
                } else {
                    yellCard.value = players.value[newYell.uuid].bingoCard;
                }
            }
        });

        const yellTitle = computed(() => {
            return yell.value
                ? `¡Comprobar resultados de ${yell.value.type !== 'line' ? 'bingo' : 'línea'}!`
                : '';
        });

        onMounted(() => {
            const game = store.getters['gam/getGame'];
            if (!game || !game.hash) {
                router.replace('/game-not-found');
                return;
            }
            store.dispatch('gam/connectPeerAsHost', { gameId: props.id });
        });

        const yellData = computed(() => ({
            playerName: players.value[yell.value?.uuid]?.name || '',
            card: yellCard.value,
            selectedNumbers: game.value.drawnNumbers,
        }));

        const closeYell = () => {
            store.dispatch('gam/resetYell');
        };

        const drawNumber = () => {
            const total = Constants.BINGO_CARD_TOTAL_NUMBERS;
            if (game.value.drawnNumbers.length >= total) {
                return;
            }
            let randNum;
            do {
                randNum = Math.floor(Math.random() * total) + 1;
            } while (game.value.drawnNumbers.includes(randNum));
            store.dispatch('gam/addDrawnNumber', randNum);
            sendWsMsg({ type: 'num', num: randNum, uuid: user.value.uuid });
        };

        const finishGame = () => {
            store.dispatch('gam/hasFinished');
            sendWsMsg({ type: 'finish', uuid: user.value.uuid });
        };

        const notValidWinner = () => {
            sendWsMsg({ type: 'notwinner', winType: yell.value.type, uuid: yell.value.uuid });
            closeYell();
        };

        const deleteGame = () => {
            localStorage.removeItem('hostActiveGame');
            store.dispatch('gam/resetGame');
            router.replace('/');
        };

        const setValidWinner = () => {
            if (yell.value.type !== null) {
                store.dispatch('gam/setWinner', {
                    uuid: yell.value.uuid,
                    type: yell.value.type,
                });

                sendWsMsg({
                    type: 'winner',
                    winType: yell.value.type,
                    uuid: yell.value.uuid,
                });

                if (yell.value.type === 'bingo') {
                    finishGame();
                }
            }
            closeYell();
        };

        return {
            game,
            user,
            maxDrawnNumbers,
            drawnNumber,
            isAutomodeEnabled,
            drawNumber,
            deleteGame,
            showYell,
            yellTitle,
            yellData,
            finishGame,
            notValidWinner,
            setValidWinner,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '@scss/_variables.scss';

b {
    font-weight: 800;
}
</style>
