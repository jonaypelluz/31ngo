<template>
    <base-dialog :show="show" :title="yellTitle" @close="handleClose">
        <div>
            <p>
                Nombre del jugador: <b>{{ yellData.playerName }}</b>
            </p>
            <bingo-card-display
                v-if="yellData"
                :card="card"
                :selectedNumbers="selectedNumbers"
            ></bingo-card-display>
        </div>
        <template #actions>
            <base-button class="black" mode="flat" @click="handleNotValid">No válido</base-button>
            <base-button class="ml-5" @click="handleValid">Válido</base-button>
        </template>
    </base-dialog>
</template>

<script>
import { computed, toRefs } from 'vue';
import BingoCardDisplay from '@game/BingoCardDisplay.vue';

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

        const card = computed(() => yellData.value.card);
        const selectedNumbers = computed(() => yellData.value.selectedNumbers);

        const handleNotValid = () => {
            emit('not-valid');
        };

        const handleValid = () => {
            emit('validate-winner');
        };

        const handleClose = () => {
            emit('close');
        };

        return {
            show,
            yellTitle,
            yellData,
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
