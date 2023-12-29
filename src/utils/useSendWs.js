import { useStore } from 'vuex';

export default function useSendWs(gameId) {
    const store = useStore();

    const sendWsMsg = (data) => {
        store.dispatch('gam/sendWSMessage', {
            ...data,
            gameId,
        });
    };

    return { sendWsMsg };
}
