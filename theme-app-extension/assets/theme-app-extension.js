document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("textarea"),
    submitButton = document.querySelector(".app-extension__submit"),
    email = document.querySelector("#emailInput"),
    radioButtons = document.querySelectorAll('input[type="radio"]'),
    calendar = document.querySelector("#calendar");

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    width: 450,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  input.addEventListener("input", checkMessageLength);

  function checkMessageLength(e) {
    let messageLength = e.target.value.length;

    if (messageLength > limit) {
      Toast.fire({
        icon: "warning",
        title: "Please shorten your message.",
      });
      disableSubmitButton(true);
    } else if (!messageLength) {
      disableSubmitButton(true);
    } else {
      disableSubmitButton(false);
    }
  }

  function disableSubmitButton(isDisabled) {
    if (isDisabled) {
      submitButton.setAttribute("disabled", "disabled");
      submitButton.addEventListener("click", (e) => {
        e.preventDefault();
      });
    } else {
      submitButton.removeAttribute("disabled");
    }
  }

  for (const radioButton of radioButtons) {
    radioButton.addEventListener("click", (event) => {
      switch (event.target.id) {
        case "email":
          email.style.display = "block";
          email.setAttribute("required", "required");
          break;
        case "postcard":
          email.style.display = "none";
          email.removeAttribute("required");
          break;
        case "ASAP":
          calendar.style.display = "none";
          break;
        case "date":
          setDate();
          calendar.style.display = "block";
          break;
      }
    });
  }

  const setDate = () => {
    let currentDate = new Date().toJSON().slice(0, 10);
    calendar.value = currentDate;
    calendar.setAttribute("min", currentDate)
  };

  submitButton.addEventListener("click", (e) => {
    let isEmailRequired = email.required;
    const regx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (isEmailRequired && !email.value.match(regx)) {
      e.preventDefault();
      Toast.fire({
        icon: "warning",
        title: "Please check your email.",
      });
    }
  });
});
