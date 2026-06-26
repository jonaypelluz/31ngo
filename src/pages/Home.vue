<template>
    <base-centre-container>
        <div class="home-layout">
            <div class="home-left">
                <h1><img class="logo" src="@assets/logo.svg" alt="31ngo" /></h1>
                <div class="home-actions">
                    <base-button link to="host">Anfitrión</base-button>
                    <base-button link to="player">Jugador</base-button>
                </div>
                <a
                    target="_blank"
                    href="https://www.buymeacoffee.com/jonaypelluz"
                    rel="noopener noreferrer"
                    class="home-coffee"
                >
                    <img
                        src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                        alt="Buy me a coffee"
                    />
                    <span>
                        <strong>Mantén 31ngo vivo</strong>
                        <em>Apoya el proyecto</em>
                    </span>
                </a>
            </div>
            <div class="home-right">
                <p class="instructions-lead">
                    Bingo multijugador en tiempo real. Sin instalación, sin servidor.
                </p>
                <div class="instructions">
                    <div class="step">
                        <h3>El anfitrión crea la partida</h3>
                        <p>Genera una sala y comparte el código con los jugadores.</p>
                    </div>
                    <div class="step">
                        <h3>Los jugadores se unen</h3>
                        <p>Desde cualquier navegador — móvil u ordenador — con ese código.</p>
                    </div>
                    <div class="step">
                        <h3>El anfitrión saca bolas</h3>
                        <p>De forma manual o en modo automático con temporizador.</p>
                    </div>
                    <div class="step">
                        <h3>Canta línea o bingo</h3>
                        <p>Marca tu cartón y canta cuando lo consigas. El anfitrión valida.</p>
                    </div>
                </div>
                <p class="instructions-note">
                    La partida funciona directamente entre navegadores (WebRTC). No se guardan
                    datos.
                </p>
            </div>
        </div>
    </base-centre-container>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import helpers from '@utils/helpers';

export default {
    setup() {
        const store = useStore();

        onMounted(() => {
            const user = store.getters['getUser'];
            if (!user.uuid) {
                const uuid = helpers.uuidv4();
                store.dispatch('setUserUUID', uuid);
            }
        });
    },
};
</script>

<style lang="scss" scoped>
:deep(.row.h-100) {
    align-items: center;
    min-height: 100vh;
}

.home-layout {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 3rem;
    padding: 1rem 1.5rem 4rem;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
}

.home-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    gap: 1.5rem;
}

.logo {
    width: clamp(8rem, 20vw, 14rem);
}

.home-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;

    :deep(.base-button) {
        width: 100%;
        text-align: center;
    }
}

.home-right {
    flex: 1;
    text-align: left;
}

.instructions-lead {
    font-size: 1.2rem;
    margin-bottom: 1.25rem;
    opacity: 0.85;
    line-height: 1.5;
}

.instructions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
}

.step {
    h3 {
        font-size: 1rem;
        font-weight: 900;
        margin: 0 0 0.2rem 0;
        letter-spacing: 0.01em;
    }

    p {
        font-size: 0.9rem;
        opacity: 0.75;
        line-height: 1.5;
        margin: 0;
    }
}

.instructions-note {
    font-size: 0.85rem;
    opacity: 0.5;
    margin-top: 0.5rem;
    line-height: 1.5;
}

.home-coffee {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 1rem;
    color: #fff;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0.75rem;
    padding: 0.6rem 1rem;
    transition: background 0.2s;

    &:hover,
    &:focus {
        background: rgba(255, 255, 255, 0.14);
    }

    img {
        width: 1.8rem;
        flex-shrink: 0;
    }

    span {
        display: flex;
        flex-direction: column;
        text-align: left;
        line-height: 1.3;
    }

    strong {
        font-size: 0.8rem;
        font-weight: 600;
    }

    em {
        font-size: 0.7rem;
        font-style: normal;
        opacity: 0.7;
    }
}

@media (max-width: 900px) {
    .home-layout {
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .home-left {
        width: 100%;
        gap: 0;
    }

    .logo {
        width: clamp(10rem, 50vw, 14rem);
    }

    .home-actions {
        flex-direction: row;
        justify-content: center;

        :deep(.base-button) {
            width: auto;
        }
    }

    .home-right {
        width: 100%;
    }

    .instructions-lead {
        font-size: 1rem;
    }
}

@media (max-width: 950px) and (orientation: landscape) {
    .home-coffee {
        margin-top: 0;
    }
}
</style>
