const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const get_messages = async(userId) => {
    try {
        console.log('receiving');
        const messages = [];
        //get the private messages of that user
        const privateMessages = await Message.find({type: 'private',$or: [{ sender: userId },{ receiver: userId }]}).exec();
        
        //get the group messages
        //get all user groups
        const allGroupMessages = [];
        const userGroups = await GroupUser.where('userId').equals(userId);
        const groupMessages = userGroups.map(async(item) => {
            const group_messages = await Message.where('type').equals('group').where('groupId').equals(item.groupId);
            allGroupMessages.push(group_messages);
        });
        //copy all private messages and group messages into the array
        messages.push(...privateMessages,...allGroupMessages);
        return messages
    } catch (error) {
        return {
            type: 'error',
            message :error.message
        }
        // throw new Error(error.message)
    }
}
module.exports = get_messages;