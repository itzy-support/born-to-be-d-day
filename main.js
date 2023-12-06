const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const setNextRelease = async () => {
  const trackElement = document.getElementById("track");
  const memberElement = document.getElementById("member");
  const contentElement = document.getElementById("content");
  const dateElement = document.getElementById("date");

  const timeTable = await getTimeTable();
  const now = dayjs().utc();
  const releaseDays = Object.keys(timeTable);

  const nextReleaseDate = releaseDays.find((date) => now.isBefore(dayjs.utc(date)));

  if (!nextReleaseDate) {
    trackElement.textContent = "BORN TO BE has been released!! 🎉";
    memberElement.src = "./images/lia.webp";
    contentElement.textContent = "ITZY, MIDZY, Let's Fly!";
    dateElement.textContent = "2024-01-08 6PM KST";

    document.getElementById("d-day").textContent = "0";
    document.getElementById("hour-1").textContent = "0";
    document.getElementById("hour-2").textContent = "0";
    document.getElementById("minute-1").textContent = "0";
    document.getElementById("minute-2").textContent = "0";
    document.getElementById("second-1").textContent = "0";
    document.getElementById("second-2").textContent = "0";
    return;
  }

  const { track, member, content } = timeTable[nextReleaseDate];
  trackElement.textContent = track;
  memberElement.src = memberUrl(member);
  contentElement.textContent = `${member} ${content}`;
  dateElement.textContent = `${formatTimezone(nextReleaseDate)} (${TIMEZONE})`;

  setTimer(now, nextReleaseDate);
  const timer = setInterval(async () => {
    const realTime = dayjs.utc();
    if (!realTime.isBefore(dayjs.utc(nextReleaseDate))) {
      clearInterval(timer);
      await setNextRelease();
      await setModalTimeline();
      return;
    }

    setTimer(dayjs.utc(), nextReleaseDate);
  }, 1000);
};

const getTimeTable = async () => (await fetch("./time-table.json")).json();

const memberUrl = (member) => {
  switch (member) {
    case "YEJI":
      return "./images/yeji.webp";
    case "LIA":
      return "./images/lia.webp";
    case "RYUJIN":
      return "./images/ryujin.webp";
    case "CHAERYEONG":
      return "./images/chaeryeong.webp";
    case "YUNA":
      return "./images/yuna.webp";
    default:
      return "./images/itzy.webp";
  }
};

const setTimer = (now, nextReleaseDate) => {
  const date = document.getElementById("d-day");
  const hour1 = document.getElementById("hour-1");
  const hour2 = document.getElementById("hour-2");
  const minute1 = document.getElementById("minute-1");
  const minute2 = document.getElementById("minute-2");
  const second1 = document.getElementById("second-1");
  const second2 = document.getElementById("second-2");

  const diffMilliseconds = dayjs.utc(nextReleaseDate).diff(dayjs.utc(now));

  const days = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
  const hour = formatTime(Math.floor((diffMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minute = formatTime(Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)));
  const second = formatTime(Math.floor((diffMilliseconds % (1000 * 60)) / 1000));

  date.textContent = days;
  hour1.textContent = hour[0];
  hour2.textContent = hour[1];
  minute1.textContent = minute[0];
  minute2.textContent = minute[1];
  second1.textContent = second[0];
  second2.textContent = second[1];
};

const formatTime = (time) => String(time).padStart(2, "0");

setNextRelease();

const setModalTimeline = async () => {
  const timeline = document.getElementById("timeline");
  timeline.replaceChildren();

  const timeTable = await getTimeTable();
  const releaseDays = Object.keys(timeTable);

  releaseDays.forEach((date) => {
    const { track, content, member } = timeTable[date];

    const item = document.createElement("li");
    item.className = "modal-timeline-item";

    const now = dayjs.utc();
    const nextReleaseDate = releaseDays.find((date) => now.isBefore(dayjs.utc(date)));

    const stateElement = document.createElement("span");
    if (date === nextReleaseDate) {
      stateElement.textContent = "🔜";
    } else if (now.isBefore(dayjs.utc(date))) {
      stateElement.textContent = "🔳";
    } else {
      stateElement.textContent = "✅";
    }

    const dateElement = document.createElement("span");
    dateElement.classList.add("modal-timeline-item__date", "medium-opacity");
    dateElement.textContent = formatTimezone(date);

    const trackElement = document.createElement("span");
    trackElement.classList.add("modal-timeline-item__track", "text-primary");
    trackElement.textContent = track;

    const memberElement = document.createElement("span");
    memberElement.classList.add("modal-timeline-item__member", "medium-opacity");
    memberElement.textContent = member;

    const infoElement = document.createElement("div");
    infoElement.className = "modal-timeline-item__info";
    infoElement.append(trackElement, memberElement, content);

    const contentElement = document.createElement("div");
    contentElement.className = "modal-timeline-item__content";
    contentElement.append(dateElement, infoElement);

    item.append(stateElement, contentElement);

    const divider = document.createElement("div");
    divider.className = "divider modal-timeline-item__divider";

    timeline.append(item, divider);
  });
};

const formatTimezone = (date) => {
  return dayjs.utc(date).local().format("YYYY-MM-DD hA").replace("12AM", "0AM");
};

setModalTimeline();

const openModalHandler = () => {
  const modalWrapper = document.getElementById("modal-wrapper");
  const modal = document.getElementById("modal");

  modalWrapper.classList.add("open");
  modal.classList.add("open");
};

const closeModalHandler = ({ target: { id } }) => {
  if (id !== "modal-wrapper" && id !== "modal-close") return;

  const modalWrapper = document.getElementById("modal-wrapper");
  const modal = document.getElementById("modal");

  modalWrapper.classList.add("close");
  modal.classList.add("close");

  setTimeout(() => {
    modalWrapper.classList.remove("open");
    modalWrapper.classList.remove("close");
    modal.classList.remove("open");
    modal.classList.remove("close");
  }, 300);
};
