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
