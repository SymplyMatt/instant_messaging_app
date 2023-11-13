let socket;
let peer;
let peerID;
let videoId;
let mode;
let streamId;
let notification = document.getElementById('notification');
let peerIdText = document.getElementById('peerId');
let socketIdText = document.getElementById('socketId');
let watchBtn = document.getElementById('watchBtn');
let createBtn = document.getElementById('createBtn');
let joinBtn = document.getElementById('joinBtn');
let watchInput = document.getElementById('watch-input');

watchBtn.addEventListener('click', ()=>{
    watchVideoStream();
})
createBtn.addEventListener('click', ()=>{
    startVideoStream();
})
joinBtn.addEventListener('click', ()=>{
    joinStream();
})

async function connSocket() {
    try {
        socket = await io('https://instant-messaging.onrender.com');

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socketIdText.innerHTML = `Your socket id is ${socket.id}`;
        });

        socket.on('receive-video-link', (message) => {
        notification.innerHTML = `Your video id is ${message}`
        });

        socket.on("receive-stream-members", (members, streamid) => {
        streamId = streamid
        addVideoMembersToStream(members);
        });

        socket.on("new-user-watching", (message) => {
        notification.innerHTML = message+ ' started watching'
        });   

        socket.on("new-stream-member", async(newMember) => {
            console.log('received new member', newMember);
            navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                addPeer(newMember, stream);
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
            });
        }); 

        return () => {
        socket.disconnect();
        }; 
    } catch (error) {
      console.log(error);
    }
}
async function connPeer(){
    const initializePeer = async () => {
        // const peerConfig= {
        //     host: 'muddy-blue-tweed-jacket.cyclic.app',
        //     port: '8080',
        //     path: '/peerjs',
        //     config: {
        //     iceServers: [
        //         { url: 'stun:stun01.sipphone.com' },
        //         { url: 'stun:stun.ekiga.net' },
        //         { url: 'stun:stunserver.org' },
        //         { url: 'stun:stun.softjoys.com' },
        //         { url: 'stun:stun.voiparound.com' },
        //         { url: 'stun:stun.voipbuster.com' },
        //         { url: 'stun:stun.voipstunt.com' },
        //         { url: 'stun:stun.voxgratia.org' },
        //         { url: 'stun:stun.xten.com' },
        //         {
        //         url: 'turn:192.158.29.39:3478?transport=udp',
        //         credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        //         username: '28224511:1379330808'
        //         },
        //         {
        //         url: 'turn:192.158.29.39:3478?transport=tcp',
        //         credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        //         username: '28224511:1379330808'
        //         }
        //     ]
        //     },
        //     debug: 3
        // };
        const peerInstance = new Peer(); 
        peerInstance.on('open', (id) => {
            peerID = id;
            peerIdText.innerHTML = `Your peer id is ${peerInstance.id}`
        });
        peer = peerInstance
    };
  
    initializePeer();
  
    return () => {
        if (peer) {
            peer.destroy();
        }
    };
}
connSocket();
connPeer();

function addVideoStream(video, stream) {
    console.log('adding video stream');
    notification.innerHTML = `adding video stream`
    const videoGrid = document.getElementById("video-grid");
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
        videoGrid.appendChild(video);
    });
}
  
async function startVideoStream() {
    mode = 'sharing';
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
        const myVideo = document.getElementById("myVideo");
        addVideoStream(myVideo, stream);
        peer.on("call", (call) => {
        console.log('someone is calling');
        call.answer(stream);
        });
        socket.emit("create-video-stream",'1234', peerID);
    })
    .catch((error) => {
        console.error('Error accessing media devices:', error);
    });
}

const addPeer = (member , stream) => {
    if (peer) {
        const call = peer.call(member.peer, stream);
        let addedVideo = false;
        call.on("stream", (userVideoStream) => {
        const video = document.createElement("video");
        if(!addedVideo) addVideoStream(video, userVideoStream);
        addedVideo = true;
        });
    }else{
        console.log('peer is not valid', peer);
    }
}

const addVideoMembersToStream = async(members) => {
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
        members.forEach((member) => {
        addPeer(member, stream);
        });
    })
    .catch((error) => {
        console.error('Error accessing media devices:', error);
    });
};

const watchVideoStream = () => {
    mode = 'watching';
    const user = prompt("Enter your name");
    socket.emit("watch-video-stream", watchInput.value, user);
}

const joinStream = () => {
    mode = 'sharing';
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
        const myVideo = document.getElementById("myVideo");
        addVideoStream(myVideo, stream);
        peer.on("call", (call) => {
        console.log('someone is calling');
        call.answer(stream);
        });
        socket.emit('join-video-stream', "1234",peerID,streamId);
    })
    .catch((error) => {
        console.error('Error accessing media devices:', error);
    });
}