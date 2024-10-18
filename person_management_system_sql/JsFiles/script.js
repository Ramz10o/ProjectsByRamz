async function signout(){
    try {
        const response = await fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const msg = await response.json();
        if (response.ok) {
            alert(msg.message);
            sessionStorage.setItem('isLoggedIn',false);
            window.location.href = './Login.html';
        } else {
            window.alert('Error logging out : ' + msg.message);
        }
    } catch (err) {
        console.error(err);
        alert('Error inserting record');
      }
    }

async function del(id){
        try{
            const delid = document.getElementById(id).getElementsByTagName('td')[3].innerHTML;
            const response = await fetch('http://localhost:5000/deleteRecord', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body : JSON.stringify({ delid : delid })
                });
                const msg = await response.json();
                if(response.ok){
                    alert(msg.message);
                    if(document.getElementById('searchInput')){
                        getData(document.getElementById('searchInput').value);
                    }else{
                        getData();
                    }
                }
                else{
                    alert('Record does not exist');
                }
            }
            catch(error){
                alert('Error deleting record');
                console.error(error);
            }
    }

async function valid(){
        try {
            console.log(sessionStorage.getItem('isLoggedIn') === 'false');
            if(sessionStorage.getItem('isLoggedIn') === 'false'){
                alert('Authentication error please login again !');
                window.location.href = './Login.html';
                return false;
            }
            else{
                const response = await fetch('http://localhost:5000/valid', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                if(!response.ok){
                    alert('Authentication error please login again !');
                    window.location.href = './Login.html';
                    return false;
                }
            } 
            return true;
        } catch (err) {
            console.error(err);
            alert('Error loading page');
          }
    }

function inc(s){
    return [(parseInt(s[0]) + 1).toString(),s[1],s[2]];
}