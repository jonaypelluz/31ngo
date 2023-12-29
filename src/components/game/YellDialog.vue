<template>
    <base-dialog v-if="show" :title="yellTitle" @close="handleClose">
        <div>
            <p>
                Nombre del jugador: <b>{{ yellData.playerName }}</b>
            </p>
            <bingo-card-display v-if="yellData" :cardData="yellData"></bingo-card-display>
        </div>
        <template #actions>
            <base-button class="black" mode="flat" @click="handleNotValid"> No válido </base-button>
            <base-button class="ml-5" @click="handleValid"> Válido </base-button>
        </template>
    </base-dialog>
</template>

<script>
import BingoCardDisplay from './BingoCardDisplay.vue';
import { toRefs } from 'vue';

export default {
    name: 'YellDialog',
    components: {
        BingoCardDisplay,
    },
    props: {
        show: Boolean,
        yellTitle: String,
        yellData: Object,
    },
    setup(props, { emit }) {
        const { show, yellTitle, yellData } = toRefs(props);

        const handleNotValid = () => {
            emit('notValid');
        };

        const handleValid = () => {
            emit('validateWinner');
        };

        const handleClose = () => {
            emit('close');
        };

        return {
            show,
            yellTitle,
            yellData,
            handleNotValid,
            handleValid,
            handleClose,
        };
    },
};
</script>

<style scoped></style>
