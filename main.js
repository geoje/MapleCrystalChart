const section = document.querySelector("section");
const card = document.querySelector(".card");

function Main() {
  // 차트 세팅
  SetChartFromDateJson();

  // 묶음 버튼
  SetSwitchEvent(
    "tie",
    () => {},
    () => {}
  );

  // 정렬 버튼
  SetSwitchEvent(
    "order",
    () => {},
    () => {}
  );
}

function NumberToCommasStr(num) {
  let str = String(num);
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(str)) str = str.replace(rgx, "$1,$2");
  return str;
}
function SetChartFromDateJson() {
  fetch("data.json")
    .then((res) => res.json())
    .then((date, idx) => {
      date.forEach((infos, idx) => {
        // 본문에 기간별 추가
        const dateElement = document.createElement("h1");
        dateElement.innerText = ["일간 보스", "주간 보스", "월간 보스"][idx];
        dateElement.classList.add("box");
        section.appendChild(dateElement);

        // 보스 정보 추가
        infos.forEach((info) => {
          const newCard = card.cloneNode(true);
          const title = newCard.querySelector(".card-title");

          const img = newCard.querySelector("img");
          const h = newCard.querySelector("h3");
          const p = newCard.querySelector("p");
          const l = newCard.querySelector("l");
          const canvas = newCard.querySelector("canvas");

          // 정보 입력
          newCard.removeAttribute("style");
          img.src = `image/icon/${info.name[1]}.png`;
          h.innerText = info.name[0];
          p.innerText = NumberToCommasStr(info.data[info.data.length - 1]);

          // 가격 변동 계산
          const last = info.data[info.data.length - 2];
          const cur = info.data[info.data.length - 1];
          let changeStrArr = [NumberToCommasStr(Math.abs(cur - last))];
          changeStrArr.push(`(${Math.round((cur / last - 1) * 10000) / 100}%)`);

          if (cur < last) {
            title.classList.add("lower");
            changeStrArr.splice(0, 0, "▼");
          } else if (cur > last) {
            title.classList.add("upper");
            changeStrArr.splice(0, 0, "▲");
          }
          l.innerText = changeStrArr.join(" ");

          // 차트 추가

          // 본문에 추가
          section.appendChild(newCard);
        });
      });
    });
}
function SetSwitchEvent(id, leftEvent, rightEvent) {
  const sw = document.getElementById(id);
  const [left, right] = sw.querySelectorAll("p");

  sw.addEventListener("click", () => {
    if (sw.classList.contains("toggle")) {
      sw.classList.remove("toggle");
      leftEvent();
    } else {
      sw.classList.add("toggle");
      rightEvent();
    }
    const text = left.innerText;
    left.innerText = right.innerText;
    right.innerText = text;
  });
}

Main();
