document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("read-form").addEventListener("submit", async (e) => {
        e.preventDefault(); 
        console.log("Submit triggered");
        const fileInput = document.getElementById("qr-file");
        if (!fileInput.files.length) {
            console.log("No file selected");
            return;
        }
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);    
        try {
            const response = await fetch("http://127.0.0.1:5000/qr/read", {
                method: "POST",
                headers: {
                    'Authorization': localStorage.getItem('jwt_token')
                },
                body: formData
            });
            if (response.ok) {
                console.log('Ok Response')
                const result = await response.json();
                document.getElementById("qr-data").innerHTML = `<p>QR Data: ${result.data.toString()}</p>`;
            } else {
                const error = await response.json();
                document.getElementById("qr-data").innerHTML = `<p>Error: ${error.error}</p>`;
            }
        } catch (err) {
            console.error('Error during fetch:', err);
            document.getElementById("qr-data").innerHTML = `<p>Error: Unable to process the request.</p>`;
        }
    });
});