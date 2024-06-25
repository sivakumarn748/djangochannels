console.log('In main.js');

var inputUsername = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');

var username;

var websocket;

function webSocketMessage(event) {
    var parseData = JSON.parse(event.data);
    var message = parseData['message'];

    console.log('message', message);
}

btnJoin.addEventListener('click', ()=>{
    username = inputUsername.value;

    console.log('username ', username);

    if(username=='') {
        return;
    }
    
    inputUsername.value = '';
    inputUsername.disabled = true;
    inputUsername.style.visibility = 'hidden';

    btnJoin.disabled = true;
    btnJoin.style.visibility = 'hidden';

    var labelUsername = document.querySelector('#label-username');
    labelUsername.innerHTML = username;

    var loc = window.location;
    var wsStart = 'wss://';

    if (loc.protocol=='https:') {
        wsStart = 'wss://';
    }

    var endPoint = wsStart + loc.host + loc.pathname;

    console.log(endPoint);

    websocket = new WebSocket(endPoint);

    websocket.addEventListener('open', (e)=>{
        console.log('conn open');
    });
    websocket.addEventListener('close', (e)=>{
        console.log('conn closed');
    });
    websocket.addEventListener('message', webSocketMessage);
    websocket.addEventListener('error', (e)=>{
        console.log('conn error');
    });
})