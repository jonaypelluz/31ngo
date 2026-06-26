<template>
    <div class="numbers-card">
        <ul>
            <li v-for="(nums, idx) in rows" :key="idx">
                <div
                    v-for="n in nums"
                    :key="n"
                    :ref="`ref${n}`"
                    :class="{
                        selected: game && game.drawnNumbers.includes(n),
                    }"
                >
                    {{ n }}
                </div>
            </li>
        </ul>
        <h6>
            Números restantes: <span>{{ remainingNumbers }}</span>
        </h6>
    </div>
</template>

<script>
import Constants from '@constants';

export default {
    name: 'HostNumbers',
    props: {
        game: {
            type: Object,
            default: null,
        },
        uuid: {
            type: String,
            default: '',
        },
    },
    computed: {
        rows() {
            const numbers = this.allNumbers();
            const chunks = this.chunk(numbers, 10);
            return chunks;
        },
        remainingNumbers() {
            return this.game
                ? Constants.BINGO_CARD_TOTAL_NUMBERS - this.game.drawnNumbers.length
                : Constants.BINGO_CARD_TOTAL_NUMBERS;
        },
    },
    methods: {
        allNumbers() {
            const numbers = [];
            for (let i = 1; i <= Constants.BINGO_CARD_TOTAL_NUMBERS; i++) {
                numbers.push(i);
            }
            return numbers;
        },
        chunk(arr, size) {
            return arr.reduce(
                (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
                [],
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.numbers-card {
    padding: 2rem;
}

ul {
    list-style: none;

    li {
        text-align: center;

        div {
            font-size: 1.5rem;
            text-align: center;
            width: 2rem;
            margin: 0 0.5rem;
            display: inline-block;

            &.selected {
                font-size: 1.2rem;
                text-decoration: line-through;
                color: #000;
            }
        }
    }
}

h6 {
    font-size: 1.5rem;
}

@media (max-width: 575px) {
    ul li div {
        width: clamp(1.2rem, 4vw, 1.5rem);
        font-size: clamp(0.75rem, 3vw, 1.1rem);
        margin: 0 0.15rem;

        &.selected {
            font-size: clamp(0.7rem, 2.8vw, 1rem);
        }
    }

    .numbers-card {
        padding: 0.75rem 1rem;
    }
}

@media (min-width: 576px) and (max-width: 991px) {
    ul li div {
        width: 1.5rem;
        font-size: 1.2rem;
    }
}
</style>
