async function signout(){
    try {
        const response = await fetch('http://localhost:5000/logout', {
            method: 'POST',
        });

        const msg = await response.json();
        if (response.ok) {
            alert(msg.message);
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
        const response = await fetch('http://localhost:5000/valid', {
            method: 'POST',
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
            const response = await fetch('http://localhost:5000/valid', {
                method: 'POST',
            });
    
            const msg = await response.json();
            if (! response.ok){
                alert(msg.message);
                window.location.href = './Login_SignUp.html';
            }else {
                alert(msg.message);
            }
        } catch (err) {
            console.error(err);
            alert('Error loading page');
          }
        }