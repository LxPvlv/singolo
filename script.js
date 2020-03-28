const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

//navigation
(function(selector) {
  const links = $$(`${selector} a`);
  const anchors = [...links].map(a => a.getAttribute("href"));
  const sections = $$(anchors.join());
  const menu = $(".menu");
  const burgerBtn = $(".burger-btn");

  const headerHeight = $("header").getBoundingClientRect().height;

  const isDocumentEnd = () =>
    innerHeight + pageYOffset >= document.body.scrollHeight;

  const findIndexActiveSection = sections => {
    return isDocumentEnd()
      ? sections.length - 1
      : [...sections].findIndex(section => {
          const { top, bottom } = section.getBoundingClientRect();
          return top <= headerHeight && bottom > headerHeight;
        });
  };

  const highlightActiveLink = () => {
    let activeId = findIndexActiveSection(sections);

    $("#header-navigation .active").classList.remove("active");

    links[activeId].parentElement.classList.add("active");
  };

  let throttle = false;
  let needFinalization = false;
  const onScroll = () => {
    if (throttle) {
      needFinalization = true;
      return;
    }

    highlightActiveLink();
    throttle = true;
    setTimeout(() => {
      throttle = false;
      if (needFinalization) highlightActiveLink();
    }, 100);
  };

  document.addEventListener("scroll", onScroll);

  //navigation click
  $(selector).addEventListener("click", evt => {
    const target = evt.target;
    if (target.tagName !== "A") return;

    $("#header-navigation .active").classList.remove("active");

    target.parentElement.classList.add("active");

    if (burgerBtn.classList.contains("open")) burgerBtn.click();

    document.removeEventListener("scroll", onScroll);

    //wait stop scroll
    let { scrollTop: lastScroll } = document.documentElement;
    const interval = setInterval(() => {
      let { scrollTop: currentScroll } = document.documentElement;
      if (lastScroll === currentScroll) {
        clearInterval(interval);
        onScroll();
        document.addEventListener("scroll", onScroll);
      }
      lastScroll = currentScroll;
    }, 100);
  });

  // burger menu click
  burgerBtn.addEventListener("click", evt => {
    menu.classList.toggle("translate");
    burgerBtn.classList.toggle("open");
  });

  //mobile menu
  menu.addEventListener("transitionend", evt => {
    const isTranslate = menu.classList.contains("translate");
    const isOpen = menu.classList.contains("open");
    const isClosed = menu.classList.contains("closed");

    if (isTranslate) return;
    if (isOpen) {
      menu.classList.add("translate", "closed");
      menu.classList.remove("open");
    }
    if (isClosed) {
      menu.classList.add("translate", "open");
      menu.classList.remove("closed");
    }
  });

  // backdrop click
  $("#backdrop").addEventListener("click", evt => {
    burgerBtn.click();
  });
})("#header-navigation");

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

  const slider = $(selector);

  const list = new SlidesList(slider);

  slider.addEventListener("click", evt => {
    list.move(evt.target.dataset.direction);
  });

  //btn-power
  window.addEventListener("load", () => {
    var phonesObject = $$(".slider-phone");
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
  const portfolio = $("#portfolio");
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
  const quote = $(selector);
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
