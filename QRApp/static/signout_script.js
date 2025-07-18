document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logout-button").addEventListener("click", async (event) => {
        event.preventDefault();
        localStorage.removeItem("jwt-token");
        window.location.href = '/';
    });
});