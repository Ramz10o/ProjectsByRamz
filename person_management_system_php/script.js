function signout() {
    $.ajax({
        url: 'logout.php',
        type: 'POST',
        contentType: 'application/json',
        success: function(msg) {
            alert(msg.message);
            sessionStorage.setItem('isLoggedIn', false);
            window.location.href = './Login.html';
        },
        error: function(xhr) {
            const msg = JSON.parse(xhr.responseText);
            alert('Error logging out: ' + msg.message);
        }
    });
}

function del(id) {
    const delid = document.getElementById(id).getElementsByTagName('td')[3].innerHTML;
    
    $.ajax({
        url: 'delete_record.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ delid: delid }),
        success: function(msg) {
            alert(msg.message);
            if (document.getElementById('searchInput')) {
                getData(document.getElementById('searchInput').value);
            } else {
                getData();
            }
        },
        error: function() {
            alert('Error deleting record');
        }
    });
}

function valid() {
    console.log(sessionStorage.getItem('isLoggedIn') === 'false');
    
    if (sessionStorage.getItem('isLoggedIn') === 'false') {
        alert('Authentication error, please login again!');
        window.location.href = './Login.html';
        return false;
    } else {
        $.ajax({
            url: 'valid.php',
            type: 'POST',
            contentType: 'application/json',
            success: function(response) {
                if (!response.valid) {
                    alert('Authentication error, please login again!');
                    window.location.href = './Login.html';
                    return false;
                }
            },
            error: function() {
                alert('Error loading page');
            }
        });
    }
    return true;
}

function inc(s) {
    return [(parseInt(s[0]) + 1).toString(), s[1], s[2]];
}