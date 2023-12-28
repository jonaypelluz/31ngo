<template>
    <div class="game-info mt-4">
        <div class="row">
            <div class="col">
                <h3 class="mb-0">ID. de la partida</h3>
                <p class="game-tag black">{{ game.hash }}</p>
            </div>
            <div class="col">
                <div v-if="!game.hasFinished">
                    <h4>Jugadores online</h4>
                    <p class="online-players">
                        {{ onlinePlayers }}
                    </p>
                </div>
            </div>
        </div>
        <div v-if="showPlayerNames" class="player-names mb-2">
            <h4 class="mt-2">Nombres de los jugadores</h4>
            <span v-for="(player, idx) in game.players" :key="idx">
                {{ player.name }}{{ addComa(game.players.length, idx) }}
            </span>
        </div>
        <div v-if="showPlayersCodes" class="game-codes mb-2">
            <h4 class="mt-2">Códigos de jugadores</h4>
            <ul class="player-codes">
                <li
                    v-for="code in game.codes"
                    :key="code"
                    :class="{
                        selected: game.usedCodes.includes(code),
                    }"
                    @click="copyHash($event, code)"
                >
                    {{ code }} <span class="black">!Copiado!</span>
                </li>
            </ul>
        </div>
        <base-button class="mt-3" mode="flat" @click="deleteGame"> Borrar partida </base-button>
    </div>
</template>

<script>
import { computed } from 'vue';
import Constants from '@/constants.js';

export default {
    props: ['game'],
    setup(props, { emit }) {
        const onlinePlayers = computed(() => {
            let players = '';
            if (props.game.mode === Constants.BINDO_MODE_PRIVATE) {
                players = props.game.players.length + '/' + props.game.maxPlayers;
            } else {
                players = props.game.players.length;
            }
            return players;
        });

        const showPlayersCodes = computed(() => {
            return props.game.mode === Constants.BINDO_MODE_PRIVATE;
        });

        const showPlayerNames = computed(() => {
            return (
                props.game.mode !== Constants.BINDO_MODE_PRIVATE &&
                props.game.players &&
                Object.keys(props.game.players).length > 0
            );
        });

        const addComa = (length, idx) => {
            return idx + 1 < length ? ', ' : '';
        };

        const copyHash = (e, code) => {
            e.target.parentElement.querySelectorAll('.black').forEach((el) => {
                el.classList.remove('show');
            });
            e.target.blur();
            navigator.clipboard.writeText(code).then(() => {
                e.target.querySelector('.black').classList.add('show');
                setTimeout(() => e.target.querySelector('.black').classList.remove('show'), 2000);
            });
        };

        const deleteGame = () => {
            emit('delete-game');
        };

        return {
            onlinePlayers,
            showPlayersCodes,
            showPlayerNames,
            addComa,
            copyHash,
            deleteGame,
        };
    },
};
</script>

<style lang="scss" scoped>
.game-info {
    h3 {
        margin-bottom: 2rem;

        span {
            font-weight: 800;
        }
    }

    h3,
    h4 {
        font-size: 1rem;
    }

    .game-tag {
        font-size: 1.3rem;
    }

    .game-codes {
        width: 90%;
        margin: 0 auto;

        .player-codes {
            width: 100%;
            max-height: 90px;
            overflow: auto;
            margin: 0;
            padding: 0;
            list-style: none;

            &::-webkit-scrollbar {
                -webkit-appearance: none;

                &:vertical {
                    width: 12px;
                }

                &:horizontal {
                    height: 12px;
                }
            }

            &::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 10px;
                border: 2px solid #ffffff;
            }

            &::-webkit-scrollbar-track {
                border-radius: 10px;
                background-color: #ffffff;
            }

            li {
                font-size: 1.2rem;
                border-bottom: 1px dashed #fff;
                padding: 2px 0;

                &.selected {
                    text-decoration: line-through;
                    color: #000;
                }

                span {
                    display: none;

                    &.show {
                        display: inline-block;
                    }
                }
            }
        }
    }

    .online-players {
        margin-bottom: 0.2rem;
        font-size: 2rem;
        line-height: 1;
    }
}
</style>
