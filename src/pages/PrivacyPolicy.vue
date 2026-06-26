<template>
    <base-centre-container class="privacy">
        <h1>Política de Privacidad</h1>

        <p>
            En 31ngo valoramos tu privacidad. Esta aplicación
            <strong>no recopila ningún dato personal</strong> ni utiliza servicios de analítica.
        </p>

        <h2>Datos que no recopilamos</h2>
        <p>
            No usamos Google Analytics, cookies de seguimiento ni ningún otro sistema de
            monitorización. No guardamos nombres, identificadores ni historial de partidas en ningún
            servidor propio.
        </p>

        <h2>Cómo funciona el juego</h2>
        <p>
            31ngo es una aplicación de cliente puro (sin servidor propio). La comunicación en tiempo
            real entre jugadores se realiza mediante WebRTC a través de
            <a href="https://peerjs.com" target="_blank" rel="noopener noreferrer">PeerJS</a>. La
            señalización inicial (handshake) pasa por los servidores públicos de peerjs.com, después
            la comunicación es directa entre navegadores. No almacenamos nada en servidores
            externos.
        </p>

        <h2>Almacenamiento local</h2>
        <p>
            Se usa <code>localStorage</code> y <code>sessionStorage</code> del navegador
            exclusivamente para mantener la sesión de partida activa (código de sala, UUID de
            jugador). Estos datos nunca salen de tu dispositivo.
        </p>

        <h2>Contacto</h2>
        <p>Cualquier pregunta: <a href="mailto:jonaypelluz@gmail.com">jonaypelluz@gmail.com</a></p>

        <router-link to="/" class="back-link">← Volver</router-link>
    </base-centre-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.privacy {
    max-width: 700px;
    padding: 2rem 1rem 5rem;
    text-align: left !important;

    h1 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    h2 {
        font-size: 1.1rem;
        margin: 1.5rem 0 0.5rem;
    }

    p {
        line-height: 1.6;
        margin-bottom: 0.75rem;
    }

    code {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.1rem 0.3rem;
        border-radius: 0.25rem;
        font-size: 0.9em;
    }

    a {
        color: #fff;
        text-decoration: underline;
    }

    .back-link {
        display: inline-block;
        margin-top: 2rem;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
