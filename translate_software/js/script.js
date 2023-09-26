
const fromText = document.querySelector(".from-text");
// tìm thẻ select
const selectTag = document.querySelectorAll("select");
// console.log(selectTag);
toText = document.querySelector(".to-text"),
exchageIcon = document.querySelector(".exchange"),
icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("button"),

selectTag.forEach((tag, id) => {
    for(const country_code in countries){
        // selecting English by default as from language and vietnam as To language
        let selected;
        if(id == 0 && country_code == "en-GB"){
            selected = "selected";
        }
        else if (id == 1 && country_code == "vi-VN"){
            selected = "selected";
        }
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
    // for (let country_code in countries) {
    //     let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "vi-VN" ? "selected" : "";
    //     let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    //     tag.insertAdjacentHTML("beforeend", option);
    // }
});
// chagne value
exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,  
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        console.log(data);
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});
fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

// âm thanh 
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});