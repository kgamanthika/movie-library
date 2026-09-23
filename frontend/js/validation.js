document.addEventListener("DOMContentLoaded", () => {
  initializeFormValidation();
});

function initializeFormValidation() {
  const form = document.getElementById("contactForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearValidationErrors();

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const comments = document.getElementById("comments");
    const formMessage = document.getElementById("formMessage");
    const submitButton = form.querySelector('button[type="submit"]');

    let isValid = true;

    // First Name
    if (firstName.value.trim() === "") {
      showFieldError(firstName, "First name is required.");
      isValid = false;
    }

    // Last Name
    if (lastName.value.trim() === "") {
      showFieldError(lastName, "Last name is required.");
      isValid = false;
    }

    // Email
    if (email.value.trim() === "") {
      showFieldError(email, "Email is required.");
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showFieldError(email, "Please enter a valid email address.");
      isValid = false;
    }

    // Phone - optional
    if (phone.value.trim() !== "" && !isValidPhone(phone.value.trim())) {
      showFieldError(phone, "Please enter a valid phone number.");
      isValid = false;
    }

    // Comments
    if (comments.value.trim() === "") {
      showFieldError(comments, "Comments are required.");
      isValid = false;
    }

    // Stop if frontend validation fails
    if (!isValid) {
      formMessage.textContent = "Please correct the highlighted fields.";

      formMessage.className = "form-message error";

      const firstError = form.querySelector(".field-error");

      if (firstError) {
        firstError.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }

    /*
        |--------------------------------------------------------------------------
        | Submit to PHP
        |--------------------------------------------------------------------------
        */

    formMessage.textContent = "Submitting...";
    formMessage.className = "form-message";

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        formMessage.textContent = result.message;

        formMessage.className = "form-message success";

        form.reset();
      } else {
        formMessage.textContent =
          result.message || "Unable to submit the form.";

        formMessage.className = "form-message error";

        if (result.errors) {
          displayBackendErrors(result.errors);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);

      formMessage.textContent = "Something went wrong. Please try again.";

      formMessage.className = "form-message error";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  });

  //    remove error messages on input or change

  const fields = form.querySelectorAll("input, textarea");

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      removeFieldError(field);
    });

    field.addEventListener("change", () => {
      removeFieldError(field);
    });
  });
}

/*
|--------------------------------------------------------------------------
| Email validation
|--------------------------------------------------------------------------
*/

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}

/*
|--------------------------------------------------------------------------
| Phone validation
|--------------------------------------------------------------------------
*/

function isValidPhone(phone) {
  const phonePattern = /^\+?[0-9\s-]{7,15}$/;

  return phonePattern.test(phone);
}

/*
|--------------------------------------------------------------------------
| Show frontend validation error
|--------------------------------------------------------------------------
*/

function showFieldError(field, message) {
  field.classList.add("input-error");

  const errorElement = document.createElement("span");

  errorElement.className = "field-error";

  errorElement.textContent = message;

  field.parentElement.appendChild(errorElement);
}

/*
|--------------------------------------------------------------------------
| Remove field error
|--------------------------------------------------------------------------
*/

function removeFieldError(field) {
  field.classList.remove("input-error");

  const parent = field.parentElement;

  if (!parent) {
    return;
  }

  const errorElement = parent.querySelector(".field-error");

  if (errorElement) {
    errorElement.remove();
  }
}

/*
|--------------------------------------------------------------------------
| Clear all validation errors
|--------------------------------------------------------------------------
*/

function clearValidationErrors() {
  const form = document.getElementById("contactForm");

  if (!form) {
    return;
  }

  const errorFields = form.querySelectorAll(".input-error");

  errorFields.forEach((field) => {
    field.classList.remove("input-error");
  });

  const errorMessages = form.querySelectorAll(".field-error");

  errorMessages.forEach((message) => {
    message.remove();
  });
}

/*
|--------------------------------------------------------------------------
| Display backend validation errors
|--------------------------------------------------------------------------
*/

function displayBackendErrors(errors) {
  Object.keys(errors).forEach((fieldName) => {
    const field = document.getElementById(fieldName);

    if (field) {
      showFieldError(field, errors[fieldName]);
    }
  });
}
