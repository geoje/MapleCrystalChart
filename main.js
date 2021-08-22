function Main() {
  // 차트 세팅
  SetChartFromDateJson();

  // 크기 버튼
  SetSwitchEvent(
    "size",
    () => {},
    () => {}
  );

  // 묶음 버튼
  SetSwitchEvent(
    "tie",
    () => {},
    () => {}
  );
}

function SetChartFromDateJson() {
  fetch("data.json")
    .then((res) => res.json())
    .then((arr) => data.forEach((e) => {}));
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
function CreateChartSection() {}

Main();
