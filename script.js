const headerNavigation = document.querySelector("#header-navigation");

headerNavigation.addEventListener("click", evt => {
  const target = evt.target;
  if (target.tagName !== "A") return;

  evt.preventDefault();

  [...evt.currentTarget.children].forEach(node =>
    node.classList.remove("active")
  );

  target.parentElement.classList.add("active");

  const destination = document.querySelector(target.getAttribute("href"));
  destination &&
    destination.scrollIntoView({
      behavior: "smooth"
    });
});

// Slider
const slider = document.querySelector("#slider");
const duration = getComputedStyle(slider).transitionDuration;
const slidesContainer = slider.querySelector(".slides-container");
let elementSource = slidesContainer.firstElementChild;
let elementDestination = slidesContainer.lastElementChild;
let isAnimated = false;

slider.addEventListener("click", evt => {
  const target = evt.target;
  const { direction } = target.dataset;
  if (!direction) return;
  if (isAnimated) return;

  switch (direction) {
    case "next":
      slidesContainer.append(elementDestination);
      slidesContainer.style.transition = `transform ${duration}`;
      slidesContainer.style.transform = "translateX(-100%)";
      break;
    case "prev":
      requestAnimationFrame(() => {
        slidesContainer.prepend(elementDestination);
        slidesContainer.style.transform = "translateX(-100%)";
        requestAnimationFrame(() => {
          slidesContainer.style.transition = `transform ${duration}`;
          slidesContainer.style.transform = "translateX(0%)";
        });
      });
      break;
  }

  const { bgcolor, bbcolor } = elementDestination.dataset;
  slider.style.backgroundColor = bgcolor;
  slider.style.borderBottomColor = bbcolor;

  isAnimated = true;
  slidesContainer.addEventListener(
    "transitionend",
    evt => {
      isAnimated = false;
      slidesContainer.style.transition = "unset";
      slidesContainer.style.transform = "translateX(0%)";
      slidesContainer.prepend(elementDestination);
      [elementSource, elementDestination] = [elementDestination, elementSource];
    },
    { once: true }
  );
});

//btn-power
const phones = slidesContainer.querySelectorAll(".btn-power");
phones.forEach(phone => {
  phone.addEventListener("click", evt => {
    const screen = evt.target.parentElement.querySelector("[class*=screen]");
    screen.classList.toggle("screen-opacity");
  });
});

//portfolio
const portfolio = document.querySelector("#portfolio");
const filterBtns = portfolio.querySelector(".portfolio-filter");
const portfolioList = portfolio.querySelector(".portfolio-list");

filterBtns.addEventListener("click", evt => {
  const target = evt.target;
  if (target.tagName !== "BUTTON") return;

  [...filterBtns.children].forEach(btn => btn.classList.remove("active"));
  target.classList.add("active");

  portfolioList.prepend(portfolioList.lastElementChild);
});

portfolioList.addEventListener("click", evt => {
  const target = evt.target;
  if (target.tagName !== "IMG") return;

  [...portfolioList.children].forEach(img =>
    img.classList.remove("portfolio-active-item")
  );
  target.classList.add("portfolio-active-item");
});
