// localStorage 使用的 key
const STORAGE_KEY = "moodDiaryEntries";

// 預設選中的心情（剛進來還沒選）
let selectedMood = null;

// 頁面載入完成後，綁定事件與載入歷史資料
document.addEventListener("DOMContentLoaded", () => {
    const moodButtons = document.querySelectorAll(".mood-button");
    const saveButton = document.getElementById("save-entry-btn");
    const diaryText = document.getElementById("diary-text");

    // 綁定心情按鈕事件
    moodButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            // 先清除其他按鈕的 selected
            moodButtons.forEach(b => b.classList.remove("selected"));
            // 再把這個按鈕標記為選中
            btn.classList.add("selected");
            selectedMood = btn.dataset.mood;
        });
    });

    // 儲存日記按鈕
    saveButton.addEventListener("click", () => {
        const text = diaryText.value.trim();

        if (!selectedMood) {
            alert("請先選擇今天的心情 🥺");
            return;
        }

        if (!text) {
            alert("請先寫一點日記內容再儲存唷 ✍️");
            return;
        }

        // 取得目前時間
        const now = new Date();
        const entry = {
            id: Date.now(),
            date: now.toLocaleString(), // 例如：2025/12/02 下午 10:30
            mood: selectedMood,
            text: text
        };

        // 存入 localStorage
        const entries = loadEntries();
        entries.unshift(entry); // 新的放最前面
        saveEntries(entries);

        // 清空輸入框
        diaryText.value = "";
        // 也可以取消心情選擇（可選）
        // clearMoodSelection(moodButtons);

        // 重新渲染列表
        renderEntries(entries);
    });

    // 一開始載入時，把 localStorage 裡面的資料畫出來
    const existingEntries = loadEntries();
    renderEntries(existingEntries);
});

// 從 localStorage 讀取資料
function loadEntries() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error("解析 localStorage 失敗，清空資料。", e);
        return [];
    }
}

// 儲存資料到 localStorage
function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// 清掉心情選擇（如果你要用）
function clearMoodSelection(moodButtons) {
    moodButtons.forEach(b => b.classList.remove("selected"));
    selectedMood = null;
}

// 把日記資料渲染到畫面上
function renderEntries(entries) {
    const list = document.getElementById("entries-list");
    list.innerHTML = "";

    if (entries.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "目前還沒有任何日記，從今天開始記錄心情吧 🌱";
        empty.style.fontSize = "0.9rem";
        empty.style.color = "#777";
        list.appendChild(empty);
        return;
    }

    entries.forEach(entry => {
        const card = document.createElement("div");
        card.className = "entry-card";

        const header = document.createElement("div");
        header.className = "entry-header";

        const dateEl = document.createElement("span");
        dateEl.className = "entry-date";
        dateEl.textContent = entry.date;

        const moodEl = document.createElement("span");
        moodEl.className = "entry-mood";
        moodEl.textContent = moodEmoji(entry.mood) + " " + entry.mood;

        header.appendChild(dateEl);
        header.appendChild(moodEl);

        const textEl = document.createElement("div");
        textEl.className = "entry-text";
        textEl.textContent = entry.text;

        card.appendChild(header);
        card.appendChild(textEl);
        list.appendChild(card);
    });
}

// 根據 mood 字串回傳對應 emoji
function moodEmoji(mood) {
    switch (mood) {
        case "Happy":
            return "😊";
        case "Sad":
            return "😢";
        case "Angry":
            return "😡";
        case "Neutral":
            return "😐";
        case "Tired":
            return "😴";
        default:
            return "🙂";
    }
}
