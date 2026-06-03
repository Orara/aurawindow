// Visual Debugger Removed. Custom logger is disabled.

// Automatically clear settings when version changes (prevent cache conflicts)
function migrateSettings() {
    const CURRENT_VERSION = 'v19'; // bumped
    const storedVersion = localStorage.getItem('aw-version');
    if (storedVersion !== CURRENT_VERSION) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('aw-setting-')) {
                localStorage.removeItem(key);
            }
        }
        localStorage.setItem('aw-version', CURRENT_VERSION);
        console.log(`Cleared legacy localStorage cache for version ${CURRENT_VERSION}`);
    }
}
migrateSettings();

// Utility: Shuffle an array randomly (Fisher-Yates Algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Utility: Extract YouTube Video ID from full URL or just return the ID if already 11-char
function extractVideoId(urlOrId) {
    if (!urlOrId) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : urlOrId.trim();
}

// 10+ Videos Database for each city (Shuffled on load for random viewing experience)
// All IDs are verified to support third-party embedding.
const cities = {
    tokyo: {
        videos: [
            { id: '28ZjrtD_iL0', tags: ['day'] },
            { id: 'nKh4fqyykWg', tags: ['night'] },
            { id: '_s7jU75IoTk', tags: ['sunset', 'night'] },
            { id: 'HWRAX88AE4Q', tags: ['night', 'rain'] },
            { id: 'YrKW5YwAarQ', tags: ['day'] },
            { id: '6ejlf3R6sno', tags: ['day', 'rain'] },
            { id: 'EFP5FqWRf6M', tags: ['night'] },
            { id: 'oGfg0_Lti9M', tags: ['day'] },
            { id: '9A3PcR13z2I', tags: ['night'] }
        ],
        currentVideoIndex: 0,
        nameKr: '도쿄',
        nameEn: 'Tokyo, Japan',
        lat: 35.6895,
        lon: 139.6917,
        timezone: 'Asia/Tokyo',
        music: ['ZhFa3YmsgFI', 'co5np2ipUyQ', 'AznRJvAPtwM']
    },
    seoul: {
        videos: [
            { id: 'w-m4UON2Hlk', tags: ['day', 'sunrise'] },
            { id: 'in9Z8_elhaA', tags: ['day', 'sunset'] },
            { id: '7xe9p4nw6Lg', tags: ['day', 'sunrise'] },
            { id: 'LmtIYtAoays', tags: ['day', 'night', 'rain', 'sunset', 'sunrise'] },
            { id: 'ta_Zmeqd8GU', tags: ['day', 'sunset'] },
            { id: 'wGfJe5T3Vl8', tags: ['night'] },
            { id: '15Jp8a0VE2w', tags: ['night'] },
            { id: 'zRYoBzlVJ-8', tags: ['night'] },
            { id: '3cgUFdzRpEQ', tags: ['night'] },
            { id: 'zxz310jbwFI', tags: ['night'] },
            { id: 'sBtYWK817-0', tags: ['night', 'rain'] },
            { id: 'SgdsWCC0M-0', tags: ['night', 'rain'] },
            { id: 'mpTYO-8Dw5k', tags: ['rain'] },
            { id: 'KAfiNLFaqtM', tags: ['rain'] },
            { id: 'vd8C478vIy0', tags: ['rain'] }
        ],
        currentVideoIndex: 0,
        nameKr: '서울',
        nameEn: 'Seoul, South Korea',
        lat: 37.5665,
        lon: 126.9780,
        timezone: 'Asia/Seoul',
        music: ['JN6HuGEWgHE', '7NOSDKb0HlU', 'YQs7IVvvVYw']
    },
    paris: {
        videos: [
            { id: 'niYHvwVjAsw', tags: ['day'] },
            { id: '6BPuGeS6O4w', tags: ['day', 'sunset'] },
            { id: 'EBmi-7YylJE', tags: ['day'] },
            { id: 'rXSvVe0E7wo', tags: ['night'] },
            { id: 'Sz5WxOUZeTU', tags: ['day', 'rain'] },
            { id: 'I7jOPan1p6E', tags: ['day'] },
            { id: 'dJWgdHuUUbM', tags: ['day'] },
            { id: 'd6lR4tCO2OM', tags: ['day'] },
            { id: '9KgV5JX_nJc', tags: ['day'] },
            { id: '8IG-8KlMFA0', tags: ['day'] }
        ],
        currentVideoIndex: 0,
        nameKr: '파리',
        nameEn: 'Paris, France',
        lat: 48.8566,
        lon: 2.3522,
        timezone: 'Europe/Paris',
        music: ['5jaT_8hy3Vg', 'sX5lzm0FjYI', '_DYAnU3H7RI']
    },
    newyork: {
        videos: [
            { id: 'xDlmsPrNwko', tags: ['night'] },
            { id: '27Pv4Cg4EV4', tags: ['day'] },
            { id: '1aedKShR1rA', tags: ['day'] },
            { id: 'sdi8GLvqC1o', tags: ['day', 'sunset'] },
            { id: 'KQCd8cHCByE', tags: ['day'] },
            { id: 'qjQPUQbfHvk', tags: ['day', 'rain'] },
            { id: 'o-7qkWAbWbU', tags: ['day'] },
            { id: 'kqmtdL692DI', tags: ['day', 'night'] },
            { id: 'dJm43N7E_pA', tags: ['day'] },
            { id: 'plyhXYoDfLQ', tags: ['night'] },
            { id: '2dZnRX60Hbc', tags: ['day', 'snow'] },
            { id: '0KC7MTUqamI', tags: ['day'] }
        ],
        currentVideoIndex: 0,
        nameKr: '뉴욕',
        nameEn: 'New York, USA',
        lat: 40.7128,
        lon: -74.0060,
        timezone: 'America/New_York',
        music: ['5l8khj88MFQ', 'n61ULEU7CO0', 'p_vEUb65XtU']
    },
    london: {
        videos: [
            { id: 'GSnAjDu3VoM', tags: ['day'] },
            { id: '8WlUiln-VeY', tags: ['day', 'sunset'] },
            { id: 'qGlhBHiH8IA', tags: ['night'] },
            { id: 'Kwx4VrR3hdU', tags: ['night', 'rain'] },
            { id: 'yttFUAUdDf4', tags: ['day'] },
            { id: '-AIuXH28uE8', tags: ['day'] },
            { id: 'HPmp7JUPUt4', tags: ['day'] },
            { id: 'pRyHx6oRVlU', tags: ['sunset'] },
            { id: 'xw_mMf1TP90', tags: ['sunrise', 'day'] },
            { id: 'dlt3vmKqyp4', tags: ['day'] },
            { id: 'pZRsGJ-B5qc', tags: ['day'] }
        ],
        currentVideoIndex: 0,
        nameKr: '런던',
        nameEn: 'London, UK',
        lat: 51.5074,
        lon: -0.1278,
        timezone: 'Europe/London',
        music: ['ZjZFzghY7Ew', 'zdXa6Ha91QQ', 'CFGLoQIhmow']
    },
    sydney: {
        videos: [
            { id: 'kU_W-1Y69W0', tags: ['day'] },
            { id: 'F07Z3X8Xm8c', tags: ['day'] },
            { id: 'r0J1tVpGk4Y', tags: ['day'] },
            { id: '3-zY3yS5M10', tags: ['day', 'sunset'] },
            { id: 'rM8y48Fiuxk', tags: ['day', 'rain'] },
            { id: 'g52Bq6X9-m0', tags: ['night'] },
            { id: 'prbCL6A8XfE', tags: ['night'] },
            { id: 'vvMisvTuGYk', tags: ['night', 'rain'] },
            { id: 'yHP1Btzl7zg', tags: ['night'] },
            { id: 'E0-aS-HK0lM', tags: ['day', 'night', 'sunset'] },
            { id: 'uasXLIPjiE8', tags: ['night'] },
            { id: 'I71EklqvvY8', tags: ['day', 'night'] },
            { id: 'RfibmbyNErw', tags: ['day', 'night'] },
            { id: 'tZuIoP04zU4', tags: ['night'] }
        ],
        currentVideoIndex: 0,
        nameKr: '시드니',
        nameEn: 'Sydney, Australia',
        lat: -33.8688,
        lon: 151.2093,
        timezone: 'Australia/Sydney',
        music: ['aAvMDmN1t5A', '7NOSDKb0HlU', 'co5np2ipUyQ']
    },
    cartoon: {
        videos: [], // Cartoon room uses Ghibli AI image slideshow instead of YouTube
        currentVideoIndex: 0,
        nameKr: '만화 속 공부방',
        nameEn: 'Cozy Cartoon Room',
        lat: 35.6895,
        lon: 139.6917,
        timezone: 'Asia/Tokyo',
        music: ['6_z2s6y0mD0', 'JDM6TDiDlAg', 'jfKfPfyJRdk', 'PKFjKOBg7uo'],
        useGhibliSlideshow: true  // special flag: show AI image slideshow
    }
};

const defaultLofiId = '5l8khj88MFQ';
const soundOptions = {
    rain: {
        shower: 'mPZkdNFkNps', // Heavy Rain and Thunder
        window: 'O_ZiH-MlZZ0', // Rain on Window
        forest: 'YN6wj5NfOnM'  // Rain in Forest / Leaves
    },
    cafe: {
        busy: 'gaGrHUekGrc', // Busy Cafe
        jazz: 'yGsswnF5qGQ', // Cozy Jazz Cafe
        cozy: 'dlH4lD8qOcw'  // Cozy Library / Study Cafe
    },
    fire: {
        fireplace: '3_gdxb7AyGo', // Cozy Fireplace
        campfire: 'L_LUpnjgPso',  // Outdoor Campfire
        storm: 'cdKop6aixVE'     // Crackling Fireplace with storm / wind
    }
};

// Multilingual translations dictionary
const translations = {
    ko: {
        brandTitle: "AuraWindow | 방구석 세계 창문",
        sidebarTitle: "전 세계 창문 열기",
        mixerTitle: "백색 소음 믹서",
        soundLofi: "로파이 BGM",
        soundRain: "빗소리",
        soundCafe: "카페 소음",
        soundFire: "모닥불",
        soundSelectRain: {
            shower: "🌧️ 소나기",
            window: "💧 창문의 비",
            forest: "🌲 숲속의 비"
        },
        soundSelectCafe: {
            busy: "☕ 북적이는 카페",
            jazz: "🎷 재즈 카페",
            cozy: "📖 아늑한 서재"
        },
        soundSelectFire: {
            fireplace: "🏡 벽난로",
            campfire: "🏕️ 야외 캠프파이어",
            storm: "⚡ 폭풍우 속 벽난로"
        },
        zenBtn: "집중 모드",
        zenBtnOn: "집중 모드 ON",
        settingsBtn: "설정",
        aboutBtn: "후원하기",
        langBtn: "한국어",
        supportModalTitle: "AuraWindow 후원하기",
        supportModalDesc: "AuraWindow를 이용해 주셔서 감사합니다. 여러분의 따뜻한 응원이 더 매력적인 방구석 세계 창문을 추가하고 서비스를 유지하는 데 큰 도움이 됩니다.",
        supportKakaopay: "카카오페이 송금하기",
        supportBmc: "Buy Me a Coffee",
        settingsModalTitle: "영상 및 음악 설정",
        settingsModalDesc: "유튜브 영상이 차단되었거나 원하는 감성 영상이 따로 있다면, 직접 유튜브 영상 주소(URL) 또는 ID를 넣어 자유롭게 나만의 창문으로 세팅할 수 있습니다.",
        settingLofiLabel: "로파이 배경 음악 (유튜브 링크/ID)",
        settingKakaopayLabel: "카카오페이 송금코드/링크",
        settingBmcLabel: "Buy Me a Coffee 아이디",
        settingSaveBtn: "설정 저장 및 페이지 적용",
        settingResetBtn: "설정 초기화",
        kakaopayQrTitle: "카카오페이 송금하기",
        kakaopayQrDesc: "스마트폰 카메라 또는 카카오톡 QR 스캐너로 아래 코드를 스캔해 주세요.",
        weatherDesc: {
            '맑음': '맑음',
            '흐림': '흐림',
            '안개': '안개',
            '이슬비': '이슬비',
            '비': '비',
            '눈': '눈',
            '뇌우': '뇌우',
            '날씨 정보...': '날씨 정보...',
            '날씨 로딩 중...': '날씨 로딩 중...',
            '아늑함': '아늑함'
        },
        cities: {
            tokyo: { name: "도쿄", desc: "Tokyo, Japan" },
            seoul: { name: "서울", desc: "Seoul, South Korea" },
            paris: { name: "파리", desc: "Paris, France" },
            newyork: { name: "뉴욕", desc: "New York, USA" },
            london: { name: "런던", desc: "London, UK" },
            sydney: { name: "시드니", desc: "Sydney, Australia" },
            cartoon: { name: "만화 속 공부방", desc: "Cozy Cartoon Room" }
        },
        timerBtn: "타이머 Off",
        timerBtnActive: "⏰ {min}분 {sec}초",
        timerDropdown: {
            off: "타이머 끄기",
            min10: "10분",
            min30: "30분",
            min60: "60분",
            min120: "120분",
            customBtn: "설정",
            customPlaceholder: "분"
        },
        sleepGoodNight: "안녕히 주무세요",
        sleepWakeUp: "화면 깨우기",
        skipBtnTitle: "다음 영상으로 넘기기"
    },
    en: {
        brandTitle: "AuraWindow | Ambient Window to the World",
        sidebarTitle: "Open Windows to the World",
        mixerTitle: "Ambient Noise Mixer",
        soundLofi: "Lofi Music",
        soundRain: "Rain Sound",
        soundCafe: "Cafe Ambience",
        soundFire: "Fireplace",
        soundSelectRain: {
            shower: "🌧️ Heavy Rain",
            window: "💧 Rain on Window",
            forest: "🌲 Rain in Forest"
        },
        soundSelectCafe: {
            busy: "☕ Busy Cafe",
            jazz: "🎷 Jazz Cafe",
            cozy: "📖 Cozy Library"
        },
        soundSelectFire: {
            fireplace: "🏡 Fireplace",
            campfire: "🏕️ Campfire",
            storm: "⚡ Fireplace in Storm"
        },
        zenBtn: "Zen Mode",
        zenBtnOn: "Zen Mode ON",
        settingsBtn: "Settings",
        aboutBtn: "Support",
        langBtn: "English",
        supportModalTitle: "Support AuraWindow",
        supportModalDesc: "Thank you for using AuraWindow. Your support helps us add more beautiful windows and maintain the service.",
        supportKakaopay: "Send via KakaoPay",
        supportBmc: "Buy Me a Coffee",
        settingsModalTitle: "Video & Audio Settings",
        settingsModalDesc: "If a YouTube video is blocked or you want to use your own background, enter the YouTube URL or ID here.",
        settingLofiLabel: "Lofi Music (YouTube URL/ID)",
        settingKakaopayLabel: "KakaoPay Link/Code",
        settingBmcLabel: "Buy Me a Coffee ID",
        settingSaveBtn: "Save and Apply Settings",
        settingResetBtn: "Reset Settings",
        kakaopayQrTitle: "KakaoPay Transfer",
        kakaopayQrDesc: "Scan the QR code with your smartphone camera or KakaoTalk scanner.",
        weatherDesc: {
            '맑음': 'Clear',
            '흐림': 'Cloudy',
            '안개': 'Foggy',
            '이슬비': 'Drizzle',
            '비': 'Rainy',
            '눈': 'Snowy',
            '뇌우': 'Stormy',
            '날씨 정보...': 'Loading Weather...',
            '날씨 로딩 중...': 'Loading Weather...',
            '아늑함': 'Cozy'
        },
        cities: {
            tokyo: { name: "Tokyo", desc: "Tokyo, Japan" },
            seoul: { name: "Seoul", desc: "Seoul, South Korea" },
            paris: { name: "Paris", desc: "Paris, France" },
            newyork: { name: "New York", desc: "New York, USA" },
            london: { name: "London", desc: "London, UK" },
            sydney: { name: "Sydney", desc: "Sydney, Australia" },
            cartoon: { name: "Cozy Cartoon Room", desc: "Cartoon Ambient Study" }
        },
        timerBtn: "Timer Off",
        timerBtnActive: "⏰ {min}m {sec}s",
        timerDropdown: {
            off: "Timer Off",
            min10: "10 Mins",
            min30: "30 Mins",
            min60: "60 Mins",
            min120: "120 Mins",
            customBtn: "Set",
            customPlaceholder: "Min"
        },
        sleepGoodNight: "Good Night",
        sleepWakeUp: "Wake Up",
        skipBtnTitle: "Skip to next video"
    },
    ja: {
        brandTitle: "AuraWindow | 世界の窓",
        sidebarTitle: "世界の窓を開く",
        mixerTitle: "ホワイトノイズミキサー",
        soundLofi: "Lofi 音楽",
        soundRain: "雨の音",
        soundCafe: "カフェ騒音",
        soundFire: "焚き火",
        soundSelectRain: {
            shower: "🌧️ にわか雨",
            window: "💧 窓の雨",
            forest: "🌲 森の雨"
        },
        soundSelectCafe: {
            busy: "☕ 賑やかなカフェ",
            jazz: "🎷 ジャズカフェ",
            cozy: "📖 静かな書斎"
        },
        soundSelectFire: {
            fireplace: "🏡 暖炉",
            campfire: "🏕️ キャンプファイヤー",
            storm: "⚡ 嵐の中の暖炉"
        },
        zenBtn: "集中モード",
        zenBtnOn: "集中モード ON",
        settingsBtn: "設定",
        aboutBtn: "応援する",
        langBtn: "日本語",
        supportModalTitle: "AuraWindowを応援する",
        supportModalDesc: "AuraWindowをご利用いただきありがとうございます。皆様の温かいサポートが、より魅力的な窓を追加し、サービスを維持する大きな力になります。",
        supportKakaopay: "KakaoPayで送金",
        supportBmc: "Buy Me a Coffee",
        settingsModalTitle: "動画と音楽の設定",
        settingsModalDesc: "YouTube動画がブロックされている場合や、お気に入りの動画がある場合は、YouTubeのURLまたはIDを入力して自由にカスタマイズできます。",
        settingLofiLabel: "Lofi BGM (YouTube URL/ID)",
        settingKakaopayLabel: "KakaoPay送金リンク/コード",
        settingBmcLabel: "Buy Me a Coffee ID",
        settingSaveBtn: "設定を保存して適用",
        settingResetBtn: "設定初期化",
        kakaopayQrTitle: "KakaoPay送金",
        kakaopayQrDesc: "スマートフォンのカメラまたはKakaoTalkのQRスキャナーでスキャンしてください。",
        weatherDesc: {
            '맑음': '晴れ',
            '흐림': '曇り',
            '안개': '霧',
            '이슬비': '霧雨',
            '비': '雨',
            '눈': '雪',
            '뇌우': '雷雨',
            '날씨 정보...': 'お天気情報...',
            '날씨 로딩 중...': 'お天気読み込み中...',
            '아늑함': 'アットホーム'
        },
        cities: {
            tokyo: { name: "東京", desc: "日本 東京" },
            seoul: { name: "ソウル", desc: "韓国 ソウル" },
            paris: { name: "パリ", desc: "フランス パリ" },
            newyork: { name: "ニューヨーク", desc: "米国 ニューヨーク" },
            london: { name: "ロンドン", desc: "英国 ロンドン" },
            sydney: { name: "シドニー", desc: "豪州 シドニー" },
            cartoon: { name: "\u6f2b\u753b\u306e\u52c9\u5f37\u90e8\u5c4b", desc: "\u30a2\u30c3\u30c8\u30db\u30fc\u30e0\u306a\u7a7a\u9593" }
        },
        timerBtn: "タイマー Off",
        timerBtnActive: "⏰ {min}分 {sec}秒",
        timerDropdown: {
            off: "タイマー オフ",
            min10: "10分",
            min30: "30分",
            min60: "60分",
            min120: "120分",
            customBtn: "設定",
            customPlaceholder: "分"
        },
        sleepGoodNight: "おやすみなさい",
        sleepWakeUp: "画面を起動",
        skipBtnTitle: "次の動画へスキップ"
    }
};

let currentCity = 'tokyo';
let mainPlayer, lofiPlayer, rainPlayer, cafePlayer, firePlayer;
let activeCityVideos = [];
let activeVideoIndex = 0;
let isMuted = false;
let volumes = {
    lofi: 30,
    rain: 0,
    cafe: 0,
    fire: 0
};
let zenModeActive = false;
let idleTimer;
const IDLE_TIME_LIMIT = 5000;
let hasInteracted = false;

// Tracks which city's videos are currently loaded into activeCityVideos
// This prevents race conditions where a stale API callback loads the wrong city's videos
let loadedCityKey = 'tokyo';

// Watchdog timer for detecting infinite-buffering videos (black screen bug)
let videoLoadWatchdog = null;
const VIDEO_LOAD_TIMEOUT_MS = 12000;

// Ghibli slideshow state
let ghibliSlideIndex = 0;
let ghibliSlideshowTimer = null;
const GHIBLI_SLIDE_INTERVAL = 10000; // 10 seconds per slide

// Map weather states to preferred Ghibli slide scenes
const GHIBLI_STATE_SLIDE = {
    rain: 'rain',
    snow: 'snow',
    night: 'night',
    sunrise: 'morning',
    sunset: 'sunset',
    day: 'morning',
    default: 'library'
};

let sleepTimerId = null;
let sleepTimerDuration = 0;
let savedVolumesBeforeSleep = {};

// Ghibli Slideshow manually skip slide
function skipGhibliSlide() {
    const slideshow = document.getElementById('ghibli-slideshow');
    if (!slideshow || slideshow.classList.contains('hidden')) return;

    const allSlides = slideshow.querySelectorAll('.ghibli-slide');
    if (allSlides.length <= 1) return;

    allSlides[ghibliSlideIndex].classList.remove('active');
    ghibliSlideIndex = (ghibliSlideIndex + 1) % allSlides.length;
    allSlides[ghibliSlideIndex].classList.add('active');

    // Reset slide timer
    clearInterval(ghibliSlideshowTimer);
    ghibliSlideshowTimer = setInterval(() => {
        const slides = slideshow.querySelectorAll('.ghibli-slide');
        slides[ghibliSlideIndex].classList.remove('active');
        ghibliSlideIndex = (ghibliSlideIndex + 1) % slides.length;
        slides[ghibliSlideIndex].classList.add('active');
    }, GHIBLI_SLIDE_INTERVAL);
}

// Sleep timer functions
function startSleepTimer(minutes) {
    clearInterval(sleepTimerId);
    sleepTimerId = null;

    if (minutes <= 0) {
        sleepTimerDuration = 0;
        updateTimerButtonUI();
        return;
    }

    sleepTimerDuration = minutes * 60;
    updateTimerButtonUI();

    sleepTimerId = setInterval(() => {
        sleepTimerDuration--;

        // Fade out audio in the last 15 seconds
        if (sleepTimerDuration <= 15 && sleepTimerDuration > 0) {
            const factor = sleepTimerDuration / 15.0; // goes from 1.0 down to 0
            ['lofi', 'rain', 'cafe', 'fire'].forEach(key => {
                const player = getPlayerByKey(key);
                if (player && volumes[key] > 0 && !isMuted) {
                    const targetVol = Math.round(volumes[key] * factor);
                    safePlayerControl(player, 'setVolume', targetVol);
                }
            });
        }

        if (sleepTimerDuration <= 0) {
            clearInterval(sleepTimerId);
            sleepTimerId = null;
            triggerSleep();
        } else {
            updateTimerButtonUI();
        }
    }, 1000);
}

function triggerSleep() {
    // Show sleep overlay
    const sleepOverlay = document.getElementById('sleep-overlay');
    if (sleepOverlay) {
        sleepOverlay.classList.remove('hidden');
    }

    // Save current volumes (so wake up can restore them)
    savedVolumesBeforeSleep = { ...volumes };

    // Pause main background video
    if (mainPlayer) {
        safePlayerControl(mainPlayer, 'pauseVideo');
    }
    if (cities[currentCity].useGhibliSlideshow) {
        stopGhibliSlideshow();
    }

    // Pause all audio
    safePlayerControl(lofiPlayer, 'pauseVideo');
    safePlayerControl(rainPlayer, 'pauseVideo');
    safePlayerControl(cafePlayer, 'pauseVideo');
    safePlayerControl(firePlayer, 'pauseVideo');

    // Visual feedback: set sliders to 0
    ['lofi', 'rain', 'cafe', 'fire'].forEach(key => {
        const slider = document.getElementById(`vol-${key}`);
        if (slider) {
            slider.value = 0;
        }
        volumes[key] = 0;
    });

    // Toggle mute visual indicator
    const muteBtn = document.getElementById('master-mute-btn');
    isMuted = true;
    if (muteBtn) {
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        muteBtn.classList.add('muted');
    }

    sleepTimerDuration = 0;
    updateTimerButtonUI();
}

function wakeUp() {
    const sleepOverlay = document.getElementById('sleep-overlay');
    if (sleepOverlay) {
        sleepOverlay.classList.add('hidden');
    }

    // Unmute
    isMuted = false;
    const muteBtn = document.getElementById('master-mute-btn');
    if (muteBtn) {
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        muteBtn.classList.remove('muted');
    }

    // Restore volumes and restart playback
    ['lofi', 'rain', 'cafe', 'fire'].forEach(key => {
        const savedVol = savedVolumesBeforeSleep[key] || 0;
        volumes[key] = savedVol;
        
        const slider = document.getElementById(`vol-${key}`);
        if (slider) {
            slider.value = savedVol;
        }

        const player = getPlayerByKey(key);
        if (player && savedVol > 0) {
            safePlayerControl(player, 'setVolume', savedVol);
            safePlayerControl(player, 'playVideo');
        }
    });

    // Restore background video/slideshow
    if (cities[currentCity].useGhibliSlideshow) {
        // determine state
        const localHour = new Date().getHours();
        let state = 'day';
        if (localHour < 6 || localHour >= 20) state = 'night';
        else if (localHour >= 5 && localHour < 8) state = 'sunrise';
        else if (localHour >= 17 && localHour < 20) state = 'sunset';
        if (cities.cartoon.weathercode !== undefined) {
            const isRainy = [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(cities.cartoon.weathercode);
            const isSnowy = [71,73,75,77,85,86].includes(cities.cartoon.weathercode);
            if (isRainy) state = 'rain';
            else if (isSnowy) state = 'snow';
        }
        startGhibliSlideshow(state);
    } else {
        if (mainPlayer) {
            safePlayerControl(mainPlayer, 'playVideo');
        }
    }
}

function updateTimerButtonUI() {
    const btnText = document.getElementById('timer-btn-text');
    if (!btnText) return;
    const lang = localStorage.getItem('aw-lang') || 'ko';
    const dict = translations[lang] || translations.ko;
    
    if (sleepTimerDuration <= 0) {
        btnText.textContent = dict.timerBtn || "타이머 Off";
        document.getElementById('timer-btn').classList.remove('active');
    } else {
        const mins = Math.floor(sleepTimerDuration / 60);
        const secs = sleepTimerDuration % 60;
        let activeText = dict.timerBtnActive || "⏰ {min}분 {sec}초";
        activeText = activeText.replace('{min}', mins).replace('{sec}', String(secs).padStart(2, '0'));
        btnText.textContent = activeText;
        document.getElementById('timer-btn').classList.add('active');
    }
}

let activeLofiPlaylist = [];
let currentLofiIndex = 0;

function updateLofiPlaylistForCity(cityKey) {
    const city = cities[cityKey];
    let list = [...city.music];
    
    // Add user's custom lofi if it exists
    const storedLofi = localStorage.getItem('aw-setting-lofi');
    if (storedLofi) {
        list.unshift(storedLofi);
    }
    
    // Shuffle the list
    const customExists = !!storedLofi;
    let listToShuffle = customExists ? list.slice(1) : list;
    shuffleArray(listToShuffle);
    
    activeLofiPlaylist = customExists ? [storedLofi, ...listToShuffle] : listToShuffle;
    currentLofiIndex = 0;
}

// Initialize lofi playlist on start
updateLofiPlaylistForCity(currentCity);

Object.keys(cities).forEach(key => {
    shuffleArray(cities[key].videos);
});

// Load custom user settings from localStorage (if any)
function loadCustomSettings() {
    try {
        Object.keys(cities).forEach(cityKey => {
            const storedId = localStorage.getItem(`aw-setting-${cityKey}`);
            if (storedId) {
                // Put custom City video ID at the front of that city's list
                cities[cityKey].videos.unshift({ id: storedId, tags: ['day', 'night', 'rain', 'snow', 'sunset', 'sunrise', 'cozy'] });
                console.log(`Loaded custom ID for ${cityKey}: ` + storedId);
            }
        });
    } catch (e) {
        console.error('Failed to load custom settings:', e);
    }
}

// Invoke settings loading
loadCustomSettings();

// Apply translations dynamically to the UI based on selected language
function applyTranslations(lang) {
    const dict = translations[lang] || translations.ko;
    
    // Page Title
    document.title = dict.brandTitle;
    
    // Sidebar title
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) sidebarTitle.textContent = dict.sidebarTitle;
    
    // Mixer title
    const mixerHeaderH3 = document.querySelector('.mixer-header h3');
    if (mixerHeaderH3) {
        mixerHeaderH3.innerHTML = `<i class="fa-solid fa-sliders"></i> ${dict.mixerTitle}`;
    }
    
    // Lofi label
    const lofiLabel = document.querySelector('#vol-lofi')?.previousElementSibling?.querySelector('.label-left span');
    if (lofiLabel) lofiLabel.textContent = dict.soundLofi;
    
    // Rain label
    const rainLabel = document.querySelector('#vol-rain')?.previousElementSibling?.querySelector('.label-left span');
    if (rainLabel) rainLabel.textContent = dict.soundRain;
    
    // Cafe label
    const cafeLabel = document.querySelector('#vol-cafe')?.previousElementSibling?.querySelector('.label-left span');
    if (cafeLabel) cafeLabel.textContent = dict.soundCafe;
    
    // Fire label
    const fireLabel = document.querySelector('#vol-fire')?.previousElementSibling?.querySelector('.label-left span');
    if (fireLabel) fireLabel.textContent = dict.soundFire;
    
    // Rain select options
    const selectRain = document.getElementById('select-rain');
    if (selectRain) {
        selectRain.options[0].textContent = dict.soundSelectRain.shower;
        selectRain.options[1].textContent = dict.soundSelectRain.window;
        selectRain.options[2].textContent = dict.soundSelectRain.forest;
    }
    
    // Cafe select options
    const selectCafe = document.getElementById('select-cafe');
    if (selectCafe) {
        selectCafe.options[0].textContent = dict.soundSelectCafe.busy;
        selectCafe.options[1].textContent = dict.soundSelectCafe.jazz;
        selectCafe.options[2].textContent = dict.soundSelectCafe.cozy;
    }
    
    // Fire select options
    const selectFire = document.getElementById('select-fire');
    if (selectFire) {
        selectFire.options[0].textContent = dict.soundSelectFire.fireplace;
        selectFire.options[1].textContent = dict.soundSelectFire.campfire;
        selectFire.options[2].textContent = dict.soundSelectFire.storm;
    }
    
    // Zen button
    const zenBtnSpan = document.querySelector('#zen-mode-btn span');
    if (zenBtnSpan) {
        zenBtnSpan.textContent = zenModeActive ? dict.zenBtnOn : dict.zenBtn;
    }
    
    // Settings button
    const settingsBtnSpan = document.querySelector('#settings-btn span');
    if (settingsBtnSpan) settingsBtnSpan.textContent = dict.settingsBtn;
    
    // About button
    const aboutBtnSpan = document.querySelector('#about-btn span');
    if (aboutBtnSpan) aboutBtnSpan.textContent = dict.aboutBtn;
    
    // Lang button
    const langBtnSpan = document.querySelector('#lang-btn span');
    if (langBtnSpan) langBtnSpan.textContent = dict.langBtn;
    
    // Support Modal
    const supportModalH2 = document.querySelector('#support-modal h2');
    if (supportModalH2) supportModalH2.textContent = dict.supportModalTitle;
    
    const supportModalP = document.querySelector('#support-modal p');
    if (supportModalP) supportModalP.textContent = dict.supportModalDesc;
    
    const supportKakaopayBtn = document.getElementById('support-kakaopay-link');
    if (supportKakaopayBtn) {
        supportKakaopayBtn.innerHTML = `<i class="fa-solid fa-comment"></i> ${dict.supportKakaopay}`;
    }
    
    const supportBmcBtn = document.getElementById('support-bmc-link');
    if (supportBmcBtn) {
        supportBmcBtn.innerHTML = `<i class="fa-solid fa-mug-hot"></i> ${dict.supportBmc}`;
    }
    
    // Settings Modal
    const settingsModalH2 = document.querySelector('#settings-modal h2');
    if (settingsModalH2) settingsModalH2.textContent = dict.settingsModalTitle;
    
    const settingsModalP = document.querySelector('#settings-modal p');
    if (settingsModalP) settingsModalP.textContent = dict.settingsModalDesc;
    
    const settingsLabels = document.querySelectorAll('#settings-form label');
    if (settingsLabels.length >= 10) {
        settingsLabels[0].textContent = dict.settingLofiLabel;
        settingsLabels[1].textContent = dict.settingKakaopayLabel;
        settingsLabels[2].textContent = dict.settingBmcLabel;
        // City Labels
        settingsLabels[3].textContent = `${dict.cities.tokyo.name} ID`;
        settingsLabels[4].textContent = `${dict.cities.seoul.name} ID`;
        settingsLabels[5].textContent = `${dict.cities.paris.name} ID`;
        settingsLabels[6].textContent = `${dict.cities.newyork.name} ID`;
        settingsLabels[7].textContent = `${dict.cities.london.name} ID`;
        settingsLabels[8].textContent = `${dict.cities.sydney.name} ID`;
        settingsLabels[9].textContent = `${dict.cities.cartoon.name} ID`;
    }
    
    const saveBtnText = document.getElementById('save-settings-btn-text');
    if (saveBtnText) {
        saveBtnText.textContent = dict.settingSaveBtn;
    }
    const resetBtnText = document.getElementById('reset-settings-btn-text');
    if (resetBtnText) {
        resetBtnText.textContent = dict.settingResetBtn;
    }
    
    // KakaoPay QR Modal
    const kakaopayQrH2 = document.querySelector('#kakaopay-qr-modal h2');
    if (kakaopayQrH2) kakaopayQrH2.textContent = dict.kakaopayQrTitle;
    
    const kakaopayQrP = document.querySelector('#kakaopay-qr-modal p');
    if (kakaopayQrP) kakaopayQrP.textContent = dict.kakaopayQrDesc;
    
    // Update sidebar city buttons dynamically
    Object.keys(dict.cities).forEach(cityKey => {
        const btn = document.querySelector(`.city-btn[data-city="${cityKey}"]`);
        if (btn) {
            const krSpan = btn.querySelector('.city-name-kr');
            const enSpan = btn.querySelector('.city-name-en');
            if (krSpan) krSpan.textContent = dict.cities[cityKey].name;
            if (enSpan) enSpan.textContent = dict.cities[cityKey].desc;
        }
    });
    
    // Update active dropdown items
    document.querySelectorAll('.lang-option').forEach(opt => {
        if (opt.getAttribute('data-lang') === lang) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
    
    // Timer dropdown options
    const timerBtnText = document.getElementById('timer-btn-text');
    if (timerBtnText && sleepTimerDuration <= 0) {
        timerBtnText.textContent = dict.timerBtn;
    } else if (timerBtnText) {
        updateTimerButtonUI();
    }
    
    // Update timer options text
    const timerDropdown = document.getElementById('timer-dropdown');
    if (timerDropdown) {
        const options = timerDropdown.querySelectorAll('.timer-option');
        if (options.length >= 5) {
            options[0].textContent = dict.timerDropdown.off;
            options[1].textContent = dict.timerDropdown.min10;
            options[2].textContent = dict.timerDropdown.min30;
            options[3].textContent = dict.timerDropdown.min60;
            options[4].textContent = dict.timerDropdown.min120;
        }
        const customInput = document.getElementById('custom-timer-min');
        if (customInput) customInput.placeholder = dict.timerDropdown.customPlaceholder;
        const customBtn = document.getElementById('custom-timer-start-btn');
        if (customBtn) customBtn.textContent = dict.timerDropdown.customBtn;
    }
    
    // Sleep overlay texts
    const sleepTitle = document.getElementById('sleep-title');
    if (sleepTitle) sleepTitle.textContent = dict.sleepGoodNight;
    const sleepWakeBtn = document.getElementById('sleep-wake-btn');
    if (sleepWakeBtn) sleepWakeBtn.textContent = dict.sleepWakeUp;

    // Skip video button title
    const skipBtn = document.getElementById('skip-video-btn');
    if (skipBtn) skipBtn.title = dict.skipBtnTitle || '다음 영상';

    localStorage.setItem('aw-lang', lang);
    
    // Re-run weather updates & clock updates to sync translations
    updateWeather(currentCity);
    updateSidebarWidgets();
}


// Weather code to description mapping
function getWeatherDescAndIcon(code) {
    if (code === 0) return { desc: '맑음', icon: 'fa-sun' };
    if ([1, 2, 3].includes(code)) return { desc: '흐림', icon: 'fa-cloud-sun' };
    if ([45, 48].includes(code)) return { desc: '안개', icon: 'fa-smog' };
    if ([51, 53, 55, 56, 57].includes(code)) return { desc: '이슬비', icon: 'fa-cloud-rain' };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { desc: '비', icon: 'fa-cloud-showers-heavy' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { desc: '눈', icon: 'fa-snowflake' };
    if ([95, 96, 99].includes(code)) return { desc: '뇌우', icon: 'fa-cloud-bolt' };
    return { desc: '맑음', icon: 'fa-sun' };
}

// Watchdog: skip video if it doesn't start playing within VIDEO_LOAD_TIMEOUT_MS
function startVideoWatchdog() {
    clearVideoWatchdog();
    videoLoadWatchdog = setTimeout(() => {
        if (mainPlayer && typeof mainPlayer.getPlayerState === 'function') {
            const state = mainPlayer.getPlayerState();
            if (state === -1 || state === 3 || state === YT.PlayerState.BUFFERING) {
                console.warn('Video load watchdog triggered - video stuck buffering. Skipping...');
                handleMainPlayerError();
            }
        }
    }, VIDEO_LOAD_TIMEOUT_MS);
}

function clearVideoWatchdog() {
    if (videoLoadWatchdog) {
        clearTimeout(videoLoadWatchdog);
        videoLoadWatchdog = null;
    }
}

// ========================
// Ghibli Slideshow Control
// ========================
function startGhibliSlideshow(state) {
    const slideshow = document.getElementById('ghibli-slideshow');
    const videoBg = document.getElementById('video-background');
    if (!slideshow) return;

    // Pause YouTube player to free resources
    if (mainPlayer && typeof mainPlayer.pauseVideo === 'function') {
        try { mainPlayer.pauseVideo(); } catch(e) {}
    }

    // Hide YouTube background, show Ghibli
    if (videoBg) videoBg.style.opacity = '0';
    slideshow.classList.remove('hidden');

    // Pick the right starting slide based on weather state
    const targetScene = GHIBLI_STATE_SLIDE[state] || GHIBLI_STATE_SLIDE.default;
    const slides = slideshow.querySelectorAll('.ghibli-slide');
    slides.forEach(s => s.classList.remove('active'));

    let startIndex = 0;
    slides.forEach((s, i) => {
        if (s.getAttribute('data-scene') === targetScene) startIndex = i;
    });
    ghibliSlideIndex = startIndex;
    slides[ghibliSlideIndex].classList.add('active');

    // Auto-advance slides
    clearInterval(ghibliSlideshowTimer);
    ghibliSlideshowTimer = setInterval(() => {
        const allSlides = slideshow.querySelectorAll('.ghibli-slide');
        allSlides[ghibliSlideIndex].classList.remove('active');
        ghibliSlideIndex = (ghibliSlideIndex + 1) % allSlides.length;
        allSlides[ghibliSlideIndex].classList.add('active');
    }, GHIBLI_SLIDE_INTERVAL);
}

function stopGhibliSlideshow() {
    const slideshow = document.getElementById('ghibli-slideshow');
    const videoBg = document.getElementById('video-background');
    if (!slideshow) return;

    clearInterval(ghibliSlideshowTimer);
    ghibliSlideshowTimer = null;
    slideshow.classList.add('hidden');

    // Restore YouTube background
    if (videoBg) videoBg.style.opacity = '1';

    // Resume player
    if (mainPlayer && typeof mainPlayer.playVideo === 'function') {
        try { mainPlayer.playVideo(); } catch(e) {}
    }
}

// Main Player Initialization
function initMainPlayer() {
    if (activeCityVideos.length === 0) {
        // Populate activeCityVideos initially using local system time fallback
        loadedCityKey = currentCity;
        const localHour = new Date().getHours();
        const isDay = (localHour >= 6 && localHour < 18) ? 1 : 0;
        const state = isDay === 0 ? 'night' : 'day';
        const filtered = cities[currentCity].videos.filter(v => v.tags && v.tags.includes(state));
        activeCityVideos = filtered.length > 0 ? filtered.map(v => v.id) : cities[currentCity].videos.map(v => v.id);
        shuffleArray(activeCityVideos);
    }
    
    const primaryVideoId = activeCityVideos[0];
    console.log('Initializing Main Player with video: ' + primaryVideoId);
    
    try {
        mainPlayer = new YT.Player('main-player', {
            videoId: primaryVideoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                rel: 0,
                showinfo: 0,
                loop: 1,
                playlist: primaryVideoId,
                mute: 1, 
                playsinline: 1,
                iv_load_policy: 3,
                modestbranding: 1,
                origin: window.location.origin 
            },
            events: {
                onReady: (event) => {
                    console.log('Main player is ready and playing.');
                    event.target.playVideo();
                    hideAdblockWarning();
                    startVideoWatchdog();
                },
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        // Video actually started - cancel watchdog
                        clearVideoWatchdog();
                    }
                    // YT.PlayerState.ENDED is 0
                    if (event.data === 0) {
                        console.log('Main player video ended. Playing next video in pool...');
                        playNextMainVideo();
                    }
                    // If video starts buffering again after already playing, restart watchdog
                    if (event.data === YT.PlayerState.BUFFERING) {
                        // Only set watchdog if we haven't started playing yet
                        if (activeVideoIndex === 0) startVideoWatchdog();
                    }
                },
                onError: (event) => {
                    console.warn('Main player encountered error: ' + event.data + '. Loading fallback...');
                    clearVideoWatchdog();
                    handleMainPlayerError();
                }
            }
        });
    } catch (err) {
        console.error('Failed to create main YT.Player: ' + err.message);
    }
}

// Hidden Player Generator
function createHiddenPlayer(elementId, videoId) {
    console.log('Initializing Hidden Player: ' + elementId + ' with ID: ' + videoId);
    try {
        return new YT.Player(elementId, {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                playlist: videoId,
                mute: 0,
                playsinline: 1,
                origin: window.location.origin
            },
            events: {
                onReady: (event) => {
                    console.log(`${elementId} is ready.`);
                    const key = elementId.split('-')[0];
                    event.target.setVolume(volumes[key] || 0);
                    if (elementId === 'lofi-player' && volumes.lofi > 0 && !isMuted) {
                        try {
                            event.target.playVideo();
                        } catch (e) {
                            console.log('Autoplay was blocked by browser on load.');
                        }
                    }
                },
                onStateChange: (event) => {
                    if (elementId === 'lofi-player' && event.data === 0) {
                        console.log('Lofi music track ended. Playing next track...');
                        handleLofiPlayerError();
                    }
                },
                onError: (event) => {
                    console.error(`Hidden player (${elementId}) encountered error: ` + event.data);
                    if (elementId === 'lofi-player') {
                        handleLofiPlayerError();
                    }
                }
            }
        });
    } catch (err) {
        console.error(`Failed to create hidden player (${elementId}): ` + err.message);
        return null;
    }
}

// Global Callback declared safely for YouTube API
window.onYouTubeIframeAPIReady = function() {
    console.log('window.onYouTubeIframeAPIReady fired.');
    try {
        updateLofiPlaylistForCity(currentCity);
        initMainPlayer();
        lofiPlayer = createHiddenPlayer('lofi-player', activeLofiPlaylist[currentLofiIndex]);
        
        // Load default verified sounds
        rainPlayer = createHiddenPlayer('rain-player', soundOptions.rain.shower);
        cafePlayer = createHiddenPlayer('cafe-player', soundOptions.cafe.busy);
        firePlayer = createHiddenPlayer('fire-player', soundOptions.fire.fireplace);
    } catch (e) {
        console.error('Error during player creation: ' + e.message);
    }
};

// Fallback logic for lofi audio player
function handleLofiPlayerError() {
    currentLofiIndex++;
    if (currentLofiIndex < activeLofiPlaylist.length) {
        const nextLofiId = activeLofiPlaylist[currentLofiIndex];
        console.log(`Lofi track failed. Switching to random fallback ${currentLofiIndex}: ${nextLofiId}`);
        if (lofiPlayer && typeof lofiPlayer.loadVideoById === 'function') {
            lofiPlayer.loadVideoById({
                videoId: nextLofiId,
                playlist: nextLofiId
            });
            if (volumes.lofi > 0 && !isMuted) {
                safePlayerControl(lofiPlayer, 'setVolume', volumes.lofi);
                safePlayerControl(lofiPlayer, 'playVideo');
            }
        }
    } else {
        console.log('Exhausted active lofi playlist. Resetting and shuffling...');
        currentLofiIndex = 0;
        shuffleArray(activeLofiPlaylist);
        if (activeLofiPlaylist.length > 0) {
            const nextLofiId = activeLofiPlaylist[currentLofiIndex];
            if (lofiPlayer && typeof lofiPlayer.loadVideoById === 'function') {
                lofiPlayer.loadVideoById({
                    videoId: nextLofiId,
                    playlist: nextLofiId
                });
                if (volumes.lofi > 0 && !isMuted) {
                    safePlayerControl(lofiPlayer, 'setVolume', volumes.lofi);
                    safePlayerControl(lofiPlayer, 'playVideo');
                }
            }
        }
    }
}

// Play next background video on end
function playNextMainVideo() {
    activeVideoIndex++;
    if (activeVideoIndex >= activeCityVideos.length) {
        activeVideoIndex = 0;
        shuffleArray(activeCityVideos);
    }
    
    if (activeCityVideos.length > 0) {
        const nextVideoId = activeCityVideos[activeVideoIndex];
        console.log(`Looping: loading next video ${activeVideoIndex} for ${currentCity}: ${nextVideoId}`);
        if (mainPlayer && typeof mainPlayer.loadVideoById === 'function') {
            try {
                mainPlayer.loadVideoById({
                    videoId: nextVideoId,
                    playlist: nextVideoId
                });
                mainPlayer.playVideo();
                startVideoWatchdog();
            } catch (e) {
                console.error('Error auto-looping main video:', e);
                handleMainPlayerError();
            }
        }
    }
}

// Fallback logic in case a YouTube video embed is blocked by country or owner
function handleMainPlayerError() {
    activeVideoIndex++;
    if (activeVideoIndex < activeCityVideos.length) {
        const nextVideoId = activeCityVideos[activeVideoIndex];
        console.log(`Loading fallback matching video ${activeVideoIndex} for ${currentCity}: ${nextVideoId}`);
        if (mainPlayer && typeof mainPlayer.loadVideoById === 'function') {
            mainPlayer.loadVideoById({
                videoId: nextVideoId,
                playlist: nextVideoId
            });
        }
    } else {
        // If we exhausted matching videos, try the city's full videos pool as a fallback
        console.warn(`Exhausted matching videos for ${currentCity}. Falling back to full city video pool...`);
        const allCityVideoIds = cities[currentCity].videos.map(v => typeof v === 'object' ? v.id : v);
        
        // Filter out videos we already tried to avoid repeating errors
        const untriedVideos = allCityVideoIds.filter(id => !activeCityVideos.includes(id));
        
        if (untriedVideos.length > 0) {
            activeCityVideos = activeCityVideos.concat(shuffleArray(untriedVideos));
            const nextVideoId = activeCityVideos[activeVideoIndex];
            console.log(`Loading fallback video from full pool: ${nextVideoId}`);
            if (mainPlayer && typeof mainPlayer.loadVideoById === 'function') {
                mainPlayer.loadVideoById({
                    videoId: nextVideoId,
                    playlist: nextVideoId
                });
            }
        } else {
            console.error(`All videos in pool exhausted for ${currentCity}`);
        }
    }
}

// Dynamically retrieve player instances from global scope
function getPlayerByKey(key) {
    if (key === 'lofi') return lofiPlayer;
    if (key === 'rain') return rainPlayer;
    if (key === 'cafe') return cafePlayer;
    if (key === 'fire') return firePlayer;
    return null;
}

// Safe player control utility
function safePlayerControl(player, action, value = null) {
    if (player && typeof player[action] === 'function') {
        try {
            if (value !== null) {
                player[action](value);
            } else {
                player[action]();
            }
        } catch (e) {
            console.error(`Error executing ${action} on player:`, e);
        }
    } else {
        console.warn(`Player not ready or missing action ${action}`);
    }
}

// Helper to filter and apply city video based on weather/time state
// cityKey: the city we want to load videos for
function applyCityVideoByState(cityKey, state, isDay) {
    // Guard: if user switched city before async callback fired, bail out
    if (cityKey !== currentCity) {
        console.log(`Stale city update ignored: requested ${cityKey} but current is ${currentCity}`);
        return;
    }

    const city = cities[cityKey];

    // Special case: cartoon room uses Ghibli slideshow, not YouTube
    if (city.useGhibliSlideshow) {
        startGhibliSlideshow(state);
        return;
    }

    // Special case: Reykjavik always plays aurora — ignore weather/time
    let filtered;
    if (city.alwaysAurora) {
        filtered = city.videos.filter(v => v && typeof v === 'object');
        console.log(`[${cityKey}] Aurora mode: loading all ${filtered.length} aurora videos`);
    } else {
        // Normal: filter by weather/time state
        filtered = city.videos.filter(v => {
            if (!v || typeof v !== 'object' || !v.tags || !Array.isArray(v.tags)) return false;
            return v.tags.includes(state);
        });

        // Ensure we have at least 5 videos in the active pool for variety.
        // If we have fewer than 5 matching videos, pad with other videos from the city.
        if (filtered.length < 5) {
            // First pad with day/night matching videos based on timezone state
            const fallbackTag = isDay === 0 ? 'night' : 'day';
            const fallbackFiltered = city.videos.filter(v => {
                if (!v || typeof v !== 'object' || !v.tags || !Array.isArray(v.tags)) return false;
                return v.tags.includes(fallbackTag) && !filtered.some(fv => fv.id === v.id);
            });
            filtered = filtered.concat(fallbackFiltered);
        }

        // If we still have fewer than 5, pad with all other videos of the same city
        if (filtered.length < 5) {
            const remaining = city.videos.filter(v => {
                if (!v || typeof v !== 'object') return false;
                return !filtered.some(fv => fv.id === v.id);
            });
            filtered = filtered.concat(remaining);
        }
    }

    if (filtered.length === 0) {
        console.error(`No valid videos found for city: ${cityKey}`);
        return;
    }

    // Remember current video to avoid immediate repeat
    const prevVideoId = activeCityVideos.length > 0 ? activeCityVideos[activeVideoIndex] : null;

    // Shuffle the filtered videos
    const shuffled = shuffleArray(filtered.map(v => typeof v === 'object' ? v.id : v));

    // Move prev video to end so it doesn't repeat immediately
    if (prevVideoId && shuffled[0] === prevVideoId && shuffled.length > 1) {
        shuffled.push(shuffled.shift());
    }

    activeCityVideos = shuffled;
    activeVideoIndex = 0;
    loadedCityKey = cityKey;

    const targetVideoId = activeCityVideos[0];
    console.log(`[${cityKey}] Loading video (state: ${state}, isDay: ${isDay}): ${targetVideoId}`);

    if (mainPlayer && typeof mainPlayer.loadVideoById === 'function') {
        try {
            clearVideoWatchdog();
            mainPlayer.loadVideoById({ videoId: targetVideoId, playlist: targetVideoId });
            mainPlayer.playVideo();
            startVideoWatchdog();
        } catch (e) {
            console.error('Error loading video by state:', e);
        }
    }
}

// Local update weather/video based on pre-fetched batch data
function updateWeather(cityKey) {
    const weatherWidget = document.getElementById('weather-widget');
    const lang = localStorage.getItem('aw-lang') || 'ko';
    
    if (weatherWidget) {
        const loadingText = translations[lang]?.weatherDesc['날씨 정보...'] || '날씨 정보...';
        weatherWidget.innerHTML = `<span class="weather-loading"><i class="fa-solid fa-circle-notch fa-spin"></i> ${loadingText}</span>`;
    }
    
    const city = cities[cityKey];
    
    if (city.temp !== undefined && city.weathercode !== undefined) {
        const temp = city.temp;
        const code = city.weathercode;
        const isDay = city.isDay !== undefined ? city.isDay : 1;
        const weatherInfo = getWeatherDescAndIcon(code);
        
        // Get translated weather description and city name
        const translatedWeatherDesc = translations[lang]?.weatherDesc[weatherInfo.desc] || weatherInfo.desc;
        const cityName = translations[lang]?.cities[cityKey]?.name || city.nameKr;
        
        if (weatherWidget) {
            weatherWidget.innerHTML = `
                <i class="fa-solid ${weatherInfo.icon}"></i>
                <span>${cityName} • ${temp}°C ${translatedWeatherDesc}</span>
            `;
        }
        
        // Determine state
        let state = 'day';
        const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
        const isSnowy = [71, 73, 75, 77, 85, 86].includes(code);
        
        if (isRainy) {
            state = 'rain';
        } else if (isSnowy) {
            state = 'snow';
        } else {
            // Determine state by local timezone hour
            try {
                const formatter = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    hour12: false,
                    timeZone: city.timezone
                });
                const localHour = parseInt(formatter.format(new Date()));
                
                if (localHour >= 5 && localHour < 8) {
                    state = 'sunrise';
                } else if (localHour >= 17 && localHour < 20) {
                    state = 'sunset';
                } else if (isDay === 0) {
                    state = 'night';
                } else {
                    state = 'day';
                }
            } catch (e) {
                state = isDay === 0 ? 'night' : 'day';
            }
        }
        
        applyCityVideoByState(cityKey, state, isDay);
    } else {
        // Fallback if batch fetch has not completed yet or failed
        console.log(`Pre-fetched weather missing for ${cityKey}. Using local system time fallback...`);
        const localHour = new Date().getHours();
        const isDay = (localHour >= 6 && localHour < 18) ? 1 : 0;
        let state = 'day';
        if (isDay === 0) {
            state = 'night';
        } else if (localHour >= 5 && localHour < 8) {
            state = 'sunrise';
        } else if (localHour >= 17 && localHour < 20) {
            state = 'sunset';
        }
        
        const loadingText = translations[lang]?.weatherDesc['날씨 로딩 중...'] || '날씨 로딩 중...';
        const cityName = translations[lang]?.cities[cityKey]?.name || city.nameKr;
        if (weatherWidget) {
            weatherWidget.innerHTML = `
                <i class="fa-solid fa-cloud"></i>
                <span>${cityName} • ${loadingText}</span>
            `;
        }
        
        applyCityVideoByState(cityKey, state, isDay);
    }
}

// Batch Fetch Weather Data for ALL cities in a single API call
async function fetchAllCitiesWeather() {
    try {
        const keys = Object.keys(cities).filter(k => k !== 'cartoon'); // Exclude virtual cartoon room from network call
        const lats = keys.map(k => cities[k].lat).join(',');
        const lons = keys.map(k => cities[k].lon).join(',');
        
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`);
        if (!response.ok) throw new Error('Batch weather fetch failed');
        const data = await response.json();
        
        const results = Array.isArray(data) ? data : [data];
        
        keys.forEach((key, index) => {
            const result = results[index];
            if (result && result.current_weather) {
                const temp = Math.round(result.current_weather.temperature);
                const code = result.current_weather.weathercode;
                const isDay = result.current_weather.is_day;
                const weatherInfo = getWeatherDescAndIcon(code);
                
                // Store inside city object
                cities[key].temp = temp;
                cities[key].weathercode = code;
                cities[key].isDay = isDay;
                cities[key].weatherIcon = weatherInfo.icon;
                cities[key].weatherDesc = weatherInfo.desc;
            }
        });
        
        // Mirror Tokyo's weather to Cozy Cartoon Room (cartoon)
        if (cities.tokyo && cities.cartoon) {
            cities.cartoon.temp = cities.tokyo.temp;
            cities.cartoon.weathercode = cities.tokyo.weathercode;
            cities.cartoon.isDay = cities.tokyo.isDay;
            cities.cartoon.weatherIcon = cities.tokyo.weatherIcon;
            cities.cartoon.weatherDesc = cities.tokyo.weatherDesc;
        }
        
        console.log('All cities weather successfully batch pre-fetched.');
        
        // Update sidebar and top bar active weather widget immediately
        updateSidebarWidgets();
        // Capture currentCity at the moment fetch completed to pass into updateWeather
        // This ensures the correct city is updated even if user switches mid-fetch
        const cityAtFetchComplete = currentCity;
        updateWeather(cityAtFetchComplete);
        
    } catch (error) {
        console.error('Error batch fetching weather for all cities:', error);
        
        // If batch fetch failed, ensure sidebar and top widget fallbacks are still applied
        updateSidebarWidgets();
        const cityAtFetchComplete = currentCity;
        updateWeather(cityAtFetchComplete);
    }
}

// Update sidebar weather tags and local times in real-time
function updateSidebarWidgets() {
    const lang = localStorage.getItem('aw-lang') || 'ko';
    Object.keys(cities).forEach(cityKey => {
        const city = cities[cityKey];
        const tagEl = document.getElementById(`tag-${cityKey}`);
        if (!tagEl) return;
        
        // Format local time using city's specific timezone
        let timeStr = '00:00';
        try {
            const formatter = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: city.timezone
            });
            timeStr = formatter.format(new Date());
        } catch (e) {
            console.error('Time formatting error for ' + cityKey, e);
        }
        
        if (city.temp !== undefined && city.weatherIcon !== undefined) {
            const translatedWeatherDesc = translations[lang]?.weatherDesc[city.weatherDesc] || city.weatherDesc;
            tagEl.innerHTML = `<i class="fa-solid ${city.weatherIcon}"></i> ${city.temp}°C • ${timeStr}`;
        } else {
            // Fallback to clock and time only
            tagEl.innerHTML = `<i class="fa-solid fa-clock"></i> ${timeStr}`;
        }
    });
}

// Clock logic
function updateClock() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const weekday = weekdays[now.getDay()];
    
    document.getElementById('clock-time').textContent = timeString;
    document.getElementById('clock-date').textContent = `${year}.${month}.${date} ${weekday}`;
}

// Support Links logic
function updateSupportLinks() {
    const kakaopayVal = localStorage.getItem('aw-setting-kakaopay') || '';
    const bmcVal = localStorage.getItem('aw-setting-bmc') || '';
    
    const kakaopayLink = document.getElementById('support-kakaopay-link');
    const bmcLink = document.getElementById('support-bmc-link');
    
    if (kakaopayLink) {
        if (kakaopayVal.trim()) {
            let val = kakaopayVal.trim();
            if (!val.includes('link.kakaopay.com') && !val.includes('kakaopay.com')) {
                kakaopayLink.href = `https://link.kakaopay.com/_/${val}`;
            } else {
                if (!val.startsWith('http://') && !val.startsWith('https://')) {
                    val = `https://${val}`;
                }
                kakaopayLink.href = val;
            }
        } else {
            kakaopayLink.href = 'https://www.kakaopay.com';
        }
    }
    
    if (bmcLink) {
        if (bmcVal.trim()) {
            let val = bmcVal.trim();
            if (!val.includes('buymeacoffee.com')) {
                bmcLink.href = `https://buymeacoffee.com/${val}`;
            } else {
                if (!val.startsWith('http://') && !val.startsWith('https://')) {
                    val = `https://${val}`;
                }
                bmcLink.href = val;
            }
        } else {
            bmcLink.href = 'https://buymeacoffee.com';
        }
    }
}

// Sound Slider Event Binder (Retrieves player dynamically)
function handleVolumeChange(sliderId, volumeKey) {
    const slider = document.getElementById(sliderId);
    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        volumes[volumeKey] = val;
        
        // Trigger first user gesture flag
        triggerUserGesture();

        const player = getPlayerByKey(volumeKey);
        if (player && !isMuted) {
            safePlayerControl(player, 'setVolume', val);
            if (val > 0) {
                safePlayerControl(player, 'playVideo');
            } else {
                safePlayerControl(player, 'pauseVideo');
            }
        }
    });
}

// City Change Logic
function changeCity(cityKey) {
    if (cityKey === currentCity) return;

    const prevCity = currentCity;
    console.log(`Changing city from ${prevCity} to ${cityKey}`);
    currentCity = cityKey;

    // Update Sidebar visual states immediately
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-city') === cityKey);
    });

    const city = cities[cityKey];

    // ── Cartoon room: switch to Ghibli slideshow ──
    if (city.useGhibliSlideshow) {
        stopGhibliSlideshow(); // ensure clean state first
        // determine current state for slide scene selection
        const localHour = new Date().getHours();
        let state = 'day';
        if (localHour < 6 || localHour >= 20) state = 'night';
        else if (localHour >= 5 && localHour < 8) state = 'sunrise';
        else if (localHour >= 17 && localHour < 20) state = 'sunset';
        // Use weather state if available
        if (city.weathercode !== undefined) {
            const isRainy = [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(city.weathercode);
            const isSnowy = [71,73,75,77,85,86].includes(city.weathercode);
            if (isRainy) state = 'rain';
            else if (isSnowy) state = 'snow';
        }
        startGhibliSlideshow(state);

        // Update lofi music for cartoon room
        updateLofiPlaylistForCity(cityKey);
        if (lofiPlayer && activeLofiPlaylist.length > 0) {
            try {
                lofiPlayer.loadVideoById({ videoId: activeLofiPlaylist[0], playlist: activeLofiPlaylist[0] });
                if (volumes.lofi > 0 && !isMuted) {
                    safePlayerControl(lofiPlayer, 'setVolume', volumes.lofi);
                    safePlayerControl(lofiPlayer, 'playVideo');
                }
            } catch(e) { console.error('Lofi change error:', e); }
        }
        updateWeather(cityKey);
        return;
    }

    // ── Other cities: stop Ghibli slideshow if it was running ──
    if (cities[prevCity]?.useGhibliSlideshow) {
        stopGhibliSlideshow();
    }

    // Reset video pool for the new city immediately using local time
    loadedCityKey = cityKey;
    const localHour = new Date().getHours();
    const isDay = (localHour >= 6 && localHour < 18) ? 1 : 0;
    const state = isDay === 0 ? 'night' : 'day';

    // For aurora cities: use all videos; others: filter by time
    let filtered;
    if (city.alwaysAurora) {
        filtered = city.videos.filter(v => v && typeof v === 'object');
    } else {
        filtered = city.videos.filter(v => v && typeof v === 'object' && v.tags && v.tags.includes(state));
        if (filtered.length === 0) filtered = city.videos.filter(v => v && typeof v === 'object');
    }

    // Avoid repeating previously playing video
    const prevVideoId = activeCityVideos.length > 0 ? activeCityVideos[activeVideoIndex] : null;
    const shuffled = shuffleArray(filtered.map(v => v.id));
    if (prevVideoId && shuffled[0] === prevVideoId && shuffled.length > 1) shuffled.push(shuffled.shift());
    activeCityVideos = shuffled;
    activeVideoIndex = 0;

    // Load immediately — don't wait for weather API
    if (mainPlayer && typeof mainPlayer.loadVideoById === 'function' && activeCityVideos.length > 0) {
        try {
            clearVideoWatchdog();
            mainPlayer.loadVideoById({ videoId: activeCityVideos[0], playlist: activeCityVideos[0] });
            mainPlayer.playVideo();
            startVideoWatchdog();
        } catch (e) { console.error('Error loading city video on change:', e); }
    }

    // Update lofi music
    updateLofiPlaylistForCity(cityKey);
    if (lofiPlayer && activeLofiPlaylist.length > 0) {
        try {
            lofiPlayer.loadVideoById({ videoId: activeLofiPlaylist[0], playlist: activeLofiPlaylist[0] });
            if (volumes.lofi > 0 && !isMuted) {
                safePlayerControl(lofiPlayer, 'setVolume', volumes.lofi);
                safePlayerControl(lofiPlayer, 'playVideo');
            } else {
                safePlayerControl(lofiPlayer, 'pauseVideo');
            }
        } catch (e) { console.error('Error changing city lofi track:', e); }
    }

    // Refine video with actual weather (guarded by city check in applyCityVideoByState)
    updateWeather(cityKey);
}

// Trigger play on active audio sources on first user interaction (bypasses browser autoplay blocks)
function triggerUserGesture() {
    if (hasInteracted) return;
    hasInteracted = true;
    console.log('First user gesture detected. Unblocking audio.');

    // Ensure main background video plays
    if (mainPlayer) {
        safePlayerControl(mainPlayer, 'playVideo');
    }

    // Play lofi (which is set to 30% by default) if slider is > 0
    if (volumes.lofi > 0 && lofiPlayer) {
        safePlayerControl(lofiPlayer, 'setVolume', volumes.lofi);
        safePlayerControl(lofiPlayer, 'playVideo');
    }
}

// Zen Mode Logic (Hides UI automatically on start only)
function startIdleTimer() {
    clearTimeout(idleTimer);
    if (zenModeActive) {
        idleTimer = setTimeout(() => {
            console.log('Idle timeout reached. Hiding controls.');
            document.getElementById('app-ui').classList.add('zen-mode');
        }, IDLE_TIME_LIMIT);
    }
}

// Helper to show/hide AdBlock warnings on UI
function showAdblockWarning() {
    const warning = document.getElementById('adblock-warning');
    if (!warning) {
        const div = document.createElement('div');
        div.id = 'adblock-warning';
        div.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(255, 64, 129, 0.95); color:#ffffff; padding:12px 24px; borderRadius:30px; fontSize:13px; fontWeight:700; zIndex:99999; boxShadow:0 4px 15px rgba(255, 64, 129, 0.4); backdropFilter:blur(10px); pointer-events:auto;';
        div.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> 유튜브 동영상이 차단되었습니다. 광고 차단기(AdBlock)를 끄거나 비활성화해 주세요.';
        document.body.appendChild(div);
    }
}

function hideAdblockWarning() {
    const warning = document.getElementById('adblock-warning');
    if (warning) {
        warning.remove();
    }
}

// Check if YouTube API loaded, otherwise set safety timeout warning
setTimeout(() => {
    if (!window.YT || !window.YT.Player) {
        console.warn('YouTube script is blocked or failed to load within 4s.');
        showAdblockWarning();
    }
}, 4000);

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired.');
    // 1. Setup Clock & Support Links
    updateClock();
    setInterval(updateClock, 1000);
    updateSupportLinks();
    
    // 2. Fetch Weather for All Cities (Batch)
    fetchAllCitiesWeather();
    setInterval(updateSidebarWidgets, 30000); // update clocks in sidebar every 30s
    setInterval(fetchAllCitiesWeather, 600000); // re-fetch weather data every 10 minutes
    
    // 3. Connect Sound Sliders
    handleVolumeChange('vol-lofi', 'lofi');
    handleVolumeChange('vol-rain', 'rain');
    handleVolumeChange('vol-cafe', 'cafe');
    handleVolumeChange('vol-fire', 'fire');
    
    // Setup initial slider volumes visually
    document.getElementById('vol-lofi').value = volumes.lofi;
    document.getElementById('vol-rain').value = volumes.rain;
    document.getElementById('vol-cafe').value = volumes.cafe;
    document.getElementById('vol-fire').value = volumes.fire;

    // 4. Connect City Buttons
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            triggerUserGesture();
            const city = btn.getAttribute('data-city');
            changeCity(city);
        });
    });

    // 5. Connect Ambient Sound Dropdown Selectors
    document.getElementById('select-rain').addEventListener('change', (e) => {
        triggerUserGesture();
        const mode = e.target.value;
        const videoId = soundOptions.rain[mode];
        console.log(`Changing rain sound type to ${mode}: ${videoId}`);
        if (rainPlayer && typeof rainPlayer.loadVideoById === 'function') {
            rainPlayer.loadVideoById({
                videoId: videoId,
                playlist: videoId
            });
            // If slider volume is > 0, make sure it plays immediately, otherwise pause
            if (volumes.rain > 0 && !isMuted) {
                safePlayerControl(rainPlayer, 'setVolume', volumes.rain);
                safePlayerControl(rainPlayer, 'playVideo');
            } else {
                safePlayerControl(rainPlayer, 'pauseVideo');
            }
        }
    });

    document.getElementById('select-cafe').addEventListener('change', (e) => {
        triggerUserGesture();
        const mode = e.target.value;
        const videoId = soundOptions.cafe[mode];
        console.log(`Changing cafe sound type to ${mode}: ${videoId}`);
        if (cafePlayer && typeof cafePlayer.loadVideoById === 'function') {
            cafePlayer.loadVideoById({
                videoId: videoId,
                playlist: videoId
            });
            if (volumes.cafe > 0 && !isMuted) {
                safePlayerControl(cafePlayer, 'setVolume', volumes.cafe);
                safePlayerControl(cafePlayer, 'playVideo');
            } else {
                safePlayerControl(cafePlayer, 'pauseVideo');
            }
        }
    });

    document.getElementById('select-fire').addEventListener('change', (e) => {
        triggerUserGesture();
        const mode = e.target.value;
        const videoId = soundOptions.fire[mode];
        console.log(`Changing fireplace sound type to ${mode}: ${videoId}`);
        if (firePlayer && typeof firePlayer.loadVideoById === 'function') {
            firePlayer.loadVideoById({
                videoId: videoId,
                playlist: videoId
            });
            if (volumes.fire > 0 && !isMuted) {
                safePlayerControl(firePlayer, 'setVolume', volumes.fire);
                safePlayerControl(firePlayer, 'playVideo');
            } else {
                safePlayerControl(firePlayer, 'pauseVideo');
            }
        }
    });

    // 6. Intro Overlay: click Enter to dismiss and start audio
    //    Browser autoplay policy requires a user gesture — the Enter button IS that gesture.
    const introOverlay = document.getElementById('intro-overlay');
    const introBtn = document.getElementById('intro-enter-btn');
    function dismissIntro() {
        if (!introOverlay) return;
        introOverlay.classList.add('hidden');
        // Start all audio now that we have a user gesture
        triggerUserGesture();
        // Remove the old body click listener (no longer needed)
    }
    if (introBtn) {
        introBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dismissIntro();
        });
    }
    // Fallback: clicking anywhere on overlay also dismisses
    if (introOverlay) {
        introOverlay.addEventListener('click', dismissIntro);
    }

    // 7. Master Mute Toggle
    const muteBtn = document.getElementById('master-mute-btn');
    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerUserGesture();
        isMuted = !isMuted;
        if (isMuted) {
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            muteBtn.classList.add('muted');
            
            safePlayerControl(lofiPlayer, 'pauseVideo');
            safePlayerControl(rainPlayer, 'pauseVideo');
            safePlayerControl(cafePlayer, 'pauseVideo');
            safePlayerControl(firePlayer, 'pauseVideo');
        } else {
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            muteBtn.classList.remove('muted');
            
            const soundPlayers = [
                { key: 'lofi', player: lofiPlayer },
                { key: 'rain', player: rainPlayer },
                { key: 'cafe', player: cafePlayer },
                { key: 'fire', player: firePlayer }
            ];
            
            soundPlayers.forEach(({ key, player }) => {
                const val = volumes[key];
                if (val > 0 && player) {
                    safePlayerControl(player, 'setVolume', val);
                    safePlayerControl(player, 'playVideo');
                }
            });
        }
    });

    // 8. Zen Mode Toggle Button
    const zenBtn = document.getElementById('zen-mode-btn');
    zenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerUserGesture();
        
        const appUi = document.getElementById('app-ui');
        zenModeActive = !zenModeActive;
        
        // Get active translation dictionary
        const lang = localStorage.getItem('aw-lang') || 'ko';
        const dict = translations[lang] || translations.ko;
        
        if (zenModeActive) {
            console.log('Zen Mode Activated.');
            zenBtn.classList.add('active');
            zenBtn.querySelector('span').textContent = dict.zenBtnOn;
            zenBtn.querySelector('i').className = 'fa-solid fa-eye';
            appUi.classList.add('zen-mode');
        } else {
            console.log('Zen Mode Deactivated.');
            zenBtn.classList.remove('active');
            zenBtn.querySelector('span').textContent = dict.zenBtn;
            zenBtn.querySelector('i').className = 'fa-solid fa-eye-slash';
            clearTimeout(idleTimer);
            appUi.classList.remove('zen-mode');
        }
    });

    // 9. Settings Modal Events
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const settingsForm = document.getElementById('settings-form');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Pre-populate setting fields with current values (show empty if not customized to prevent locking defaults)
        document.getElementById('setting-lofi').value = localStorage.getItem('aw-setting-lofi') || '';
        document.getElementById('setting-kakaopay').value = localStorage.getItem('aw-setting-kakaopay') || '';
        document.getElementById('setting-bmc').value = localStorage.getItem('aw-setting-bmc') || '';
        
        // Handle potentially object-formatted city videos dynamically
        const getSettingVal = (cityKey) => {
            return localStorage.getItem(`aw-setting-${cityKey}`) || '';
        };
        
        document.getElementById('setting-tokyo').value = getSettingVal('tokyo');
        document.getElementById('setting-seoul').value = getSettingVal('seoul');
        document.getElementById('setting-paris').value = getSettingVal('paris');
        document.getElementById('setting-newyork').value = getSettingVal('newyork');
        document.getElementById('setting-london').value = getSettingVal('london');
        document.getElementById('setting-sydney').value = getSettingVal('sydney');
        document.getElementById('setting-reykjavik').value = getSettingVal('reykjavik');
        document.getElementById('setting-cartoon').value = getSettingVal('cartoon');
        
        settingsModal.classList.remove('hidden');
    });

    closeSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsModal.classList.add('hidden');
    });

    // Save Settings Event Handler
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const lofiInput = extractVideoId(document.getElementById('setting-lofi').value);
            if (lofiInput) {
                localStorage.setItem('aw-setting-lofi', lofiInput);
            } else {
                localStorage.removeItem('aw-setting-lofi');
            }
            
            const kakaopayInput = document.getElementById('setting-kakaopay').value.trim();
            if (kakaopayInput) {
                localStorage.setItem('aw-setting-kakaopay', kakaopayInput);
            } else {
                localStorage.removeItem('aw-setting-kakaopay');
            }
            
            const bmcInput = document.getElementById('setting-bmc').value.trim();
            if (bmcInput) {
                localStorage.setItem('aw-setting-bmc', bmcInput);
            } else {
                localStorage.removeItem('aw-setting-bmc');
            }
            
            const keys = ['tokyo', 'seoul', 'paris', 'newyork', 'london', 'sydney', 'cartoon'];
            keys.forEach(key => {
                const el = document.getElementById(`setting-${key}`);
                if (!el) return;
                const val = extractVideoId(el.value);
                if (val) {
                    localStorage.setItem(`aw-setting-${key}`, val);
                } else {
                    localStorage.removeItem(`aw-setting-${key}`);
                }
            });
            
            console.log('Custom configurations successfully saved. Reloading page...');
            window.location.reload();
        } catch (err) {
            console.error('Error occurred while saving configurations:', err);
        }
    });

    // Reset Settings Event Handler
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const savedLang = localStorage.getItem('aw-lang') || 'ko';
            let confirmMsg = '모든 커스텀 비디오 및 후원 정보 설정을 초기화하시겠습니까?';
            if (savedLang === 'ja') {
                confirmMsg = 'すべてのカスタム動画および応援設定を初期化しますか？';
            } else if (savedLang === 'en') {
                confirmMsg = 'Are you sure you want to reset all custom video and support settings?';
            }
            
            if (confirm(confirmMsg)) {
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('aw-setting-')) {
                        localStorage.removeItem(key);
                    }
                }
                console.log('Settings reset. Reloading...');
                window.location.reload();
            }
        });
    }

    // Close settings modal on outside click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    // 10. Support Modal Events
    const aboutBtn = document.getElementById('about-btn');
    const supportModal = document.getElementById('support-modal');
    const closeModalBtn = supportModal.querySelector('.close-modal-btn');
    
    aboutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        supportModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        supportModal.classList.add('hidden');
    });

    supportModal.addEventListener('click', (e) => {
        if (e.target === supportModal) {
            supportModal.classList.add('hidden');
        }
    });

    // 11. KakaoPay QR Modal Events for PC Users
    const kakaopayLink = document.getElementById('support-kakaopay-link');
    const qrModal = document.getElementById('kakaopay-qr-modal');
    const qrImg = document.getElementById('kakaopay-qr-img');
    const qrFallback = document.getElementById('kakaopay-qr-fallback-text');
    const closeQrBtn = document.getElementById('close-qr-btn');

    if (kakaopayLink) {
        kakaopayLink.addEventListener('click', (e) => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
            
            if (!isMobile) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetUrl = kakaopayLink.href;
                
                if (targetUrl === 'https://www.kakaopay.com') {
                    const savedLang = localStorage.getItem('aw-lang') || 'ko';
                    if (savedLang === 'ko') {
                        alert('설정에서 카카오페이 송금코드를 먼저 등록해 주세요.');
                    } else if (savedLang === 'ja') {
                        alert('設定でKakaoPay送金リンクを先に登録してください。');
                    } else {
                        alert('Please register your KakaoPay link in settings first.');
                    }
                    return;
                }
                
                // Show loader or QR code using free api.qrserver.com
                qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}`;
                
                // Set fallback link text
                const savedLang = localStorage.getItem('aw-lang') || 'ko';
                if (savedLang === 'ko') {
                    qrFallback.innerHTML = `스캔이 안 되시나요? <a href="${targetUrl}" target="_blank" style="color: var(--accent-color); text-decoration: underline; font-weight: 700;">이곳을 클릭</a>하여 페이지로 이동해 보세요.`;
                } else if (savedLang === 'ja') {
                    qrFallback.innerHTML = `スキャンできない場合、 <a href="${targetUrl}" target="_blank" style="color: var(--accent-color); text-decoration: underline; font-weight: 700;">ここをクリック</a>してページに移動してください。`;
                } else {
                    qrFallback.innerHTML = `Scanning issues? <a href="${targetUrl}" target="_blank" style="color: var(--accent-color); text-decoration: underline; font-weight: 700;">Click here</a> to go to link directly.`;
                }
                
                // Hide support main modal and open QR modal
                supportModal.classList.add('hidden');
                qrModal.classList.remove('hidden');
            }
        });
    }

    if (closeQrBtn) {
        closeQrBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            qrModal.classList.add('hidden');
        });
    }

    if (qrModal) {
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                qrModal.classList.add('hidden');
            }
        });
    }

    // 12. Setup Language Select Dropdown Toggle & Options
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.add('hidden');
            }
        });
        
        // Connect Language Options
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = opt.getAttribute('data-lang');
                console.log(`Language selected: ${selectedLang}`);
                applyTranslations(selectedLang);
                langDropdown.classList.add('hidden');
            });
        });
    }
    
    // 13. Skip Video Button Event Handler
    const skipBtn = document.getElementById('skip-video-btn');
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerUserGesture();
            if (cities[currentCity].useGhibliSlideshow) {
                skipGhibliSlide();
            } else {
                playNextMainVideo();
            }
        });
    }

    // 14. Sleep Timer Toggle & Options Handlers
    const timerBtn = document.getElementById('timer-btn');
    const timerDropdown = document.getElementById('timer-dropdown');
    if (timerBtn && timerDropdown) {
        timerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            timerDropdown.classList.toggle('hidden');
            // Close language dropdown if open
            const langDropdown = document.getElementById('lang-dropdown');
            if (langDropdown) langDropdown.classList.add('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!timerBtn.contains(e.target) && !timerDropdown.contains(e.target)) {
                timerDropdown.classList.add('hidden');
            }
        });
        
        // Connect Options
        timerDropdown.querySelectorAll('.timer-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerUserGesture();
                const minutes = parseInt(opt.getAttribute('data-time'));
                console.log(`Sleep timer set to: ${minutes} minutes`);
                startSleepTimer(minutes);
                timerDropdown.classList.add('hidden');
            });
        });

        // Custom timer button handler
        const customStartBtn = document.getElementById('custom-timer-start-btn');
        const customMinInput = document.getElementById('custom-timer-min');
        if (customStartBtn && customMinInput) {
            customStartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerUserGesture();
                const val = parseInt(customMinInput.value);
                if (val > 0) {
                    console.log(`Sleep timer set to custom time: ${val} minutes`);
                    startSleepTimer(val);
                    timerDropdown.classList.add('hidden');
                    customMinInput.value = '';
                } else {
                    const savedLang = localStorage.getItem('aw-lang') || 'ko';
                    alert(savedLang === 'ko' ? '올바른 시간을 입력해 주세요.' : (savedLang === 'ja' ? '正しい時間を入力してください。' : 'Please enter a valid duration.'));
                }
            });
        }
    }

    // 15. Sleep Overlay Wake Up handler
    const sleepWakeBtn = document.getElementById('sleep-wake-btn');
    if (sleepWakeBtn) {
        sleepWakeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wakeUp();
        });
    }

    // Apply initial language translation on start
    const initialLang = localStorage.getItem('aw-lang') || 'ko';
    applyTranslations(initialLang);
});

// Load the YouTube API script asynchronously *after* declaring our callbacks to prevent race conditions
if (window.YT && window.YT.Player) {
    console.log('YouTube API was already loaded. Initializing immediately.');
    window.onYouTubeIframeAPIReady();
} else {
    console.log('Injecting YouTube Iframe API Script...');
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        document.head.appendChild(tag);
    }
}
