<template>
    <ul class="bg-bubbles">
        <li v-for="(number, index) in numbers" :key="index" :style="bubbleStyle()">
            <span>{{ number }}</span>
        </li>
    </ul>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const count = 20;
        const numbers = ref([]);

        const generateRandomNumbers = (count, max) => {
            return Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
        };

        const bubbleStyle = () => {
            const size = Math.random() * 100 + 20;
            const left = Math.random() * 100;
            const padding = Math.random() * 10;
            const animationDelay = Math.random() * 20;
            const animationDuration = Math.random() * 40 + 10;

            return {
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                padding: `${padding}px`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${animationDuration}s`,
                fontSize: `${size / 2}px`,
            };
        };

        numbers.value = generateRandomNumbers(count, 90);

        return { numbers, bubbleStyle };
    },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

@mixin animation($animation) {
    -webkit-animation: $animation;
    -moz-animation: $animation;
    -o-animation: $animation;
    animation: $animation;
}

/* source: https://codepen.io/Lewitje/pen/BNNJjo */
.bg-bubbles {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    li {
        position: absolute;
        list-style: none;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 80px;
        width: 40px;
        height: 40px;
        background-color: #fff;
        opacity: 0.1;
        bottom: -160px;
        text-align: center;
        color: #000;
        line-height: 1;

        @include animation(circle 25s infinite linear);
    }
}

@keyframes circle {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-2000px) rotate(600deg);
    }
}
</style>
