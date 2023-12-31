<template>
    <div class="switch-btn">
        <input
            id="automatic"
            type="checkbox"
            hidden="hidden"
            :checked="automatic"
            @change="setBingoMode"
        />
        <label class="switch" for="automatic"></label>
        <label class="switch-label">
            {{ automaticLabel }}
            <span v-if="showTimerSeconds">- {{ timer }}s</span>
        </label>
    </div>
</template>

<script>
import { computed, toRefs } from 'vue';

export default {
    name: 'ModeSwitcher',
    props: {
        automatic: {
            type: Boolean,
            default: false,
        },
        showTimer: {
            type: Boolean,
            default: false,
        },
        timer: {
            type: Number,
            default: null,
        },
    },
    emits: ['setBingoMode'],
    setup(props, { emit }) {
        const { automatic, showTimer } = toRefs(props);

        const automaticLabel = computed(() => {
            return !automatic.value ? 'Manual' : 'Automático';
        });

        const showTimerSeconds = computed(() => {
            return automatic.value && showTimer.value;
        });

        const setBingoMode = () => {
            emit('setBingoMode', !automatic.value);
        };

        return {
            automaticLabel,
            showTimerSeconds,
            setBingoMode,
        };
    },
};
</script>

<style lang="scss" scoped>
@import '@scss/_variables.scss';

.switch-label {
    display: inline-block;
    margin-left: 0.5rem;
    margin-top: 0.1rem;
}

//switch btn --> https://codepen.io/maheshwaghmare/pen/QxdpqG
.switch {
    display: inline-block;
    position: relative;
    width: 50px;
    height: 25px;
    border-radius: 20px;
    background: $third;
    transition: background 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    vertical-align: middle;
    cursor: pointer;

    &:active::before {
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.28),
            0 0 0 20px rgba(128, 128, 128, 0.1);
    }

    &::before {
        content: '';
        position: absolute;
        top: 1px;
        left: 2px;
        width: 22px;
        height: 22px;
        background: #fafafa;
        border-radius: 50%;
        transition:
            left 0.28s cubic-bezier(0.4, 0, 0.2, 1),
            background 0.28s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }
}

input:checked + .switch {
    background: $primary;
}

input:checked + .switch::before {
    left: 27px;
    background: #fff;
}

input:checked + .switch:active::before {
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.28),
        0 0 0 20px rgba(0, 150, 136, 0.2);
}
</style>
