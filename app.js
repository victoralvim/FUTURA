// DOM elements
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

// Validation rules
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

// Error messages in Portuguese
const errorTexts = {
  required: "Este campo é obrigatório",
  minLength: (min) => `Deve ter pelo menos ${min} caracteres`,
  invalidName: "Nome deve conter apenas letras e espaços",
  invalidEmail: "Por favor, insira um e-mail válido",
  weakPassword:
    "Senha deve ter pelo menos 6 caracteres, incluindo maiúscula, minúscula e número",
  passwordMismatch: "As senhas não coincidem",
};

// Validation functions
function validateField(fieldName, value) {
  const rules = validationRules[fieldName];
  const errors = [];

  // Check if field is required
  if (rules.required && !value.trim()) {
    errors.push(errorTexts.required);
    return errors;
  }

  // Skip other validations if field is empty and not required
  if (!value.trim()) {
    return errors;
  }

  // Check minimum length
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(errorTexts.minLength(rules.minLength));
  }

  // Check pattern
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

  // Check field matching (for password confirmation)
  if (rules.matchField) {
    const matchValue = inputs[rules.matchField].value;
    if (value !== matchValue) {
      errors.push(errorTexts.passwordMismatch);
    }
  }

  return errors;
}

// Display error message
function showError(fieldName, errors) {
  const errorElement = errorMessages[fieldName];
  const inputElement = inputs[fieldName];

  if (errors.length > 0) {
    errorElement.textContent = errors[0]; // Show first error
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

// Validate single field
function validateSingleField(fieldName) {
  const value = inputs[fieldName].value;
  const errors = validateField(fieldName, value);
  showError(fieldName, errors);
  return errors.length === 0;
}

// Validate all fields
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

// Show success message
function showSuccessMessage() {
  successMessage.classList.remove("hidden");
  successMessage.classList.add("show");

  // Hide success message after 5 seconds
  setTimeout(() => {
    successMessage.classList.remove("show");
    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 300);
  }, 5000);
}

// Reset form
function resetForm() {
  form.reset();

  // Clear all error states
  Object.keys(inputs).forEach((fieldName) => {
    inputs[fieldName].classList.remove("error", "success");
    errorMessages[fieldName].textContent = "";
    errorMessages[fieldName].classList.remove("show");
  });
}

// Add input event listeners for real-time validation
Object.keys(inputs).forEach((fieldName) => {
  const input = inputs[fieldName];

  // Validate on input (with debounce)
  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      validateSingleField(fieldName);

      // Special case: re-validate password confirmation when password changes
      if (fieldName === "senha" && inputs.confirmar_senha.value) {
        validateSingleField("confirmar_senha");
      }
    }, 300);
  });

  // Validate on blur
  input.addEventListener("blur", () => {
    validateSingleField(fieldName);
  });

  // Clear error state on focus
  input.addEventListener("focus", () => {
    if (input.classList.contains("error")) {
      errorMessages[fieldName].classList.remove("show");
    }
  });
});

// Form submission handler
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Hide any existing success message
  successMessage.classList.remove("show");
  successMessage.classList.add("hidden");

  // Validate all fields
  const isValid = validateAllFields();

  if (isValid) {
    // Simulate form submission
    const submitBtn = form.querySelector(".submit-btn");
    const originalText = submitBtn.querySelector(".btn-text").textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Cadastrando...";

    // Simulate API call delay
    setTimeout(() => {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-text").textContent = originalText;

      // Show success message
      showSuccessMessage();

      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 1000);
    }, 2000);
  } else {
    // Focus on first invalid field
    const firstErrorField = Object.keys(inputs).find((fieldName) => {
      return inputs[fieldName].classList.contains("error");
    });

    if (firstErrorField) {
      inputs[firstErrorField].focus();
    }
  }
});

// Add smooth animations on page load
document.addEventListener("DOMContentLoaded", () => {
  // Animate glass container entrance
  const glassContainer = document.querySelector(".glass-container");
  glassContainer.style.opacity = "0";
  glassContainer.style.transform = "translateY(30px)";

  setTimeout(() => {
    glassContainer.style.transition = "all 0.8s ease";
    glassContainer.style.opacity = "1";
    glassContainer.style.transform = "translateY(0)";
  }, 100);

  // Animate form elements
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

  // Animate header and footer
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

// Utility function to add focus ring accessibility
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation");
});

// Add CSS for keyboard navigation focus
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

// Handle window resize to maintain centering
window.addEventListener("resize", () => {
  // Force recalculation of centering on resize
  const mainWrapper = document.querySelector(".main-wrapper");
  if (mainWrapper) {
    mainWrapper.style.height = "100vh";
  }
});

// Optimize for different screen orientations
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    // Recalculate viewport height after orientation change
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    const mainWrapper = document.querySelector(".main-wrapper");
    if (mainWrapper) {
      mainWrapper.style.height = "calc(var(--vh, 1vh) * 100)";
    }
  }, 100);
});

// Initialize viewport height fix for mobile browsers
const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

setVH();
window.addEventListener("resize", setVH);
