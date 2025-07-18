document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("signin-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await fetch("http://127.0.0.1:5000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: username, password: password })
        });

        if (response.ok) {
            const result = await response.json();
            const token = result.token;

            // Store the JWT token in localStorage
            localStorage.setItem("jwt_token", token);

            // Redirect to home.html after successful sign-in
            window.location.href = "/home";
        } else {
            const error = await response.json();
            alert(error.message || "Something went wrong!");
        }
    });
});
