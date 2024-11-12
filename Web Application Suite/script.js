function closeFunction(){
    window.location.href='./app_page.html';
}

function openApp(loc){
    window.location.href=loc;
}

async function logout(){
    const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        body:JSON.stringify({username: sessionStorage.getItem('user')})
        });
        const data = await response.json();
        if(response.ok){
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('isLoggedIn');
            window.location.href='./Login_Page.html';
        }
        else{
            alert(data.message);
        }
}

async function valid(){
    console.log(sessionStorage.getItem('user'));
    if(!sessionStorage.getItem('user')){
        alert('Authentication Error please Login again');
        window.location.href='./Login_Page.html';
    }
    const response = await fetch('http://localhost:5000/valid', {
        method: 'POST',
        body:JSON.stringify({username: sessionStorage.getItem('user')})
        });
        const data = await response.json();
        if(!response.ok){
            alert('Authentication Error please Login again');
            window.location.href='./Login_Page.html';
        }
}