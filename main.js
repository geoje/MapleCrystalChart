const body = document.querySelector("body");
const sections = document.querySelectorAll("body > section");
const headers = document.querySelectorAll("body > h1");
let cardTemplate;
let cards = [[], [], []];
let charts = {
  single: [[], [], []],
  group: [[], [], []],
};

function Main() {
  // 템플릿 세팅
  cardTemplate = CreateCardElement();

  // 차트 세팅
  SetChartFromDateJson();

  // 묶음 버튼
  SetSwitchEvent(
    "tie",
    () => {
      body.classList.remove("group");
      charts.single.forEach((set) =>
        set.forEach((chart) => {
          chart.resize(chart.width, 110);
        })
      );
    },
    () => {
      body.classList.add("group");
      charts.group.forEach((set) =>
        set.forEach((chart) => {
          chart.resize(chart.width, 400);
        })
      );
    }
  );

  // 정렬 버튼
  SetSwitchEvent(
    "order",
    () => {
      body.classList.remove("desc");
      cards.forEach((set) => set.forEach((card) => card.removeAttribute("style")));
    },
    () => {
      body.classList.add("desc");
      cards.forEach((set) => {
        set.forEach((card, j) => {
          card.style.order = set.length - j;
        });
      });
    }
  );

  // 숨기기 버튼
  SetSwitchEvent(
    "tile",
    () => {
      body.classList.remove("card-title-hide");
      charts.single.forEach((set) =>
        set.forEach((chart) => {
          if (!isMobile()) chart.resize(chart.width - 300, chart.height);
        })
      );
      for (type in charts)
        charts[type].forEach((set) =>
          set.forEach((chart) => {
            chart.options.plugins.legend.display = false;
            chart.update();
          })
        );
    },
    () => {
      body.classList.add("card-title-hide");
      for (type in charts)
        charts[type].forEach((set) =>
          set.forEach((chart) => {
            chart.options.plugins.legend.display = true;
            chart.update();
          })
        );
    }
  );
}

function isMobile() {
  return window.screen.width <= 800;
}
function NumberToCommasStr(num) {
  let str = String(num);
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(str)) str = str.replace(rgx, "$1,$2");
  return str;
}
function CreateCardElement() {
  const card = document.createElement("div");
  const cardTitle = document.createElement("div");
  const cardChart = document.createElement("div");

  card.classList.add("card");
  cardTitle.classList.add("box");
  cardChart.classList.add("box");
  cardTitle.classList.add("card-title");
  cardChart.classList.add("card-chart");

  const titles = [document.createElement("div"), document.createElement("div")];
  titles[0].append(document.createElement("img"), document.createElement("h1"));
  titles[1].append(document.createElement("p"), document.createElement("l"));
  cardTitle.append(titles[0], titles[1]);
  cardChart.append(document.createElement("canvas"));

  card.append(cardTitle, cardChart);

  return card;
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

  // 차트 기본값 세팅
  Chart.defaults.interaction.mode = "index";
  Chart.defaults.interaction.intersect = false;
  Chart.defaults.maintainAspectRatio = false;

  // 데이터 받아오기
  fetch("data.json")
    .then((res) => res.json())
    .then((date) => {
      date.forEach((infos, i) => {
        let groupDatasets = [];

        // 개별 차트 입력
        infos.forEach((info) => {
          const card = cardTemplate.cloneNode(true);
          const title = card.querySelector(".card-title");

          const img = card.querySelector("img");
          const h = card.querySelector("h1");
          const p = card.querySelector("p");
          const l = card.querySelector("l");
          const canvas = card.querySelector("canvas");

          // 정보 입력
          img.src = `image/icon/${info.name[1]}.png`;
          h.innerText = info.name[0];
          p.innerText = NumberToCommasStr(info.data[info.data.length - 1]);

          // 가격 변동 계산
          const last = info.data[info.data.length - 2];
          const cur = info.data[info.data.length - 1];
          let changeStrArr = [NumberToCommasStr(Math.abs(cur - last))];
          changeStrArr.push(`(${Math.round((cur / last - 1) * 10000) / 100}%)`);

          let backgroundColor = "rgba(127, 140, 141, 0.2)";
          let borderColor = "rgb(127, 140, 141)";
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
          const dataset = {
            label: info.name[0],
            data: info.data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          };
          groupDatasets.push(dataset);
          charts.single[i].push(
            new Chart(canvas.getContext("2d"), {
              type: "line",
              data: {
                labels: labels.slice(labels.length - info.data.length),
                datasets: [dataset],
              },
              options: {
                elements: {
                  point: {
                    radius: 0,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
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
              },
            })
          );

          // 본문에 추가
          sections[i].appendChild(card);
          cards[i].push(card);
        });

        let canvasArr = sections[i].querySelectorAll(".group-chart > canvas");
        let datasetsArr = [groupDatasets];
        // 주간일 때 차트 2개로 나누기
        if (i == 1) {
          datasetsArr = [
            groupDatasets.slice(0, groupDatasets.length / 2),
            groupDatasets.slice(groupDatasets.length / 2, groupDatasets.length),
          ];
        }

        // 그룹 차트 입력
        datasetsArr.forEach((datasets, dsIdx) =>
          charts.group[i].push(
            new Chart(canvasArr[dsIdx].getContext("2d"), {
              type: "line",
              data: {
                labels: labels.slice(labels.length - datasets[0].data.length),
                datasets: datasets,
              },
              options: {
                elements: {
                  point: {
                    radius: 0,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
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
              },
            })
          )
        );
      });
    });

  // 모바일 환경 단일 모드 차트 높이 지정
  setTimeout(() => {
    if (body.classList.contains("group") || !isMobile()) return;

    charts.single.forEach((set) =>
      set.forEach((chart) => {
        chart.resize(chart.width, 110);
      })
    );
  }, 1000);
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

// For Light Weight Fonts
function GetAllTextHeader(str = " ") {
  const addStr = (s) => {
    for (let i = 0; i < s.length; i++) if (str.indexOf(s[i]) == -1) str += s[i];
  };

  headers.forEach((e) => addStr(e.innerText));
  cards.forEach((set) => set.forEach((e) => addStr(e.querySelector("h1").innerText)));

  return str;
}
function GetAllTextContent() {
  let str = GetAllTextHeader(" 1234567890,./:-%");

  const addStr = (s) => {
    for (let i = 0; i < s.length; i++) if (str.indexOf(s[i]) == -1) str += s[i];
  };

  document
    .querySelector("header")
    .querySelectorAll("p")
    .forEach((e) => addStr(e.innerText));

  return str;
}

Main();
