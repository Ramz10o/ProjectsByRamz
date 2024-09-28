async function signout(){
    try {
        const email = localStorage.getItem('email');
        const response = await fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const msg = await response.json();
        if (response.ok) {
            alert(msg.message);
            localStorage.removeItem('email');
            window.location.href = './Login_SignUp.html';
        } else {
            window.alert('Error logging out : ' + msg.message);
        }
    } catch (err) {
        console.error(err);
        alert('Error inserting record');
      }
    }

async function valid(){
        try {
            const email = localStorage.getItem('email');
            const response = await fetch('http://localhost:5000/valid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }),
            });
    
            const msg = await response.json();
            if (! response.ok){
                alert(msg.message);
                window.location.href = './Login_SignUp.html';
            }
        } catch (err) {
            console.error(err);
            alert('Error loading page');
          }
    }
    
async function validHome(){
            try {
                const email = localStorage.getItem('email');
                const response = await fetch('http://localhost:5000/valid', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email }),
                });
        
                const msg = await response.json();
                if ( response.ok ){
                    if(! (msg.message === 'Done')){
                        alert(msg.message);   
                    }         
                }else {
                    alert(msg.message);
                    window.location.href = './Login_SignUp.html';
                }
            } catch (err) {
                console.error(err);
                alert('Error loading page');
              }
    }