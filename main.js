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
  // 목요일 30개 넣기
  let thursday = new Date(),
    labels = [];
  if (thursday.getDay() > 4) thursday.setDate(thursday.getDate() - thursday.getDay());
  else if (thursday.getDay() < 4) thursday.setDate(thursday.getDate() - thursday.getDay() - 3);

  while (labels.length < 30) {
    labels.push(
      `${thursday.getMonth() < 9 ? "0" : ""}${thursday.getMonth() + 1}/${
        thursday.getDate() < 10 ? "0" : ""
      }${thursday.getDate()}`
    );
    thursday.setDate(thursday.getDate() - 7);
  }
  labels.reverse();

  // 데이터 받아오기
  fetch("data.json")
    .then((res) => res.json())
    .then((date, idx) => {
      date.forEach((infos, idx) => {
        // 본문에 기간별 추가
        const dateElement = document.createElement("h1");
        dateElement.innerText = ["일간 보스", "주간 보스", "월간 보스"][idx];
        dateElement.id = ["daily", "weekly", "monthly"][idx];
        dateElement.classList.add("box");
        section.appendChild(dateElement);

        // 보스 정보 추가
        infos.forEach((info) => {
          const newCard = card.cloneNode(true);
          const title = newCard.querySelector(".card-title");

          const img = newCard.querySelector("img");
          const h = newCard.querySelector("h1");
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

          let backgroundColor, borderColor;
          if (cur < last) {
            title.classList.add("lower");
            changeStrArr.splice(0, 0, "▼");
            backgroundColor = "rgba(52, 152, 219, 0.2)";
            borderColor = "rgb(52, 152, 219)";
          } else if (cur > last) {
            title.classList.add("upper");
            changeStrArr.splice(0, 0, "▲");
            backgroundColor = "rgba(231, 76, 60, 0.2)";
            borderColor = "rgb(231, 76, 60)";
          }
          l.innerText = changeStrArr.join(" ");

          // 차트 추가
          thursday.setDate(thursday.getDate() - 7 * info.data.length);
          new Chart(canvas.getContext("2d"), {
            type: "line",
            data: {
              labels: labels.slice(labels.length - info.data.length),
              datasets: [
                {
                  label: info.name[0],
                  data: info.data,
                  ...backgroundColor,
                  ...borderColor,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,

              elements: {
                point: {
                  radius: 0,
                },
              },
              scales: {
                x: {
                  grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                  },
                },
                y: {
                  grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                  },
                  beginAtZero: true,
                },
              },
              interaction: {
                mode: "index",
                intersect: false,
              },
            },
          });

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
