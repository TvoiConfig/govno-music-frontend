import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlayerStore = defineStore('playerStore', () => {
    // Состояние
    const currentTrack = ref(null);
    const isPlaying = ref(false);
    const volume = ref(1);
    const audioRef = ref(null);
    const currentPlayTime = ref(0);
    const currentPlayTimePercents = ref(0);
    const trackDuration = ref(0);
    const trackList = ref([]);
    const shuffledTrackList = ref([]);
    const repeatStatus = ref("none");
    const shuffleStatus = ref(false);
    const tracksQueue = ref([]);

    // Действия
    /*
    Записывает выбранный пользователем трек
    формирует список треков
     */
    const uploadTrack = (track, tracks) => {
        currentTrack.value = track;

        trackList.value = tracks;
        if (shuffleStatus.value) {
            shuffleList();
            tracksQueue.value = [...shuffledTrackList.value];
        } else {
            tracksQueue.value = [...trackList.value];
        }
    };

    /*
    Устанавливает громкость,
    запускает проигрывание,
    меняет глобальное состояние проигрывания на true
    */
    const playTrack = () => {
        if (audioRef.value) {
            audioRef.value.volume = volume.value;
            audioRef.value.play();
            isPlaying.value = true;   
        }
    };

    // Устанавливает проигрывание трека в начало
    const setPlayTimeStart = () => {
        if (audioRef.value) {
            audioRef.value.currentTime = 0;
        }
    };

    /*
    Инициализирует индекс текущего трека
    запускает следующий трек из очереди
    если трек в очереди последний - запускает первый
     */
    const AutoNextTrack = () => {
        if (!currentTrack.value && !audioRef.value) {
            return;
        }

        const currentIndex = tracksQueue.value.indexOf(currentTrack.value);
        let nextTrack;

        if (currentIndex < 0) {
            return;
        }

        if (repeatStatus.value === "list") {
            if (currentIndex < tracksQueue.value.length - 1) {
                // Переход к следующему треку
                nextTrack = tracksQueue.value[currentIndex + 1];
            } else {
                // Возврат к первому треку
                nextTrack = tracksQueue.value[0];
            }
    
        } else if (repeatStatus.value === "track") {
            currentTrack.value = tracksQueue.value[currentIndex];
            playTrack();
            return;

        } else {
            if (currentIndex < tracksQueue.value.length - 1) {
                nextTrack = tracksQueue.value[currentIndex + 1];
            } else {
                pauseTrack();
                return;
            }
        }
        currentTrack.value = nextTrack;
    };

    const playNextTrack = () => {
        if (!currentTrack.value && !audioRef.value) {
            return;
        }
        
        const currentIndex = tracksQueue.value.indexOf(currentTrack.value);
        let nextTrack;

        if (currentIndex < 0) {
            return;
        }

        if (currentIndex < tracksQueue.value.length - 1) {
            // Переход к следующему треку
            nextTrack = tracksQueue.value[currentIndex + 1];
        } else {
            // Возврат к первому треку
            nextTrack = tracksQueue.value[0];
        }

        currentTrack.value = nextTrack;
    };

    /*
    Инициализирует индекс текущего трека
    запускает предыдущий трек из очереди
    если трек в очереди первый - запускает последний
    если трек проиграл больше 3 секунд вместо переключения отматывает трек в начало
     */
    const playPrevTrack = () => {
        if (currentTrack.value && audioRef.value) {
            if (audioRef.value.currentTime < 3.0) {
                const currentIndex = tracksQueue.value.indexOf(currentTrack.value);
                let prevTrack;

                if (currentIndex > 0) {
                    prevTrack = tracksQueue.value[currentIndex - 1];
                } else {
                    prevTrack = tracksQueue.value[tracksQueue.value.length - 1];
                }

                currentTrack.value = prevTrack;
            } else {
                setPlayTimeStart();
            }
        }
    };

    // Выключает проигрывание, меняет глобальное состояние проигрывания на false
    const pauseTrack = () => {
        if (audioRef.value) {
            audioRef.value.pause();
            isPlaying.value = false;
        }
    };

    // Устанавливает глобальную громкость & Если проигрывание запущено меняет громкость
    const setVolume = (newVolume) => {
        if (newVolume >= 0 && newVolume <= 1) {
            volume.value = newVolume;
            if (audioRef.value) {
                audioRef.value.volume = volume.value;
            }
        }
    };

    /*
    Обновляет текущее время проигрывание и длительность трека
    Если трек кончился выполнять переключение
     */

    const updatePlayTime = (time) => {
        if (audioRef.value && !isNaN(audioRef.value.duration)) {
            currentPlayTime.value = time;
            trackDuration.value = audioRef.value.duration;
            currentPlayTimePercents.value = Math.min((time / audioRef.value.duration) * 100, 100);

            if (currentPlayTimePercents.value === 100) {
                AutoNextTrack();
            }
        }
    };

    // Меняет режимы повтора
    const toggleRepeat = () => {
        if (repeatStatus.value === "none") { // Если выключен любой повтор включить повтор списка
            repeatStatus.value = "list";
        } else if (repeatStatus.value === "list") { //Если включен повтор очереди включить повтор трека
            repeatStatus.value = "track";
        } else { // Если включен повтор трека отключить повтор
            repeatStatus.value = "none";
        }
    };

    // Меняет режим shuffle
    const toggleShuffle = () => {
        if (shuffleStatus.value) {
            shuffleStatus.value = false;
            tracksQueue.value = [...trackList.value];
        } else {
            shuffleStatus.value = true;
            if (trackList.value) {
                shuffleList();
                tracksQueue.value = [...shuffledTrackList.value];
            }
        }
    };

    const shuffleList = () => {
        shuffledTrackList.value = [...trackList.value];
        for (let i = shuffledTrackList.value.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTrackList.value[i], shuffledTrackList.value[j]] = [shuffledTrackList.value[j], shuffledTrackList.value[i]];
        }
    };

    // Возвращает состояние и действия
    return {
        currentTrack,
        isPlaying,
        volume,
        audioRef,
        currentPlayTime,
        currentPlayTimePercents,
        trackDuration,
        repeatStatus,
        shuffleStatus,
        uploadTrack,
        playPrevTrack,
        playTrack,
        playNextTrack,
        pauseTrack,
        setVolume,
        updatePlayTime,
        toggleRepeat,
        toggleShuffle,
    };
});