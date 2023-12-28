<template>
    <base-centre-container>
        <host-controls
            v-if="!game.hasFinished"
            :game="game"
            :numbers="totalNumbers"
            :number="drawnNumber"
            :isAutomodeEnabled="isAutomodeEnabled"
            @draw-number="drawNumber"
            @game-has-finished="finishGame"
            @delete-game="deleteGame"
        />
        <winner-announcement v-if="game.hasFinished" :winner="game.winners.bingo" />
        <base-slide>
            <host-numbers v-if="game" :game="game" :uuid="user.uuid" />
        </base-slide>
        <yell-dialog
            v-if="showYell"
            :show="showYell"
            :yellTitle="yellTitle"
            :yellData="yellData"
            @close="notValidWinner"
            @notValid="notValidWinner"
            @validateWinner="setValidWinner"
        />
    </base-centre-container>
</template>

<script>
import Constants from '@/constants.js';
import HostControls from '@/components/game/HostControls.vue';
import HostNumbers from '@/components/game/HostNumbers.vue';
import WinnerAnnouncement from '@/components/game/WinnerAnnouncement.vue';
import YellDialog from '@/components/game/YellDialog.vue';
import apiService from '@/services/apiService.js';
import { wsManager } from '@/services/ws/webSocketManager';
import { ref, computed, onMounted, watch, toRaw } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    components: {
        WinnerAnnouncement,
        HostControls,
        HostNumbers,
        YellDialog,
    },
    props: ['id'],
    setup(props) {
        const store = useStore();
        const router = useRouter();

        const totalNumbers = Constants.BINGO_CARD_TOTAL_NUMBERS;
        const ws = ref(null);
        const players = ref({});

        const user = computed(() => store.state.user);
        const game = computed(() => store.state.gam.game);

        const drawnNumber = computed(() => store.getters['gam/getLastDrawnNumber']);
        const isAutomodeEnabled = computed(() => yell.value.type !== null);

        const yell = computed(() => store.state.gam.yell);
        const showYell = computed(() => yell.value.type !== null);
        const yellCard = ref(null);

        watch([showYell, yell], async ([newShowYell, newYell], [_, oldYell]) => {
            if (newShowYell && newYell && newYell.uuid !== oldYell.uuid) {
                if (!players.value[newYell.uuid]) {
                    try {
                        const player = await apiService.getPlayer(game.value.hash, newYell.uuid);
                        players.value[newYell.uuid] = player;
                        yellCard.value = player.bingoCard;
                    } catch (error) {
                        console.error('API call failed:', error);
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

        onMounted(async () => {
            const theGame = await apiService.getHostGame(user.value.uuid);
            if (!theGame) {
                router.replace('/game-not-found');
            }
            store.dispatch('gam/updateGame', theGame);
            ws.value = wsManager;
            ws.value.connect(props.id, user.value.uuid);
        });

        const yellData = computed(() => ({
            playerName: players.value[yell.value?.uuid]?.name || '',
            card: yellCard.value,
            selectedNumbers: game.value.drawnNumbers,
        }));

        const closeYell = () => {
            store.dispatch('gam/resetYell');
        };

        const drawNumber = async () => {
            let loop = true;
            while (loop) {
                let randNum = Math.floor(Math.random() * Constants.BINGO_CARD_TOTAL_NUMBERS) + 1;
                if (!game.value.drawnNumbers.includes(randNum)) {
                    store.dispatch('gam/addDrawnNumber', randNum);
                    await apiService.addDrawnNumbers(game.value.hash, user.value.uuid, randNum);
                    break;
                }
                if (game.value.drawnNumbers.length >= Constants.BINGO_CARD_TOTAL_NUMBERS) {
                    break;
                }
            }

            sendWsMsg({
                type: 'num',
                num: drawnNumber.value,
                uuid: user.value.uuid,
            });
        };

        const finishGame = async () => {
            await apiService.hasFinished(game.value.hash, user.value.uuid);
            store.dispatch('gam/hasFinished');
            sendWsMsg({
                type: 'finish',
                uuid: user.value.uuid,
            });
        };

        const notValidWinner = () => {
            sendWsMsg({
                type: 'notwinner',
                winType: yell.value.type,
                uuid: yell.value.uuid,
            });
            closeYell();
        };

        const sendWsMsg = (data) => {
            ws.value.send({
                ...data,
                gameId: props.id,
            });
        };

        const deleteGame = async () => {
            await apiService.deleteGame(game.value.hash, user.value.uuid);
            store.dispatch('gam/resetGame');
        };

        const setValidWinner = async () => {
            if (yell.value.type !== null) {
                store.dispatch('gam/setWinner', {
                    uuid: yell.value.uuid,
                    type: yell.value.type,
                });

                const winners = store.getters['gam/getWinners'];
                await apiService.updateWinners(game.value.hash, user.value.uuid, toRaw(winners));

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
            totalNumbers,
            drawnNumber,
            isAutomodeEnabled,
            drawNumber,
            deleteGame,
            showYell,
            yellTitle,
            yellData,
            notValidWinner,
            setValidWinner,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

b {
    font-weight: 800;
}
</style>
