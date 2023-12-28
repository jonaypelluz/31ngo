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
import Constants from '@/constants.js';

export default {
    props: ['game', 'uuid'],
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

@media (max-width: 320px) {
    ul li div {
        width: 0.45rem;
        font-size: 1rem;

        &.selected {
            font-size: 0.9rem;
        }
    }

    .numbers-card {
        padding: 1rem 2rem;
    }
}

@media (min-width: 321px) and (max-width: 575px) {
    ul li div {
        width: 1.5rem;
        font-size: 1.1rem;
    }

    .numbers-card {
        padding: 1rem 2rem;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    ul li div {
        width: 1.5rem;
        font-size: 1.2rem;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    ul li div {
        width: 1.5rem;
        font-size: 1.2rem;
    }
}
</style>
