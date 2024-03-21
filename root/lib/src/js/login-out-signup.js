// Get elements
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeButtons = document.querySelectorAll('.close-button');

// Open Modals
loginButton.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

signupButton.addEventListener('click', () => {
  signupModal.style.display = 'block';
});

// Close Modals
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal'); // Find the parent modal
    modal.style.display = 'none';
  });
});

// Close when clicking outside the modal
window.addEventListener('click', (event) => {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  } else if (event.target === signupModal) {
    signupModal.style.display = 'none';
  }
});
