const form = document.getElementById('bt');
const botMessage = document.getElementById('bm');
form.addEventListener('submit',(event) => {
    event.preventDefault();
    botMessage.textContent = "Silly bot! Go and fuck yourself!";
    botMessage.style.display = "block";
});
