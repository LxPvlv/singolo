//navigation
(function(selector) {
  const onScroll = (() => {
    let isEnabled = true;
    let finalize = false;

    const seekActive = () => {
      const links = document.querySelectorAll(`${selector} a`);
      const ids = [...links].map(a => a.getAttribute("href"));
      const sections = document.querySelectorAll(ids.join());
      const headerHeight = document
        .querySelector("header")
        .getBoundingClientRect().height;

      let activeId = [...sections].findIndex(section => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= headerHeight && bottom > headerHeight;
      });

      if (innerHeight + pageYOffset >= document.body.scrollHeight) {
        activeId = sections.length - 1;
      }

      links.forEach(node => node.parentElement.classList.remove("active"));

      links[activeId].parentElement.classList.add("active");
    };

    return () => {
      if (isEnabled) {
        seekActive();
        isEnabled = false;
        setTimeout(() => {
          isEnabled = true;
          if (finalize) seekActive();
        }, 100);
      } else {
        finalize = true;
      }
    };
  })();
  document.addEventListener("scroll", onScroll);

  document.querySelector(selector).addEventListener("click", evt => {
    const target = evt.target;
    if (target.tagName !== "A") return;

    [...evt.currentTarget.children].forEach(node =>
      node.classList.remove("active")
    );

    target.parentElement.classList.add("active");

    document.querySelector(".menu").classList.remove("open");
    document.querySelector(".burger-btn").classList.remove("active");

    document.removeEventListener("scroll", onScroll);

    let { scrollTop: lastScroll } = document.documentElement;
    const interval = setInterval(() => {
      let { scrollTop: currentScroll } = document.documentElement;
      if (lastScroll === currentScroll) {
        document.addEventListener("scroll", onScroll);
        onScroll();
        clearInterval(interval);
      }
      lastScroll = currentScroll;
    }, 100);
  });
})("#header-navigation");

// burger menu
document.querySelector(".burger-btn").addEventListener("click", evt => {
  const currentTarget = evt.currentTarget;
  currentTarget.classList.toggle("active");
  currentTarget.parentElement.querySelector(".menu").classList.toggle("open");
});

// backdrop click
document.querySelector("#backdrop").addEventListener("click", evt => {
  document.querySelector(".menu").classList.remove("open");
  document.querySelector(".burger-btn").classList.remove("active");
});

//slider
(function(selector) {
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
      const slides = slider.querySelector(".slides-container").children;

      [...slides].reduce((list, node) => list.add(node), this);
      this.head = this.head.next;

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
      const leftRight = { prev: "left", next: "right" }[direction];

      this.isAnimated = true;

      let from = this.head.slide;
      let to = this.head[direction].slide;
      from.classList.add("active-slide", `move-${direction}`);
      to.classList.add("next-slide", `move-${direction}`);
      to.style[leftRight] = "-100%";
      this.slider.style.backgroundColor = to.dataset.bgcolor;
      this.slider.style.borderBottomColor = to.dataset.bbcolor;
      to.addEventListener(
        "animationend",
        evt => {
          this.isAnimated = false;
          from.classList.remove("active-slide", `move-${direction}`);
          to.classList.remove("next-slide", `move-${direction}`);
          to.classList.add("active-slide");
          to.style[leftRight] = "";
          this.head = this.head[direction];
        },
        { once: true }
      );
    }
  }

  const slider = document.querySelector(selector);

  const list = new SlidesList(slider);

  slider.addEventListener("click", evt => {
    list.move(evt.target.dataset.direction);
  });

  //btn-power
  window.addEventListener("load", () => {
    var phonesObject = document.querySelectorAll(".slider-phone");
    phonesObject.forEach(phone => {
      const svgDocument = phone.contentDocument;
      var btnPower = svgDocument.querySelector("#btn-power");
      btnPower.addEventListener("click", evt => {
        const screen = svgDocument.querySelector("#phone-screen");
        screen.classList.toggle("onOff");
      });
    });
  });
})("#slider");

//portfolio
(function(selector) {
  const portfolio = document.querySelector("#portfolio");
  const filterBtns = portfolio.querySelector(".portfolio-filter");
  const portfolioList = portfolio.querySelector(".portfolio-list");
  let isAnimated = false;

  filterBtns.addEventListener("click", evt => {
    if (isAnimated) return;
    const target = evt.target;
    if (target.tagName !== "BUTTON") return;
    if (target.classList.contains("active")) return;

    [...filterBtns.children].forEach(btn => btn.classList.remove("active"));
    target.classList.add("active");

    const visibleItems = [...portfolioList.children].filter(
      item => item.offsetParent !== null
    );
    const newItems = visibleItems.map(item => item.firstChild);
    newItems.unshift(newItems.pop());

    let count = newItems.length;
    isAnimated = true;
    filterBtns.classList.add("animated");
    visibleItems.forEach((item, i) => {
      item.classList.remove("portfolio-selected-item");
      const empty = document.createElement("div");
      item.append(empty);
      const newImg = newItems[i];
      item.append(newImg);
      empty.classList.add("animate-from");
      newImg.classList.add("animate-to");
      newImg.addEventListener("animationend", evt => {
        newImg.classList.remove("animate-to");
        empty.remove();
        if (!--count) {
          isAnimated = false;
          filterBtns.classList.remove("animated");
        }
      });
    });
  });

  portfolioList.addEventListener("click", evt => {
    const target = evt.target;
    if (target.tagName !== "IMG") return;

    [...portfolioList.children].forEach(item =>
      item.classList.remove("portfolio-selected-item")
    );
    target.parentElement.classList.add("portfolio-selected-item");
  });
})("#portfolio");

//quote
(function(selector) {
  const quote = document.querySelector(selector);
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
})("#quote");
