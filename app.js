const form = document.getElementById("signupForm");
const inputs = {
  nome: document.getElementById("nome"),
  email: document.getElementById("email"),
  senha: document.getElementById("senha"),
  confirmar_senha: document.getElementById("confirmar_senha"),
};

const errorMessages = {
  nome: document.getElementById("nome-error"),
  email: document.getElementById("email-error"),
  senha: document.getElementById("senha-error"),
  confirmar_senha: document.getElementById("confirmar_senha-error"),
};

const successMessage = document.getElementById("success-message");

const validationRules = {
  nome: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  senha: {
    required: true,
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  confirmar_senha: {
    required: true,
    matchField: "senha",
  },
};

const errorTexts = {
  required: "Este campo é obrigatório",
  minLength: (min) => `Deve ter pelo menos ${min} caracteres`,
  invalidName: "Nome deve conter apenas letras e espaços",
  invalidEmail: "Por favor, insira um e-mail válido",
  weakPassword:
    "Senha deve ter pelo menos 6 caracteres, incluindo maiúscula, minúscula e número",
  passwordMismatch: "As senhas não coincidem",
};

function validateField(fieldName, value) {
  const rules = validationRules[fieldName];
  const errors = [];

  if (rules.required && !value.trim()) {
    errors.push(errorTexts.required);
    return errors;
  }

  if (!value.trim()) {
    return errors;
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(errorTexts.minLength(rules.minLength));
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    switch (fieldName) {
      case "nome":
        errors.push(errorTexts.invalidName);
        break;
      case "email":
        errors.push(errorTexts.invalidEmail);
        break;
      case "senha":
        errors.push(errorTexts.weakPassword);
        break;
    }
  }

  if (rules.matchField) {
    const matchValue = inputs[rules.matchField].value;
    if (value !== matchValue) {
      errors.push(errorTexts.passwordMismatch);
    }
  }

  return errors;
}

function showError(fieldName, errors) {
  const errorElement = errorMessages[fieldName];
  const inputElement = inputs[fieldName];

  if (errors.length > 0) {
    errorElement.textContent = errors[0];
    errorElement.classList.add("show");
    inputElement.classList.add("error");
    inputElement.classList.remove("success");
  } else {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
    inputElement.classList.remove("error");
    if (inputElement.value.trim()) {
      inputElement.classList.add("success");
    }
  }
}

function validateSingleField(fieldName) {
  const value = inputs[fieldName].value;
  const errors = validateField(fieldName, value);
  showError(fieldName, errors);
  return errors.length === 0;
}

function validateAllFields() {
  let isValid = true;

  Object.keys(inputs).forEach((fieldName) => {
    const fieldValid = validateSingleField(fieldName);
    if (!fieldValid) {
      isValid = false;
    }
  });

  return isValid;
}

function showSuccessMessage() {
  successMessage.classList.remove("hidden");
  successMessage.classList.add("show");

  setTimeout(() => {
    successMessage.classList.remove("show");
    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 300);
  }, 5000);
}

function resetForm() {
  form.reset();

  Object.keys(inputs).forEach((fieldName) => {
    inputs[fieldName].classList.remove("error", "success");
    errorMessages[fieldName].textContent = "";
    errorMessages[fieldName].classList.remove("show");
  });
}

Object.keys(inputs).forEach((fieldName) => {
  const input = inputs[fieldName];

  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      validateSingleField(fieldName);
      if (fieldName === "senha" && inputs.confirmar_senha.value) {
        validateSingleField("confirmar_senha");
      }
    }, 300);
  });

  input.addEventListener("blur", () => {
    validateSingleField(fieldName);
  });

  input.addEventListener("focus", () => {
    if (input.classList.contains("error")) {
      errorMessages[fieldName].classList.remove("show");
    }
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  successMessage.classList.remove("show");
  successMessage.classList.add("hidden");

  const isValid = validateAllFields();

  if (isValid) {
    const submitBtn = form.querySelector(".submit-btn");
    const originalText = submitBtn.querySelector(".btn-text").textContent;

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Cadastrando...";

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-text").textContent = originalText;
      showSuccessMessage();
      setTimeout(() => {
        resetForm();
      }, 1000);
    }, 2000);
  } else {
    const firstErrorField = Object.keys(inputs).find((fieldName) => {
      return inputs[fieldName].classList.contains("error");
    });

    if (firstErrorField) {
      inputs[firstErrorField].focus();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const glassContainer = document.querySelector(".glass-container");
  glassContainer.style.opacity = "0";
  glassContainer.style.transform = "translateY(30px)";

  setTimeout(() => {
    glassContainer.style.transition = "all 0.8s ease";
    glassContainer.style.opacity = "1";
    glassContainer.style.transform = "translateY(0)";
  }, 100);

  const formElements = document.querySelectorAll(".form-group, .form-actions");
  formElements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    setTimeout(() => {
      element.style.transition = "all 0.5s ease";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 300 + index * 100);
  });

  const header = document.querySelector(".header");
  const footer = document.querySelector(".footer");

  [header, footer].forEach((element, index) => {
    if (element) {
      element.style.opacity = "0";
      element.style.transform = `translateY(${index === 0 ? "-20px" : "20px"})`;
      setTimeout(() => {
        element.style.transition = "all 0.6s ease";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, 200);
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation");
});

const style = document.createElement("style");
style.textContent = `
    .keyboard-navigation .form-input:focus {
        box-shadow: 
            inset 0 1px 3px rgba(0, 0, 0, 0.1),
            0 0 0 3px rgba(33, 150, 243, 0.3) !important;
    }
    
    .keyboard-navigation .submit-btn:focus {
        box-shadow: 
            0 4px 15px rgba(33, 150, 243, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 0 3px rgba(33, 150, 243, 0.3) !important;
    }
`;
document.head.appendChild(style);

window.addEventListener("resize", () => {
  const mainWrapper = document.querySelector(".main-wrapper");
  if (mainWrapper) {
    mainWrapper.style.height = "100vh";
  }
});

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    const mainWrapper = document.querySelector(".main-wrapper");
    if (mainWrapper) {
      mainWrapper.style.height = "calc(var(--vh, 1vh) * 100)";
    }
  }, 100);
});

const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setVH();
window.addEventListener("resize", setVH);
