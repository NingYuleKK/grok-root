(function () {
  var form = document.getElementById("subscribe-form");
  var emailInput = document.getElementById("email");
  var message = document.getElementById("subscribe-message");
  var revealEls = document.querySelectorAll(".reveal");

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form && emailInput && message) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = emailInput.value.trim();
      if (!isValidEmail(value)) {
        message.textContent = "Please enter a valid email address.";
        message.style.color = "#9f2e2e";
        return;
      }

      message.textContent = "Thanks. You are subscribed for weekly notes.";
      message.style.color = "#245948";
      form.reset();
    });
  }

  if ("IntersectionObserver" in window && revealEls.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();

