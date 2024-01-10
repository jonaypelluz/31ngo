<template>
    <the-header v-if="showHeader"></the-header>
    <router-view></router-view>
    <bg-bubbles></bg-bubbles>
    <footer>
        <a
                target="_blank"
                href="https://www.buymeacoffee.com/jonaypelluz"
                rel="noopener noreferrer"
                className="buy-m-a-coffee"
            >
                <img
                    src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                    alt="Buy Me a Coffee"
                />
                <span>
                    Buy Me a Coffee
                </span>
            </a>
        <p class="beta">31ngo beta v.1.0</p>
    </footer>
</template>
<script>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import BgBubbles from '@ui/BgBubbles.vue';
import TheHeader from '@ui/TheHeader.vue';
import isMobileDevice from '@utils/isMobileDevice';

export default {
    components: {
        BgBubbles,
        TheHeader,
    },
    setup() {
        const store = useStore();
        const route = useRoute();

        const showHeader = computed(() => !route.meta.hideHeader);

        const lockOrientationOnMobile = () => {
            if (isMobileDevice()) {
                try {
                    screen.orientation.lock('landscape');
                } catch (error) {
                    //logger.info("Orientation lock not supported");
                }
            }
        };

        onMounted(() => {
            store.dispatch('autoLogin');
            lockOrientationOnMobile();
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

footer {
    display: flex;
    justify-content: space-between;
    align-items: self-end;
    padding: 12px 6px 6px;
    position: fixed;
    bottom: 0;
    width: 100%;

    img {
        width: 16px;
    }

    p {
        margin-bottom: 0;
    }

    a {
        color: #fff;

        &:hover, &:focus, &:active {
            color: #fff;
        }

        span {
            position: relative;
            top: 2px;
        }
    }
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
