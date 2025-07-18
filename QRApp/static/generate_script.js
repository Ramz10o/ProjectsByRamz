document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generate-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = document.getElementById("content").value;
        const email = document.getElementById("email").value;
        try{
            const response = await fetch('http://127.0.0.1:5000/qr/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('jwt_token')
                },
                body: JSON.stringify({"email" : email, "content" : content})
            });
            if (response.ok){
                console.log('Ok Response');
                const data = await response.blob();
                const imgUrl = URL.createObjectURL(data);
                const qrImage = `<img src="${imgUrl}" alt="QR Code" />`;
                const downloadLink = `<a href="${imgUrl}" download="QRcode.png">Download QR Code</a>`;
                document.getElementById("generated-qr").innerHTML = qrImage + "<br>" + downloadLink;
            }
            else{
                const err = await response.json();
                alert(err.message);
            }
        }
        catch(err){
            console.error(err);
        }
        
    });
});