<template>
    <the-header v-if="showHeader"></the-header>
    <router-view></router-view>
    <bg-bubbles></bg-bubbles>
    <p class="beta">31ngo beta v.1.0</p>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import BgBubbles from '@ui/BgBubbles.vue';
import TheHeader from '@ui/TheHeader.vue';

export default {
    components: {
        BgBubbles,
        TheHeader,
    },
    setup() {
        const store = useStore();
        const route = useRoute();

        const showHeader = computed(() => !route.meta.hideHeader);

        onMounted(() => {
            store.dispatch('autoLogin');
        });

        return {
            showHeader,
        };
    },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300');
@import './scss/_variables.scss';

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-weight: 300;
}

html,
body {
    height: 100%;
    min-width: 360px;
}

body {
    font-family: 'Source Sans Pro', sans-serif;
    color: #fff;
    font-weight: 300;
    background: $primary;
}

.black {
    color: #000;
}

#app {
    padding-top: 10px;
    min-width: 376px;
}

input[type='text'],
input[type='number'] {
    padding: 0.5rem;
    border: 0.1rem solid #000;
    border-radius: 0.2rem;
}

.form-wrapper {
    max-width: 40%;
    margin: 0 auto;
}

.beta {
    position: fixed;
    right: 10px;
    bottom: -7px;
}

@media (max-width: 575px) {
    .form-wrapper {
        max-width: 95%;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    .form-wrapper {
        max-width: 95%;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
}

@media (min-width: 992px) and (max-width: 1199px) {
}

@media (min-width: 1200px) and (max-width: 1359px) {
    html,
    body {
        overflow: hidden;
    }
}

@media (min-width: 1360px) {
    html,
    body {
        overflow: hidden;
    }
}
</style>
