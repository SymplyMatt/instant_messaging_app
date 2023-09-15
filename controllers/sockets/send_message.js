const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const send_message = async(senderId, message,receiverId,groupId) => {
    try {
        console.log('incoming');
        const senderInfo = User.findOne({_id : senderId});
        if(!senderInfo) throw new Error('Invalid sender');

        // create message based on receiver type - private or group message
        // private message 
        console.log("sender: ", senderId);
        console.log("receiver: ", receiverId || groupId);
        console.log("message: ", message);
        if(receiverId){
            let result = await Message.create({
                message : message,
                sender: senderId,
                receiver: receiverId,
                type: "private"
            });
            console.log(result);
            return result
        }else if(groupId){
            //group message
            //check if sender is a group member
            const isGroupMember = await GroupUser.where('userId').equals(senderId).where('groupId').equals(groupId);
            if(isGroupMember.length < 1){
                throw new Error('not a group member');
            }
            let result = await Message.create({
                message : message,
                sender: senderId,
                groupId: groupId,
                type: 'group'
            });
            // console.log(result);
            return result
        }
    } catch (error) {
        // console.log(error), 'from function';
        return {
            type: 'error',
            message :error.message
        }
        // throw new Error(error.message)
    }
}
module.exports = send_message;