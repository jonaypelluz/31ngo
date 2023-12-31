<template>
    <div v-if="winner" class="winner-announcement">
        <h3>¡La partida ha finalizado!</h3>
        <div>
            <h2 class="mb-5">El ganador uuid es:</h2>
            <h1>{{ winner }}</h1>
        </div>
        <base-button class="mt-3" mode="flat" @click="deleteGame">Borrar partida</base-button>
    </div>
</template>

<script>
export default {
    name: 'WinnerAnnouncement',
    props: {
        winner: {
            type: String,
            default: null,
        },
    },
    emits: ['deleteGame'],
    setup(_, { emit }) {
        const deleteGame = () => {
            emit('deleteGame');
        };

        return {
            deleteGame,
        };
    },
};
</script>

<style lang="scss" scoped></style>
