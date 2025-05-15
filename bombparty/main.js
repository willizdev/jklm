let CONFIG = {
    min_word_len: 5,
    max_word_len: 10,
    complete_bonus: 1,
    complete_interval: 500,
    complete_delay: 0,
    dictionary_url: ""
}

try {
    let local_config = localStorage.getItem("jklm-cheat-config");
    if (local_config != null) {
        let parsed_config = JSON.parse(local_config);
        CONFIG.min_word_len = parsed_config.min_word_len;
        CONFIG.max_word_len = parsed_config.max_word_len;
        CONFIG.complete_bonus = parsed_config.complete_bonus;
        CONFIG.complete_interval = parsed_config.complete_interval;
        CONFIG.complete_delay = parsed_config.complete_delay;
        CONFIG.dictionary_url = parsed_config.dictionary_url;
    }
} catch(e) {
    alert("JKLM Cheat: Failed to load local config");
    localStorage.removeItem("jklm-cheat-config");
}

const config_save = function() {
    let config_str = JSON.stringify(CONFIG);
    localStorage.setItem("jklm-cheat-config", config_str);
}

let UI_STR = `
<div id="jklmc-ui">
    <div id="jklmc-ui-wrap">
        <h1>JKLM BombParty Cheat 🔧</h1>
        <div class="jklmc-ui-config">
            <p>Minimum Word Length:</p>
            <input type="number" value="${CONFIG.min_word_len}" id="jklmc-inp1">
        </div>
        <div class="jklmc-ui-config">
            <p>Maximum Word Length:</p>
            <input type="number" value="${CONFIG.max_word_len}" id="jklmc-inp2">
        </div>
        <div class="jklmc-ui-config">
            <p>Complete bonus:</p>
            <input type="number" value="${CONFIG.complete_bonus}" id="jklmc-inp3">
        </div>
        <div class="jklmc-ui-config">
            <p>Complete Interval:</p>
            <input type="number" value="${CONFIG.complete_interval}" id="jklmc-inp4">
        </div>
        <div class="jklmc-ui-config">
            <p>Complete delay:</p>
            <input type="number" value="${CONFIG.complete_delay}" id="jklmc-inp5">
        </div>
        <div class="jklmc-ui-config">
            <p>Dictionary URL:</p>
            <input type="text" value="${CONFIG.dictionary_url}" id="jklmc-inp6">
        </div>
        <div id="jklmc-ui-cbtns">
            <span id="jklm-ui-cbtns-r">Revert Changes</span>
            <span id="jklm-ui-cbtns-a">Apply Changes</span>
        </div>
    </div>
    <div id="jklmc-ui-btn">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0"viewBox="0 0 128 128" xml:space="preserve">
            <style>
                .st0 { display: none }
                .st1 { display: inline }
            </style>
            <g fill="white">
                <path d="M33.8 53.3 30 49.5-.1 79.7 30 109.9l3.8-3.8L10 82.3h63.2v-5.2H10l23.8-23.8zm94.1-5.1L97.8 18.1 94 21.9l23.8 23.8h-63v5.2h63L94.1 74.8l3.8 3.8L128 48.5v-.3h-.1z" />
            </g>
        </svg>
    </div>
</div>
`;

let STYLES_STR = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech&display=swap');

#jklmc-ui * {
    font-family: "Share Tech", sans-serif;
     font-weight: 400;
    font-style: normal;
}

#jklmc-ui {
    height: 100vh;
    position: fixed;
    left: -40vw;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
    transition: 0.6s;
}

#jklmc-ui.active {
    left: 0vw;
}

#jklmc-ui.active #jklmc-ui-wrap {
    box-shadow: 10px 0px 10px 1px rgba(0,0,0,0.6);
}

#jklmc-ui-wrap {
    height: 100%;
    width: 40vw;
    background: #202020;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#jklmc-ui-wrap h1 {
    text-align: center;
    font-size: 1.2em;
    margin: 2em 0em;
}

#jklmc-ui-btn {
    height: 3em;
    width: 3em;
    cursor: pointer;
    background: #7855C7;
    display: flex;
    align-items: center;
    justify-content: center;
}

#jklmc-ui-btn svg {
    height: 60%;
    width: auto;
}

.jklmc-ui-config {
    width: 100%;
    height: auto;
    padding: 1em 3em;
    background: #2E2D2D;
    margin-bottom: 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.jklmc-ui-config p {
    margin: 0px 1em 0px 0px;
}

.jklmc-ui-config input {
    background: #202020;
    border: none;
    outline: none;
    color: #ffffff;
    width: 15em;
    padding: 0.5em 1em;
    text-align: center;
}

#jklmc-ui-cbtns {
    width: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    margin-top: 1em;
}

#jklmc-ui-cbtns.active {
    display: flex;
}

#jklmc-ui-cbtns span {
    cursor: pointer;
    padding: 0.5em 1em;
    transition: 0.3s;
}

#jklmc-ui-cbtns span:hover {
    opacity: 0.85;
}

#jklm-ui-cbtns-r {
    background: #FF5A5A;
    margin-right: 1em;
}

#jklm-ui-cbtns-a {
    background: #25AA36;
}
`;

let style = document.createElement('style');
style.innerText = STYLES_STR;
document.head.appendChild(style);

let container = document.createElement('div');
container.innerHTML = UI_STR;
document.body.appendChild(container.firstElementChild);

const ui = document.getElementById("jklmc-ui");
const ui_wrap = document.getElementById("jklmc-ui-wrap");
const ui_btn = document.getElementById("jklmc-ui-btn");

ui_btn.addEventListener("click", function() {
    ui.classList.toggle("active");
});

const inp1 = document.getElementById("jklmc-inp1")
const inp2 = document.getElementById("jklmc-inp2")
const inp3 = document.getElementById("jklmc-inp3")
const inp4 = document.getElementById("jklmc-inp4")
const inp5 = document.getElementById("jklmc-inp5")
const inp6 = document.getElementById("jklmc-inp6")

const same_as_config = function() {
    return parseInt(inp1.value) == CONFIG.min_word_len &&
           parseInt(inp2.value) == CONFIG.max_word_len &&
           parseInt(inp3.value) == CONFIG.complete_bonus &&
           parseInt(inp4.value) == CONFIG.complete_interval &&
           parseInt(inp5.value) == CONFIG.complete_delay &&
           inp6.value == CONFIG.dictionary_url;
}

const cf_btns = document.getElementById("jklmc-ui-cbtns")
const cf_btns_r = document.getElementById("jklm-ui-cbtns-r")
const cf_btns_a = document.getElementById("jklm-ui-cbtns-a")

const listen_config_change = function() {
    if (!same_as_config()) {
        cf_btns.classList.add("active");
    } else {
        cf_btns.classList.remove("active");
    }
}

inp1.addEventListener("input", listen_config_change);
inp2.addEventListener("input", listen_config_change);
inp3.addEventListener("input", listen_config_change);
inp4.addEventListener("input", listen_config_change);
inp5.addEventListener("input", listen_config_change);
inp6.addEventListener("input", listen_config_change);

cf_btns_r.addEventListener("click", function() {
    inp1.value = CONFIG.min_word_len;
    inp2.value = CONFIG.max_word_len;
    inp3.value = CONFIG.complete_bonus;
    inp4.value = CONFIG.complete_interval;
    inp5.value = CONFIG.complete_delay;
    inp6.value = CONFIG.dictionary_url;
    cf_btns.classList.remove("active");
});

cf_btns_a.addEventListener("click", async function() {
    CONFIG.min_word_len = inp1.value;
    CONFIG.max_word_len = inp2.value;
    CONFIG.complete_bonus = inp3.value;
    CONFIG.complete_interval = inp4.value;
    CONFIG.complete_delay = inp5.value;
    CONFIG.dictionary_url = inp6.value;
    config_save();
    cf_btns.classList.remove("active");
    await try_load_dict();
});

let CACHE = {
    dict: null,
    syllable: null,
}

async function fetch_dict(url) {
    url = "https://corsproxy.io/?url=" + encodeURIComponent(url);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
}
  
async function try_load_dict() {
    try {
        CACHE.dict = await fetch_dict(CONFIG.dictionary_url);
    } catch (e) {
        alert("JKLM Cheat: Failed to load dictionary");
    }
}

let join_round = document.querySelector("button.joinRound");
join_round.addEventListener("click", function() {
    CACHE.used_words = [];
});

const send_word = async function() {
    const words = CACHE.dict[CACHE.syllable];
    if (words == null) {
        console.error("Failed to find words with syllable " + syllable);
        return;
    }

    let word_len;
    for (let len in words) {
        try {
            if (parseInt(len) < CONFIG.min_word_len ||
            parseInt(len) > CONFIG.max_word_len) continue;
            word_len = len;
            break;
        } catch (_) {}
    }

    let word_index = 0;
    if (CONFIG.complete_bonus) {
        const bonus_letters =
        milestone.playerStatesByPeerId[selfPeerId].bonusLetters;

        a: for (let i = 0; i < words[word_len].length; i++) {
            let word = words[word_len][i];
            let has_bonus = false;
            b: for (let char of word) {
                if (bonus_letters[char] > 0) {
                    has_bonus = true;
                    break b;
                }
            }
            if (has_bonus) {
                word_index = i;
                break a;
            }
        }
    }

    const word = words[word_len][word_index];
    CACHE.dict[CACHE.syllable][word_len].splice(word_index, 1);

    if (CACHE.dict[CACHE.syllable][word_len].length == 0) {
        delete CACHE.dict[CACHE.syllable][word_len];
    }

    await new Promise((r) => setTimeout(r, CONFIG.complete_delay));

    let buff = new String();
    for (let i = 0; i < word.length; i++) {
        buff += word[i];
        socket.emit("setWord", buff, false);
        await new Promise((r) =>
            setTimeout(
                r, (CONFIG.complete_interval / word.length)
            )
        );
    }

    socket.emit("setWord", buff, true);
}

socket.on("nextTurn", async (playerPeerId, syllable, _) => {
    if (milestone.currentPlayerPeerId !== selfPeerId) return;
    if (CACHE.dict == null) return;
    CACHE.syllable = syllable;
    await send_word();
});

socket.on("failWord", async () => {
    if (milestone.currentPlayerPeerId !== selfPeerId) return;
    if (CACHE.dict == null) return;
    await send_word();
});

await try_load_dict();
