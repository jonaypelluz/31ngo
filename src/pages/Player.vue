<template>
    <base-centre-container>
        <div class="form-wrapper">
            <h2 class="mb-5">Jugador</h2>
            <div class="form-group">
                <label for="players">Introduce un código de partida</label>
                <input
                    id="players"
                    type="text"
                    placeholder="Código de partida"
                    class="form-control"
                    :value="gameId"
                    @input="gameId = $event.target.value.toUpperCase()"
                />
                <div v-if="error" class="alert alert-danger mt-3" role="alert">
                    {{ error }}
                </div>
                <base-button
                    v-if="gameId && !isLoading"
                    class="mt-3"
                    mode="animation"
                    @click="checkGame"
                >
                    Entrar en la partida
                </base-button>
            </div>
        </div>
        <base-dialog :show="showCodeModal">
            Te quieres unir a una partida privada, tienes que introducir un segundo código de
            jugador invitado para poder entrar.
            <input
                v-model="gameCode"
                type="text"
                placeholder="Código de jugador"
                class="form-control"
            />
            <span v-if="showCodeError" class="text-danger">
                El código no es correcto, vuelve a pedirle al anfitrión un código que sea correcto.
            </span>
            <template #actions>
                <base-button @click="sendGameCode">Enviar</base-button>
            </template>
        </base-dialog>
    </base-centre-container>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Constants from '@constants';
import { peerPlayerService } from '@services/peerPlayerService';

export default {
    setup() {
        const router = useRouter();
        const store = useStore();
        const gameId = ref('');
        const isLoading = ref(false);
        const error = ref('');
        const game = ref(null);
        const gameCode = ref('');
        const showCodeModal = ref(false);
        const showCodeError = ref(false);

        const user = computed(() => store.getters['getUser']);

        onMounted(() => {
            store.dispatch('gam/resetGame');
        });

        const checkGame = () => {
            isLoading.value = true;
            error.value = '';

            let resolved = false;

            const onMessage = (data) => {
                if (data.type !== 'game-state' || resolved) {
                    return;
                }
                resolved = true;
                peerPlayerService.off('peer-message', onMessage);
                peerPlayerService.off('peer-error', onError);
                game.value = data.game;
                isLoading.value = false;
                checkIfExists();
            };

            const onError = () => {
                if (resolved) {
                    return;
                }
                resolved = true;
                peerPlayerService.off('peer-message', onMessage);
                peerPlayerService.off('peer-error', onError);
                peerPlayerService.destroy();
                error.value = 'No se ha encontrado la partida';
                isLoading.value = false;
            };

            peerPlayerService.on('peer-message', onMessage);
            peerPlayerService.on('peer-error', onError);
            peerPlayerService.connect(gameId.value, user.value.uuid);

            setTimeout(() => onError(), 10000);
        };

        const sendGameCode = () => {
            if (
                game.value.codes.includes(gameCode.value) &&
                !game.value.usedCodes.includes(gameCode.value)
            ) {
                sessionStorage.setItem(`privateCode-${game.value.hash}`, gameCode.value);
                store.dispatch('gam/updateGame', game.value);
                router.push(`/games/player/${game.value.hash}`);
            } else {
                showCodeError.value = true;
            }
        };

        const routeToGame = () => {
            store.dispatch('gam/updateGame', game.value);
            router.push(`/games/player/${game.value.hash}`);
        };

        const checkIfExists = () => {
            if (!game.value || !game.value.hash) {
                error.value = 'No se ha encontrado esa partida.';
            } else {
                checkIfHasFinished();
            }
        };

        const checkIfHasFinished = () => {
            if (game.value.hasFinished) {
                error.value = 'Esa partida ya ha finalizado.';
                peerPlayerService.destroy();
            } else {
                checkIfInPlayers();
            }
        };

        const checkIfInPlayers = () => {
            if (game.value.players && user.value.uuid in game.value.players) {
                routeToGame();
            } else {
                checkIfHasStarted();
            }
        };

        const checkIfHasStarted = () => {
            if (game.value.hasStarted) {
                error.value = 'Esa partida ya ha empezado.';
                peerPlayerService.destroy();
            } else {
                checkIfPrivate();
            }
        };

        const checkIfPrivate = () => {
            if (game.value.mode === Constants.BINDO_MODE_PRIVATE) {
                showCodeModal.value = true;
            } else {
                routeToGame();
            }
        };

        return {
            gameId,
            isLoading,
            user,
            error,
            game,
            gameCode,
            showCodeModal,
            showCodeError,
            checkGame,
            sendGameCode,
        };
    },
};
</script>

<style scoped></style>
