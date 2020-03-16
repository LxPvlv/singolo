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

//slider
class Slide {
  constructor(slide) {
    this.slide = slide;
    this.prev = null;
    this.next = null;
  }
}

class SlidesList {
  constructor(slider) {
    this.slider = slider;
    const slidesContainer = slider.querySelector(".slides-container");
    const slides = slidesContainer.children;

    const list = [...slides].reduce((list, node) => list.add(node), this);
    this.head = list.head.next;

    this.dict = {
      next: "right",
      prev: "left"
    }

    this.isAnimated = false;
  }

  add(slide) {
    const newNode = new Slide(slide);

    if (!this.head) {
      this.head = newNode;
      newNode.next = newNode;
      newNode.prev = newNode;
      return this;
    } else {
      const next = this.head.next;
      this.head.next = newNode;
      newNode.prev = this.head;
      newNode.next = next;
      next.prev = newNode;
      this.head = newNode;
      return this;
    }
  }

  move(direction) {
    if (this.isAnimated) return;

    if (!direction) return;
    const offset = this.dict[direction]

    this.isAnimated = true;

    let from = this.head.slide;
    let to = this.head[direction].slide;
    from.classList.add("active-slide", `move-${direction}`);
    to.classList.add("next-slide", `move-${direction}`);
    to.style[offset] = "-100%";
    this.slider.style.backgroundColor = to.dataset.bgcolor;
    this.slider.style.borderBottomColor = to.dataset.bbcolor;
    to.addEventListener(
      "animationend",
      evt => {
        this.isAnimated = false;
        from.classList.remove("active-slide", `move-${direction}`);
        to.classList.remove("next-slide", `move-${direction}`);
        to.classList.add("active-slide");
        to.style[offset] = "";
        this.head = this.head[direction];
      },
      { once: true }
    );
  }
}

const slider = document.querySelector("#slider");

const list = new SlidesList(slider);

slider.addEventListener("click", evt => {
  list.move(evt.target.dataset.direction);
});

//btn-power
const slidesContainer = slider.querySelector(".slides-container");
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

//quote
const quote = document.querySelector("#quote");
const form = quote.querySelector("form");
const modal = quote.querySelector(".modal-container");
const btnOK = modal.querySelector(".btn-ok");

form.addEventListener("submit", evt => {
  evt.preventDefault();

  const { subject, description } = form.elements;

  const body = document.body;
  body.style.height = "100vh";
  body.style.overflow = "hidden";
  modal.style.display = "flex";

  const theme = modal.querySelector(".theme");
  const desc = modal.querySelector(".desc");
  theme.innerHTML = subject.value
    ? `<b>Тема:</b> ${subject.value}`
    : "Без темы";
  desc.innerHTML = description.value
    ? `<b>Описание:</b> ${description.value}`
    : "Без описания";

  form.reset();
});

btnOK.addEventListener("click", evt => {
  const body = document.body;
  body.style.height = "auto";
  body.style.overflow = "auto";
  modal.style.display = "none";
});
