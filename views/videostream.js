const socket = io('https://instant-messaging.onrender.com');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.getElementById("myVideo");
const user = prompt("Enter your name");
let myPeerId;
const toggleVideoSharingButton = document.getElementById("toggleVideoSharing");
const createVideoBtn = document.getElementById("createVideoBtn");
const joinVideoInput = document.getElementById('joinVideoInput');
const joinVideoBtn = document.getElementById('joinVideoBtn');
const videoLink = document.getElementById('videoLink');
const videoLinkDiv = document.getElementById('videoLinkDiv');
let videoStreamId;
let myVideoStream;
const peerConfig = {
  host: 'instant-messaging.onrender.com',
  port: '3001',
  path: '/peerjs',
  config: {
    iceServers: [
      { url: 'stun:stun01.sipphone.com' },
      { url: 'stun:stun.ekiga.net' },
      { url: 'stun:stunserver.org' },
      { url: 'stun:stun.softjoys.com' },
      { url: 'stun:stun.voiparound.com' },
      { url: 'stun:stun.voipbuster.com' },
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun.voxgratia.org' },
      { url: 'stun:stun.xten.com' },
      {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      },
      {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      }
    ]
  },
  debug: 3
};

const peer = new Peer(peerConfig);
peer.on("open", (id) => {
    console.log('My Peer ID is: ' + id);
    myPeerId = id;
});
navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      peer.on("call", (call) => {
        console.log('someone is calling');
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });

joinVideoBtn.addEventListener('click', ()=>{
  socket.emit("watch-video-stream", joinVideoInput.value, user);
})
  
toggleVideoSharingButton.addEventListener("click", function() {
    toggleVideoSharing();
});
createVideoBtn.addEventListener("click", function() {
    createVideo();
});
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.appendChild(video);
  });
}


socket.on("receive-stream-members", (members, streamId) => {
  let myStream;

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      myStream = stream;
      console.log(members);
      console.log(streamId);
      videoStreamId = streamId;

      members.forEach((member) => {
        console.log('members:', member);
        console.log('my stream: ', myStream);

        const call = peer.call(member.peer, myStream);
        call.on("stream", (userVideoStream) => {
          console.log('the other user video stream', userVideoStream);
          const video = document.createElement("video");
          addVideoStream(video, userVideoStream);
        });
      });
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
});



socket.on("new-stream-member", (member) => {
  console.log(member);
  const call = peer.call(member.peer);
  call.on("stream", (userVideoStream) => {
    const video = document.createElement("video");
    addVideoStream(video, userVideoStream);
  });
});

socket.on("receive-video-link", (link) => {
  console.log('your video link is:', link);
  videoLinkDiv.innerHTML = link
  videoLink.value = link
});

socket.on("new-user-watching", (message) => {
  console.log(message);
});


// Function to indicate whether the user is sharing their video
let isSharingVideo = false;

// Function to toggle video sharing
function toggleVideoSharing() {
  isSharingVideo = !isSharingVideo;
  if (isSharingVideo) {
    startSharingVideo();
  } else {
    stopSharingVideo();
  }
}

// Start sharing the user's video
function startSharingVideo() {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        socket.emit("join-video-stream",'1234',myPeerId,videoStreamId);
    });
}
function createVideo() {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        socket.emit("create-video-stream",'1234', myPeerId);
    });
}

// Stop sharing the user's video
function stopSharingVideo() {
  // Stop the user's video stream
  myVideoStream.getTracks().forEach((track) => track.stop());

  // Remove the video element from the grid
  myVideo.srcObject = null;
  myVideo.remove();

  // Emit 'leave-video-stream' event to indicate that the user is no longer sharing their video
  socket.emit("leave-video-stream");
}

