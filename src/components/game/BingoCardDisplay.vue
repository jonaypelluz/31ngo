<template>
    <div class="bingo-card-display">
        <div v-for="(row, rowIndex) in cardData.card" :key="rowIndex" class="bingo-card-row">
            <div
                v-for="(num, numIndex) in row"
                :key="numIndex"
                class="bingo-card-number"
                :class="{ selected: isNumberSelected(num) }"
            >
                {{ num === 0 ? '' : num }}
            </div>
        </div>
    </div>
</template>

<script>
import { toRefs } from 'vue';

export default {
    name: 'BingoCardDisplay',
    props: {
        cardData: Array,
    },
    setup(props) {
        const { cardData } = toRefs(props);

        const isNumberSelected = (num) => {
            return cardData.selectedNumbers.value.includes(num);
        };

        return {
            cardData,
            isNumberSelected,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.bingo-card-display {
    border: 1px solid #000;
    border-radius: 1rem;

    .bingo-card-row {
        display: grid;
        grid-template-columns: repeat(9, 10.2%);
        grid-gap: 1%;
        padding: 1%;

        .bingo-card-number {
            font-size: 1.8rem;
            color: #000;
            position: relative;
            z-index: 100;
            text-align: center;
            border-radius: 15%;
            background-color: #fff;

            &.selected {
                background-color: $fifth;
            }

            &.empty {
                background-color: #333333;
                cursor: initial;
            }
        }
    }
}
</style>
