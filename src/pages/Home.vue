<template>
    <base-centre-container>
        <h1><img class="logo mt-4 mb-2" src="@assets/logo.svg" alt="31ngo" /></h1>
        <p class="description">
            Para jugar al <b>BINGO</b>, primero se debe establecer una partida como anfitrión, si
            aún no existe. Luego, usando el código generado, se puede unir a la partida desde otro
            navegador, ya sea en un teléfono móvil o en una computadora.
        </p>
        <base-button link to="host" class="mr-5">Anfitrión</base-button>
        <base-button link to="player">Jugador</base-button>
    </base-centre-container>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import apiService from '@services/apiService';
import helpers from '@utils/helpers';

export default {
    setup() {
        const store = useStore();
        const router = useRouter();

        onMounted(async () => {
            const user = store.getters['getUser'];

            if (!user.uuid) {
                const uuid = helpers.uuidv4();
                store.dispatch('setUserUUID', uuid);
            }

            const theGame = await apiService.getHostGame(user.uuid);
            if (theGame) {
                store.dispatch('gam/createGame', theGame);
                router.push(`/games/host/${theGame.hash}`);
            }
        });
    },
};
</script>

<style lang="scss" scoped>
.logo {
    width: 100%;
    max-width: 6em;
}

.description {
    max-width: 400px;
    margin: 0 auto 1.5rem;

    b {
        font-weight: 800;
    }
}

@media (max-width: 575px) {
    .logo {
        max-width: 5em;
    }

    .description {
        max-width: 80%;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    .description {
        max-width: 80%;
    }
}
</style>
