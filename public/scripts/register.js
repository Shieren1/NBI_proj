
document.addEventListener("DOMContentLoaded", () => {
    const successMessage = document.querySelector("#successMessage");

    if (successMessage && successMessage.textContent.trim()) {
        alert(successMessage.textContent.trim());
    }
});
