const socketio = require('socket.io');
const send_message = require('../controllers/sockets/send_message');
const get_messages = require('../controllers/sockets/get_messages');
const get_sorted_messages = require('../controllers/sockets/get_sorted_messages');
const get_user_groups = require('../controllers/sockets/get_user_groups');
const create_group = require('../controllers/sockets/create_group');
const add_to_group = require('../controllers/sockets/add_to_group');
const exit_group = require('../controllers/sockets/exit_group');
const remove_from_group = require('../controllers/sockets/remove_from_group');
const edit_group = require('../controllers/sockets/edit_group');
const VideoStream = require('../model/VideoStream');
const StreamMember = require('../model/StreamMember');
const { v4: uuidv4 } = require('uuid');
const connectSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    allowEIO3 : true
  });

  // Set up event handlers for Socket.IO connections
  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);


    //for real-time updates
    socket.on('connect_user', async (userId) => {
      try {
        console.log('trying to connect user');
        const response = await get_user_groups(userId);
        console.log(response);
        //connect user to the socket room with his id
        socket.join(userId);
        //connect user to all his group sockets
        const joinGroupSocket = response.map(item =>{
          socket.join(item);
        });
      } catch (error) {
        // console.log(error);
      }
    });

    socket.on('send_message', async (senderId, message, receiverId, groupId) => {
      try {
        const response = await send_message(senderId, message, receiverId,groupId);
        console.log(response);
        //send response
        if(!response.type == 'error'){
            io.to(senderId).emit('receive_message', response);
            if (receiverId)io.to(receiverId).emit('receive_message', response);
            if (groupId) io.to(groupId).emit('receive_message', response);
        }else{
            //send error response to message sender
            io.to(senderId).emit('receive_message', response);
        }
      } catch (error) {
        io.to(senderId).emit('receive_message', error.message);
        // console.log(error);
      }
    });

    socket.on('get_messages', async (userId) => {
      try {
        const response = await get_messages(userId);
        console.log(response);
        //send response
        io.to(userId).emit('receive_message', response);
      } catch (error) {
            io.to(userId).emit('receive_message', error.message);
        // console.log(error);
      }
    });

    socket.on('get_sorted_messages', async (userId) => {
      try {
        const response = await get_sorted_messages(userId);
        console.log(response);
        //send response
        io.to(userId).emit('receive_message', response);
      } catch (error) {
            io.to(userId).emit('receive_message', error.message);
        // console.log(error);
      }
    });


    //groups
    socket.on('create_group', async(userId,name) => {
      try {
        const response = await create_group(userId, name);
        console.log(response);
        if(response.type !== 'error'){
          socket.join(response._id);
          //send response
          io.to(userId).emit('receive_group_info', response);
        }else{
          throw new Error(response)
        }
      } catch (error) {
            io.to(userId).emit('receive_message', error.message);
        // console.log(error);
      }
    });

    socket.on('edit_group', async(groupId,adminId,name) => {
      try {
        const response = await edit_group(groupId,adminId,name);
        //send response
        if(response.type !== 'error'){
          io.to(groupId).emit('receive_group_info', response);
        }else{
          throw new Error(response)
        }
      } catch (error) {
            io.to(adminId).emit('receive_message', error.message);
        // console.log(error);
      }
    });


    socket.on('add_to_group', async(userId,adminId,groupId) => {
      try {
        const response = await add_to_group(userId, adminId, groupId);
        console.log(response);
        if(response.type !== 'error'){
          //send response
          io.to(userId).emit('receive_group_info', response);
          io.to(userId).join(response.groupId);
          io.to(groupId).emit('receive_message', `${userId} joined!`);
        }else{
          throw new Error(response)
        }
      } catch (error) {
            io.to(userId).emit('receive_message', error.message);
        // console.log(error);
      }
    });

    socket.on('remove_from_group', async(userId,adminId,groupId) => {
      try {
        const response = await remove_from_group(userId, adminId, groupId);
        console.log(response);
        if(response.type !== 'error'){
          //send response
          io.to(userId).leave(groupId);
          io.to(groupId).emit('receive_message', `${userId} was removed!`);
        }else{
          throw new Error(response)
        }
      } catch (error) {
            io.to(userId).emit('receive_message', error.message);
        // console.log(error);
      }
    });

    socket.on('exit_group', async(userId,groupId) => {
      try {
        const response = await exit_group(userId, groupId);
        console.log(response);
        if(response.type !== 'error'){
          io.to(userId).leave(groupId);
          io.to(groupId).emit('receive_message', `${userId} left!`);
        }else{
          throw new Error(response)
        }
      } catch (error) {
            io.to(userId).emit('receive_message', error.message);
        // console.log(error);
      }
    });

    socket.on('create-video-stream', async(userId,peer) => {
      try {
        // Generate a UUID
        const videolink = uuidv4();
        const newStream = await VideoStream.create({
          createdBy : userId,
          link : videolink
        });
        const newStreamMember = await StreamMember.create({
          videoStream : newStream._id,
          user : userId,
          peer : peer
        });
        socket.join(videolink);
        console.log(' newStream link: ',  newStream.link);
        socket.emit('receive-video-link', newStream.link );    
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('watch-video-stream', async(link, userName) => {
      try {
        // Generate a UUID
        const videoStream = await VideoStream.findOne({link});
        console.log('videoStream to join: ', videoStream);
        if(videoStream){
          const streamMembers = await StreamMember.find({videoStream : videoStream._id});
          socket.join(videoStream.link);
          io.to(videoStream.link).emit('new-user-watching', `${userName} started watching this stream` );
          socket.emit('receive-stream-members', streamMembers, videoStream._id );    
        } 
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('join-video-stream', async(userId,peer,streamId) => {
      try {
        const videoStream = await VideoStream.findById(streamId);
        if(videoStream){
          const newStreamMember = await StreamMember.create({
            videoStream : streamId,
            user : userId,
            peer : peer
          });
          socket.join(videoStream.link);
          io.to(videoStream.link).emit('new-stream-member', newStreamMember );
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('disconnect', async () => {
      try {
        console.log('a user disconnected');
      } catch (error) {
        console.log(error);
        socket.emit('error', error.message);
      }
    });
  });

  return io;
}

module.exports = connectSocket;
