function createDiv(type, message, pic = {}) {
    let div = document.createElement('div');
    div.id = 'popup';
    div.style.textAlign = 'center';
    div.style.position = 'fixed';
    div.style.top = '45%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.width = '500px';
    div.style.height = 'auto';
    div.style.display = 'block';
    div.style.backdropFilter = 'blur(9px)';
    div.style.backgroundColor = 'white';
    div.style.borderRadius = '10px';
    div.style.padding = '20px';

    if (type === 'Error') {
        const ok = () => {
            div.remove();
        };
        div.innerHTML = `
            <h2>Error</h2><br>
            <h3>${message}</h3>
            <button id="okButton" class="popup-button">Ok</button>
        `;
        document.body.append(div);
        document.getElementById('okButton').onclick = ok;

    } else if (type === 'Invitation') {
        const accept = () => {
            handleRequest('Accept');
            div.remove();
        };
        const decline = () => {
            handleRequest('Decline');
            div.remove();
        };
        
        const imgSrc = pic.data ? `data:${pic.extension};base64,${pic.data}` : '';
        
        div.innerHTML = `
            <h2>Invitation</h2>
            <h4>Accept Invite from ${message}?</h4>
            ${imgSrc ? `<img src="${imgSrc}" style="height: 100px; width: 100px; border-radius: 100%;">` : ''}
            <br><br>
            <button id="acceptButton" class="popup-button">Accept</button>
            <button id="declineButton" class="popup-button">Decline</button>
        `;
        
        document.body.append(div);
        document.getElementById('acceptButton').onclick = accept;
        document.getElementById('declineButton').onclick = decline;
    }
    
    document.head.appendChild(styleSheet);
}

function close(){
    window.location.href='./app_page.html';
}
