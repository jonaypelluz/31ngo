<template>
    <ul class="bg-bubbles">
        <li
            v-for="(item, index) in bubbles"
            :key="index"
            :style="item.style"
            :class="`bubble-color-${item.colorClass}`"
        >
            <span>{{ item.number }}</span>
        </li>
    </ul>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'BgBubbles',
    setup() {
        const count = 40;
        const bubbles = ref([]);

        const usedNumbers = new Set();
        const getUniqueNumber = () => {
            let n;
            do {
                n = Math.floor(Math.random() * 90) + 1;
            } while (usedNumbers.has(n));
            usedNumbers.add(n);
            return n;
        };

        bubbles.value = Array.from({ length: count }, () => {
            const size = Math.random() * 90 + 25;
            const left = Math.random() * 100;
            const padding = Math.random() * 8;
            const animationDelay = Math.random() * 25;
            const animationDuration = Math.random() * 45 + 15;
            const opacity = (Math.random() * 0.12 + 0.05).toFixed(2);
            const colorClass = Math.floor(Math.random() * 5);
            const number = getUniqueNumber();

            return {
                number,
                colorClass,
                style: {
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    padding: `${padding}px`,
                    animationDelay: `${animationDelay}s`,
                    animationDuration: `${animationDuration}s`,
                    fontSize: `${size * 0.42}px`,
                    opacity,
                },
            };
        });

        return { bubbles };
    },
};
</script>

<style lang="scss" scoped>
@import '@scss/_variables.scss';

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
        border-radius: 50%;
        background-color: #fff;
        bottom: -200px;
        text-align: center;
        color: #000;
        line-height: 1;
        animation: circle 25s infinite linear;

        &.bubble-color-0 {
            background-color: #ffffff;
        }
        &.bubble-color-1 {
            background-color: #e8f4ff;
        }
        &.bubble-color-2 {
            background-color: #fff5cc;
        }
        &.bubble-color-3 {
            background-color: #ffe0e0;
        }
        &.bubble-color-4 {
            background-color: #e0ffe8;
        }
    }
}

@keyframes circle {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    100% {
        transform: translateY(-2200px) rotate(720deg);
    }
}
</style>
