// 전역 변수
var cardlistHTML = document.getElementById('cardlist');
var txt, card_img_src;
var deckHTML = document.getElementById('deck');
var list_counter = 0;
var total_images = 100;
var tn = "null";
var pn = "null";

const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById("close-modal");

const title_name = document.getElementById('title_name');
const product_name = document.getElementById('product_name');
const product_option = {
    null: [
        { value: "null", text: "-- 選択なし --" }
    ],
    oshinoko: [
        { value: "osk-pr", text: "PRカード" },
        { value: "osk-trial", text: "トライアルデッキ" },
        { value: "osk-booster", text: "ブースターパック" },
        { value: "osk-booster2", text: "ブースターパック Vol.2" }
    ],
    test: [
        { value: "test1", text: "test111" },
        { value: "test2", text: "test222" },
        { value: "test3", text: "test333" },
        { value: "test4", text: "test444" },
        { value: "test5", text: "test555" },
        { value: "test6", text: "test666" },
        { value: "test7", text: "test777" }
    ]
};

async function loadImages() {
    //var image_exists = true; // 이미지 존재 여부 체크
    list_counter = 0; // 로드된 이미지 개수 초기화

    cardlistHTML.innerHTML = ""; // 기존 카드 리스트 초기화

    const imagePromises = [];
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= total_images; i++) {
        const imgSrc = `./title/${tn}/images/${pn}/${i}.png`;
        const imgElement = document.createElement("img");

        imgElement.classList.add("listcard");
        imgElement.setAttribute("alt", i);
        imgElement.setAttribute("value", i);
        imgElement.setAttribute("data-src", imgSrc); // Lazy Loading 적용 (초기 로드 X)
        imgElement.style.opacity = "0"; // 처음에는 숨김 (애니메이션 효과)

        // 프리로드 및 존재 여부 확인 후 로드
        let promise = new Promise(resolve => {
            const preloadImage = new Image();
            preloadImage.src = imgSrc;

            preloadImage.onload = () => {
                imgElement.src = imgSrc;
                list_counter++;
                imgElement.style.opacity = "1"; // 이미지 로딩 후 나타나도록 애니메이션 효과
                resolve();
            };

            preloadImage.onerror = () => {
                imgElement.src = `./title/${tn}/images/${pn}/400x559.png`; // 기본 이미지 설정
                resolve();
            };
        });

        imagePromises.push(promise);

        const tdElement = document.createElement("td");
        tdElement.classList.add("td_width");
        tdElement.appendChild(imgElement);
        fragment.appendChild(tdElement);
    }

    await Promise.all(imagePromises); // 모든 이미지 병렬 로딩 완료 후 UI 업데이트
    cardlistHTML.appendChild(fragment);

    // 카드 리스트 표시
    if(tn === "oshinoko" && pn === "osk-booster2"){ // 신작UI따로 표시
        write_cardlist_new();
    }
    else{
        write_cardlist();
    }
    lazyLoadImages();
    // 카드이미지 클릭시 확대
    function expansion(src){
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        var BI = document.getElementById('big_image');
        BI.innerHTML = `<img src="${src}" style="width: 400px;" />`;
    }
    $("img").click(function() {
        const excludedImages = [
            `file:///D:/wstcg-cardlist/title/${tn}/images/${pn}/400x559.png`
        ];
        if (!excludedImages.includes(this.src)) { 
            expansion(this.src); // 제외할 이미지가 아닌 경우 실행
        }
    });    
}
loadImages(); // 실행
write_deck();

// 타이틀, 상품 선택에따라 그에 해당하는 카드리스트 표시
function write_cardlist() {
    card_img_src = "./title/" + tn + "/images/" + pn + "/";
    let lc = total_images % 10;
    
    let txt = `<h1 class="text_center">カードリスト</h1>`;
    txt += `<table class="center">`;
    for (let i = 1; i <= (total_images/10)+1; i++) {
        txt += `<tr>`;
        for (let j = (i - 1) * 10 + 1; j <= i * 10; j++) {
            if(j > total_images) break;
            txt += `
                <td class="td_width">
                    <img class="listcard" id="card${j}" src="` + card_img_src + `${j}.png" 
                         alt="${j}" value="${j}"
                         onerror="this.onerror=null; this.src='${card_img_src}400x559.png';" />
                </td>`;
        }
        txt += `</tr>`;
    }
    txt += `</table>`;
    cardlistHTML.innerHTML = txt;
}

function write_cardlist_new() {
    card_img_src = "./title/" + tn + "/images/" + pn + "/";
    let lc = total_images % 10;
    
    let txt = `<h1 class="text_center">カードリスト ${list_counter}/100</h1>`;
    txt += `<table class="center">`;
    for (let i = 1; i <= (total_images/10)+1; i++) {
        txt += `<tr>`;
        for (let j = (i - 1) * 10 + 1; j <= i * 10; j++) {
            if(j > total_images) break;
            txt += `
                <td class="td_width">
                    <img class="listcard" id="card${j}" src="` + card_img_src + `${j}.png" 
                         alt="${j}" value="${j}" style="border:solid 1px black;"
                         onerror="this.onerror=null; this.src='${card_img_src}400x559.png';" />
                </td>`;
        }
        txt += `</tr>`;
    }
    txt += `</table>`;
    cardlistHTML.innerHTML = txt;
}

// 덱레시피 공간확보 HTML작성
function write_deck(){
    card_img_src = "./title/" + tn + "/images/" + pn + "/";

    let txt = `<h1 class="text_center">デッキレシピー</h1>`;
    txt += `<table class="center">`;
    for(let i = 1; i <= 5; i++){
        txt += `<tr>`;
        for(let j = (i-1)*10+1; j <= i*10 ; j++){
            txt += `<td class="td_width" id="td_deck` + j + `"><img class="deckcard" id="deck` + j + `" src="` + card_img_src + `400x559.png" alt="no image" onclick="expansion(` + j + `)" style="border:solid 1px black;" /></td>`;
        }
        txt += `</tr>`;
    }
    txt += `</table>`;
    deckHTML.innerHTML = txt;
}

// 모달창 닫기
closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // 스크롤바 보이기
});

// 모달창 외부 클릭시 닫기
window.addEventListener('click', (e) => {
    if(e.target === modal){
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    } else {
        false;
    }
});

// 네오스탠구분 리스트박스
title_name.addEventListener('change', function() {
    product_name.innerHTML = ""; // 기존에 추가된 모든 <option> 요소 삭제
    tn = title_name.value; // 타이틀명 변수저장
    let lastOptionElement = null; // 마지막 option 요소를 저장할 변수

    const selected_title_name = title_name.value;
    product_option[selected_title_name].forEach(item => {
        const optionElement = document.createElement('option');
        optionElement.value = item.value;
        optionElement.text = item.text;
        product_name.appendChild(optionElement);
        lastOptionElement = optionElement; // 마지막으로 추가된 옵션을 저장
    });

    // 마지막 옵션을 선택
    if (lastOptionElement) {
        lastOptionElement.selected = true;
    }

    pn = product_name.value; // 상품명 변수저장
    loadImages();
});

product_name.addEventListener('change', function() {
    pn = product_name.value; // 상품명 변수저장
    loadImages();
})

// Drag & Drop 기능 추가
document.addEventListener("DOMContentLoaded", function() {
    // 리스트 카드에서 드래그 시작
    document.addEventListener("dragstart", function(event) {
        if (event.target.classList.contains("listcard")) {
            event.dataTransfer.setData("text/plain", event.target.src); // 카드 이미지 URL 저장
            event.dataTransfer.setData("card-value", event.target.getAttribute("value")); // 카드 번호 저장
        }
    });

    // 덱 카드에서 드래그 허용
    document.addEventListener("dragover", function(event) {
        if (event.target.classList.contains("deckcard")) {
            event.preventDefault(); // 기본 동작 방지
        }
    });

    // 덱 카드에서 드롭 이벤트 처리
    document.addEventListener("drop", function(event) {
        if (event.target.classList.contains("deckcard")) {
            event.preventDefault();
            const droppedCardSrc = event.dataTransfer.getData("text/plain"); // 드래그된 이미지 URL
            const droppedCardValue = event.dataTransfer.getData("card-value"); // 카드 번호

            // 덱의 비어있는 위치 찾기 (기본 이미지인지 확인)
            if (event.target.src.includes("400x559.png")) {
                event.target.src = droppedCardSrc; // 새로운 이미지로 변경
                event.target.setAttribute("value", droppedCardValue); // 카드 번호 저장
            }
            setTimeout(() => {
                sortDeck(); // 정렬 후 저장
                saveDeckState();
            }, 100);
        }
    });
});

document.addEventListener("contextmenu", function(event) {
    // 리스트 카드에서 우클릭하면 덱의 맨 앞 빈 칸에 추가
    if (event.target.classList.contains("listcard")) {
        event.preventDefault(); // 기본 우클릭 메뉴 방지

        const cardSrc = event.target.src; // 선택된 카드 이미지 URL
        const cardValue = event.target.getAttribute("value"); // 카드 번호

        // 덱의 가장 앞 빈 슬롯 찾기
        const deckCards = document.querySelectorAll(".deckcard");
        for (let i = 0; i < deckCards.length; i++) {
            if (deckCards[i].src.includes("400x559.png")) { // 빈 슬롯이면
                deckCards[i].src = cardSrc; // 이미지 변경
                deckCards[i].setAttribute("value", cardValue); // 카드 번호 저장
                setTimeout(() => {
                    sortDeck();
                    saveDeckState();
                }, 100);
                break; // 한 개만 추가 후 종료
            }
        }
    }
    // 덱 카드에서 우클릭(컨텍스트 메뉴) 이벤트로 기본 이미지로 되돌리기
    if (event.target.classList.contains("deckcard")) {
        event.preventDefault(); // 기본 우클릭 메뉴 방지
        event.target.src = `./title/${tn}/images/${pn}/400x559.png`; // 기본 이미지로 변경
        event.target.removeAttribute("value"); // 카드 번호 속성 제거
        setTimeout(() => {
            sortDeck();
            saveDeckState();
        }, 100);
    }
});

// 덱 정렬 함수: 빈 칸(기본 이미지)을 뒤로 밀고, 추가한 카드를 앞으로 정렬
function sortDeck() {
    const deckCards = Array.from(document.querySelectorAll(".deckcard"));
    const card_img_src = `./title/${tn}/images/${pn}/400x559.png`;

    // 현재 덱의 이미지 배열을 가져와서 정렬
    let sortedDeck = deckCards
        .map(card => card.src) // 카드 이미지 리스트 가져오기
        .filter(src => !src.includes("400x559.png")) // 기본 이미지 제외 (추가한 카드만 남김)
        .concat(Array(deckCards.length).fill(card_img_src)) // 빈 슬롯을 뒤에 채우기
        .slice(0, deckCards.length); // 덱 크기 유지

    // 정렬된 순서로 덱 업데이트
    deckCards.forEach((card, index) => {
        card.src = sortedDeck[index];
    });
    saveDeckState(); // 덱 정렬 후 자동 저장
}

// 로컬 스토리지에 덱 상태 저장
function saveDeckState() {
    const deckCards = document.querySelectorAll(".deckcard");
    const deckState = Array.from(deckCards).map(card => card.src); // 현재 덱의 이미지 저장
    localStorage.setItem("deckState", JSON.stringify(deckState)); // 로컬 스토리지에 저장
}

// 로컬 스토리지에서 덱 상태 불러오기
function loadDeckState() {
    const deckCards = document.querySelectorAll(".deckcard");
    const storedDeck = JSON.parse(localStorage.getItem("deckState"));

    if (storedDeck) {
        deckCards.forEach((card, index) => {
            if (storedDeck[index]) {
                card.src = storedDeck[index]; // 저장된 이미지 적용
            }
        });
    }
}

// 페이지 로드 시 덱 상태 복원
window.addEventListener("load", loadDeckState);

// Lazy loading 방식 : 화면에 나타난 이미지만 우선 로드함
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll("img.listcard[data-src]");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute("data-src");
                img.removeAttribute("data-src");
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}
