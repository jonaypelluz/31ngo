<template>
    <div v-if="winner" class="winner-announcement">
        <h3>¡La partida ha finalizado!</h3>
        <div>
            <h2 class="mb-5">El ganador uuid es:</h2>
            <h1>{{ winner }}</h1>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WinnerAnnouncement',
    props: {
        winner: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped></style>
