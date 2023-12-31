<template>
    <base-centre-container>
        <div class="form-wrapper text-center">
            <h2 class="mb-2">Anfitrión</h2>
            <div v-if="!mode" class="game-mode">
                <label>Elige el modo de juego</label>
                <p class="description">
                    En el modo de juego <b>PÚBLICO</b> podrán participar los jugadores que quieran,
                    en el <b>PRIVADO</b> se limita hasta 40 jugadores que tendrán un código de
                    partida privado para cada uno de ellos. Una vez que el anfitrión empieza la
                    partida no se podrá acceder a ella.
                </p>
                <base-button mode="flat" @click="chooseGameMode('private')">Privado</base-button>
                <base-button class="ml-3" @click="chooseGameMode('public')">Público</base-button>
            </div>
            <div v-if="mode === 'private'">
                <label>Introduce cantidad de jugadores</label>
                <div class="controls">
                    <base-button mode="flat" @click="decreasePlayers">-</base-button>
                    <span class="form-control">{{ players }}</span>
                    <base-button mode="flat" class="pb-0" @click="increasePlayers">+</base-button>
                </div>
            </div>
            <base-button v-if="showCreateBtn" mode="animation" @click="createGame">
                Crear partida
            </base-button>
            <base-card v-if="isGameCreated">
                <h3 class="mb-2">Partida creada</h3>
                <h5>
                    Copia el código de la partida y envíalo a quien quieras que participe
                    <span class="d-block mt-2 mb-3">
                        <span class="black">{{ game.hash }}</span>
                        <img class="ml-3 copy-svg" src="@assets/icons/copy.svg" @click="copyHash" />
                        <div class="black mt-2">{{ copiedText }}</div>
                    </span>
                    <div v-if="mode === 'private'">
                        Los códigos individuales los encontrarás al entrar en la partida en la barra
                        lateral.
                    </div>
                </h5>
                <base-button class="mb-2" mode="animation" link :to="hostUrl">
                    Entrar en la partida
                </base-button>
            </base-card>
        </div>
    </base-centre-container>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Constants from '@constants';
import apiService from '@services/apiService';
import helpers from '@utils/helpers';

export default {
    setup() {
        const store = useStore();
        const router = useRouter();

        const players = ref(0);
        const copiedText = ref('');
        const mode = ref(null);

        const game = computed(() => store.state.gam.game);

        const isGameCreated = computed(() => game.value.hash !== null);
        const hostUrl = computed(() => `/games/host/${game.value?.hash}`);
        const user = computed(() => store.state.user);

        const showCreateBtn = computed(() => {
            return (
                !isGameCreated.value &&
                (mode.value === Constants.BINDO_MODE_PUBLIC ||
                    (players.value > 0 &&
                        players.value <= Constants.BINDO_MODE_PRIVATE_MAX_PLAYERS))
            );
        });

        onMounted(async () => {
            try {
                const theGame = await apiService.getHostGame(user.value.uuid);
                if (theGame && !theGame.hasFinished) {
                    router.push(`/games/host/${theGame.hash}`);
                }
            } catch (error) {
                console.error('Error fetching user game:', error);
            }
        });

        const chooseGameMode = (selectedMode) => {
            if (
                selectedMode === Constants.BINDO_MODE_PRIVATE ||
                selectedMode === Constants.BINDO_MODE_PUBLIC
            ) {
                mode.value = selectedMode;
            }
        };

        const copyHash = () => {
            if (navigator) {
                navigator.clipboard.writeText(game.value.hash);
                copiedText.value = '¡Copiado!';
            }
        };

        const increasePlayers = () => {
            players.value++;
            if (players.value > Constants.BINDO_MODE_PRIVATE_MAX_PLAYERS) {
                players.value = Constants.BINDO_MODE_PRIVATE_MAX_PLAYERS;
            }
        };

        const decreasePlayers = () => {
            players.value--;
            if (players.value < 0) {
                players.value = 0;
            }
        };

        const createGame = async () => {
            let codes = [];
            if (mode.value === Constants.BINDO_MODE_PRIVATE) {
                for (let i = 0; i < players.value; i++) {
                    codes.push(helpers.createHash(8));
                }
            }
            const newGame = {
                hash: helpers.createHash(),
                maxPlayers: players.value ?? 0,
                host: user.value.uuid,
                mode: mode.value,
                codes: codes,
            };

            await apiService.createGame(newGame);
            store.dispatch('gam/createGame', newGame);
        };

        return {
            players,
            game,
            copiedText,
            mode,
            showCreateBtn,
            isGameCreated,
            hostUrl,
            chooseGameMode,
            copyHash,
            increasePlayers,
            decreasePlayers,
            createGame,
        };
    },
};
</script>

<style lang="scss" scoped>
label {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.game-mode {
    label {
        display: block;
    }
}

.description {
    max-width: 460px;
    margin: 0 auto 1.5rem;

    b {
        font-weight: 800;
    }
}

.controls {
    margin-bottom: 1.2rem;

    span {
        width: 7rem;
        height: 5rem;
        font-size: 5rem;
        margin: 0 0.5rem;
        display: inline-block;
        line-height: 0.8;
        color: #fff;
        background: transparent;
        border: 0 none;
    }

    button {
        position: relative;
        top: -10px;
        display: inline-block;
        width: 5rem;
        height: 5rem;
        font-size: 3rem;
        outline: none;
        padding: 0;
        padding-bottom: 0.4rem;
    }
}

.copy-svg {
    cursor: pointer;
}
</style>
