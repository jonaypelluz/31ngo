<template>
    <button v-if="!link" :class="mode">
        <slot></slot>
        <i v-if="mode === 'animation'" class="icon fas" :class="icon"></i>
    </button>
    <router-link v-else :to="to" :class="mode">
        <slot></slot>
        <i v-if="mode === 'animation'" class="icon fas" :class="icon"></i>
    </router-link>
</template>
<script>
import { computed } from 'vue';

export default {
    name: 'BaseButton',
    props: {
        mode: {
            type: String,
            default: null,
        },
        link: {
            type: Boolean,
            default: false,
        },
        to: {
            type: String,
            default: '/',
        },
        ico: {
            type: String,
            default: null,
        },
    },
    setup(props) {
        const icon = computed(() => {
            return props.ico || 'fa-arrow-alt-circle-right';
        });

        return { icon };
    },
};
</script>

<style lang="scss" scoped>
@import '../../scss/_variables.scss';

button,
a {
    box-shadow: inset 0 1px 3px 0 $fifth;
    background-color: $fifth-lighter;
    border-radius: 0.5rem;
    border: 0.1rem solid $fifth-darker;
    display: inline-block;
    cursor: pointer;
    color: #000;
    text-transform: uppercase;
    font-size: 1.2rem;
    font-weight: 300;
    padding: 0.5rem 1rem;
    text-decoration: none;
    &:hover,
    &:focus {
        background-color: $fifth;
    }
    &.sm {
        padding: 0.2rem 1rem;
    }
    &.flat {
        background: transparent;
        box-shadow: none;
        border-color: #fff;
        color: #fff;
        &.black {
            border-color: #000;
            color: #000;
        }
        &:hover,
        &:focus {
            background: transparent;
        }
    }
    &.animation {
        transition: all 0.5s;
        position: relative;
        padding: 1rem;
        .icon {
            position: absolute;
            left: 87%;
            top: 35%;
            right: 5%;
            bottom: 0;
            opacity: 0;
        }
        &:hover,
        &:focus {
            padding: 1rem 3rem 1rem 1rem;
            .icon {
                opacity: 1;
                transition: all 0.7s;
            }
        }
    }
}
</style>
