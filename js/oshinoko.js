// 전역 변수
var cardlistHTML = document.getElementById('cardlist');
var txt;
var deckHTML = document.getElementById('deck');

const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById("close-modal");

var list_counter = 0;

for(let i = 1; i <= 106; i++){
    var img = new Image();
    const promise = new Promise((resolve) => {
        img.addEventListener('load', function(){
            list_counter++;
            resolve();
        });
    });
    img.src = `./images/` + i + `.png`;
    promise.then(() => {
        write_cardlist(); // 카드리스트 작성
        write_deck(); // 덱레시피 작성

        // 카드이미지 클릭시 확대
        function expansion(src){
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
            var BI = document.getElementById('big_image');
            //BI.innerHTML = `<img src="./images/` + num + `.png" alt="` + num + `" style="width: 400px;" />`;
            BI.innerHTML = `<img src="${src}" style="width: 400px;" />`;
        }
        $("img").click(function() {
            expansion(this.src);
        });

        // 덱에 카드 넣기
        $(".listcard").on('contextmenu', (event) => {
            event.preventDefault();
            for(let i = 1; i <= 50; i++){
                if($('#deck' + i).attr('src') == "./images/400x559.png"){
                    var cardnumber = $(event.currentTarget).attr('value');
                    $('#deck' + i).attr('src',`./images/` + cardnumber + `.png`);
                    break;
                }
            }
        });

        // 덱에서 카드 빼기
        $(".deckcard").on('contextmenu', (event) => {
            event.preventDefault();
            $(event.currentTarget).attr('src',"./images/400x559.png");
        });
    })
}


// 카드리스트 HTML 작성
function write_cardlist(){
    txt = `<h1 class="text_center">カードリスト `;
    txt += list_counter;
    txt += `/106</h1>`;
    txt += `<table class="center">`;
    for(let i = 1; i <= 10; i++){
        txt += `<tr>`;
        for(let j = (i-1)*10+1; j <= i*10 ; j++){
            txt += `<td class="td_width"><img class="listcard" id="card` + j + `" src="./images/` + j + `.png" alt="` + j + `" onclick="expansion(` + j + `)" value="` + j + `" /></td>`;
        }
        txt += `</tr>`;
    }
    txt += `<tr>`;
    for(let i = 101; i <= 106 ; i++){
        txt += `<td class="td_width"><img class="listcard" id="card` + i + `" src="./images/` + i + `.png" alt="` + i + `" onclick="expansion(` + i + `)" value="` + i + `" /></td>`;
    }
    txt += `</tr>`;
    txt += `</table>`;
    cardlistHTML.innerHTML = txt;
    txt = "";
}

// 덱레시피 HTML 작성
function write_deck(){
    txt = `<h1 class="text_center">デッキレシピー</h1>`;
    txt += `<table class="center">`;
    for(let i = 1; i <= 5; i++){
        txt += `<tr>`;
        for(let j = (i-1)*10+1; j <= i*10 ; j++){
            txt += `<td class="td_width" id="td_deck` + j + `"><img class="deckcard" id="deck` + j + `" src="./images/400x559.png" alt="no image" onclick="expansion(` + j + `)" style="border:solid 1px black;" /></td>`;
        }
        txt += `</tr>`;
    }
    txt += `</table>`;
    deckHTML.innerHTML = txt;
    txt = "";
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