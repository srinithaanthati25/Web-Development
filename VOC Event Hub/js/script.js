const faqItems = document.querySelectorAll('.faq-item');
const form = document.getElementById('register-form');
const navToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

faqItems.forEach((item) => {
  const trigger = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove('active');
      faqItem.querySelector('.faq-answer').hidden = true;
    });

    if (!isOpen) {
      item.classList.add('active');
      answer.hidden = false;
    }
  });
});

if (form) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const roleInput = document.getElementById('role');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const formMessage = document.getElementById('form-message');

  const storageKey = 'vocEventRegistrations';

  function clearError(input, errorElement) {
    errorElement.textContent = '';
    errorElement.hidden = true;
    input.removeAttribute('aria-invalid');
  }

  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    errorElement.hidden = false;
    input.setAttribute('aria-invalid', 'true');
  }

  function showMessage(message, success) {
    formMessage.textContent = message;
    formMessage.className = success
      ? 'form-message success'
      : 'form-message error';
    formMessage.hidden = false;
  }

  nameInput.addEventListener('input', () => {
    clearError(nameInput, nameError);
  });

  emailInput.addEventListener('input', () => {
    clearError(emailInput, emailError);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    formMessage.hidden = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const role = roleInput.value;

    let valid = true;

    if (!name) {
      showError(nameInput, nameError, 'Please enter your full name.');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showError(emailInput, emailError, 'Please enter your email.');
      valid = false;
    } else if (!emailPattern.test(email)) {
      showError(emailInput, emailError, 'Please enter a valid email.');
      valid = false;
    }

    if (!valid) {
      showMessage('Please correct the errors above.', false);
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      const registrations = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(registrations)) {
        throw new Error('Invalid registration data');
      }

      const duplicate = registrations.some(
        (registration) =>
          registration.email &&
          registration.email.toLowerCase() === email
      );

      if (duplicate) {
        showError(
          emailInput,
          emailError,
          'This email is already registered.'
        );
        showMessage('Please use a different email address.', false);
        return;
      }

      registrations.push({
        name,
        email,
        role,
        registeredAt: new Date().toISOString()
      });

      localStorage.setItem(storageKey, JSON.stringify(registrations));

      showMessage(
        'Registration successful! Your details are saved in this browser.',
        true
      );

      form.reset();
    } catch (error) {
      showMessage(
        'Unable to save your registration. Please try again.',
        false
      );
    }
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('is-open');
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
  });
}

const registerButton = document.querySelector('.primary-btn');
if (registerButton) {
  registerButton.addEventListener('click', () => {
    const activeButton = document.querySelector('.primary-btn.active');
    if (activeButton) {
      activeButton.classList.remove('active');
    }
    registerButton.classList.add('active');
  });
}

const latestStats = document.querySelector('.faq-item .faq-answer');
if (latestStats) {
  latestStats.textContent = 'Seats are filling quickly for this year\'s workshop.';
}
