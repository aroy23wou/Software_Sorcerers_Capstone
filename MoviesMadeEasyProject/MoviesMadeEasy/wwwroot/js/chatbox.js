document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById("chatbox");
    const toggle = document.getElementById("chatbox-toggle");
    const body = document.getElementById("chatbox-body");
    const close = document.getElementById("chatbox-close");
    const chevron = document.getElementById("chatbox-chevron");

    toggle.addEventListener("click", () => {
        chatbox.classList.toggle("open");
    });

    close.addEventListener("click", () => {
        chatbox.classList.remove("open");
    });
});
