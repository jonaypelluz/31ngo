<template>
    <the-header v-if="showHeader"></the-header>
    <router-view></router-view>
    <bg-bubbles></bg-bubbles>
    <footer>
        <span class="powered">powered by @jonaypelluz</span>
        <router-link to="/privacy">Privacidad</router-link>
    </footer>
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
}

body {
    font-family: 'Source Sans Pro', sans-serif;
    color: #fff;
    font-weight: 300;
    background: $primary;
}

footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 0.65rem;
    opacity: 0.4;

    a {
        color: #fff;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
            opacity: 1;
        }
    }
}

.black {
    color: #000;
}

#app {
    padding-top: 0.625rem;
}

input[type='text'],
input[type='number'] {
    padding: 0.5rem;
    border: 0.1rem solid #000;
    border-radius: 0.2rem;
}

.form-wrapper {
    max-width: 60%;
    margin: 0 auto;
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
