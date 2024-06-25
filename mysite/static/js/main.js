console.log('In main.js');

var inputUsername = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');

var username;

var websocket;

function webSocketMessage(event) {
    var parseData = JSON.parse(event.data);
    var peerUsername = parseData['peer'];
    var action = parseData['action'];

    if (peerUsername == username) {
        return;
    }

    var receiver_channel_name = parseData['message']['receiver_channel_name']

    if (action == 'new-peer') {
        createOfferer(peerUsername, receiver_channel_name);
        return;
    }
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
        sendSignal('new-peer', {});
    });
    websocket.addEventListener('close', (e)=>{
        console.log('conn closed');
    });
    websocket.addEventListener('message', webSocketMessage);
    websocket.addEventListener('error', (e)=>{
        console.log('conn error');
    });
})

var localStream = new MediaStream();

const constraints = {
    'video': {exact:'environment'},
    'audio': true
};

const localVideo = document.querySelector('#local-video');

var userMedia = navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
    localStream = stream;
    localVideo.srcObject = localStream;
    localVideo.muted = true;
}).catch((error)=>{
    console.log('Error accessing media devices : ', error);
});

function sendSignal(action, messsage) {
    var jsonStr = JSON.stringify({
        'peer': username,
        'action': action,
        'message': message,
    });

    websocket.send(jsonStr);
}

function createOfferer(peerUsername, receiver_channel_name) {
    var peer = new RTCPeerConnection(null);

    addLocalTracks(peer); 

    var dc = peer.createDataChannel('channel');
    dc.addEventListener('open', ()=>{
        console.log('connection open');
    });

    dc.addEventListener('message', dcOnMsg);

    var remoteVideo = createVideo(peerUsername);
    setOnTrack(peer, peerUsername);
}

function addEventListener(peer) {
    localStream.getTracks.foreach(track => {
        peer.addTrack(track, localStream);
    });

    return;
}

var msgList = document.querySelector('#message-list');

function dcOnMsg(event) {
    var message = event.data;

    var li = document.createElement('li');
    li.appendChild(document.createTextNode(message));
    msgList.appendChild(li);
}

function createVideo(peerUsername) {
    var videoContainer = document.querySelector('#video-container');

    var remoteVideo = document.createElement('video');

    remoteVideo.id = peerUsername+'-video';
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;

    var videoWrapper = document.createElement('div');

    videoContainer.appendChild(videoWrapper);

    videoWrapper.appendChild(remoteVideo);

    return remoteVideo;
}

function setOnTrack(peer, remoteVideo) {
    var remoteStream = new MediaStream();

    remoteVideo.srcObject = remoteStream;

    peer.addEventListener('track', async (event) => {
        remoteStream.addTrack(event.track, remoteStream);
    });
}