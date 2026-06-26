import { useStore } from 'vuex';

export default function useSendWs(gameId) {
    const store = useStore();

    const sendWsMsg = (data) => {
        store.dispatch('gam/sendPeerMessage', {
            ...data,
            gameId,
        });
    };

    return { sendWsMsg };
}
