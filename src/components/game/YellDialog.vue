<template>
    <base-dialog :show="show" :title="yellTitle" @close="handleClose">
        <div>
            <p>
                Nombre del jugador: <b>{{ yellData.playerName }}</b>
            </p>
            <bingo-card-display
                v-if="yellData"
                :card="card"
                :selected-numbers="selectedNumbers"
            ></bingo-card-display>
        </div>
        <template #actions>
            <base-button class="black" mode="flat" @click="handleNotValid">No válido</base-button>
            <base-button class="ml-5" @click="handleValid">Válido</base-button>
        </template>
    </base-dialog>
</template>

<script>
import { computed } from 'vue';
import BingoCardDisplay from '@game/BingoCardDisplay.vue';

export default {
    name: 'YellDialog',
    components: {
        BingoCardDisplay,
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        yellTitle: {
            type: String,
            default: null,
        },
        yellData: {
            type: Object,
            default: null,
        },
    },
    emits: ['notValid', 'validateWinner', 'close'],
    setup(props, { emit }) {
        const card = computed(() => props.yellData.card);
        const selectedNumbers = computed(() => props.yellData.selectedNumbers);

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
            card,
            selectedNumbers,
            handleNotValid,
            handleValid,
            handleClose,
        };
    },
};
</script>

<style scoped></style>
