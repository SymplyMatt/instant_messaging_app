const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const get_sorted_messages = async(userId) => {
    try {
        console.log('sending sorted messages');
        const messages = [];
        //get the private messages of that user
        const privateMessages = await Message.find({type: 'private',$or: [{ sender: userId },{ receiver: userId }]}).exec();
        //sent messages
        const message_receivers = privateMessages.filter((item) =>{
            return item.sender == userId
        }).map(item => item.receiver.toString());
        const unique_receivers = [...new Set(message_receivers)];

        const message_senders = privateMessages.filter((item) =>{
            return item.sender != userId
        }).map(item => item.sender.toString());
        const unique_senders = [...new Set(message_senders)];
        let unique_users = new Set([...unique_receivers,...unique_senders]);
        unique_users = [...unique_users];
        const arrangedPrivateMessages = unique_users.map(i =>{
            const user_messages_with_that_user = privateMessages.filter(item => item.sender == i || item.receiver == i);
            return {
                user : i,
                messages : user_messages_with_that_user
            }
        });
        //get the group messages
        //get all user groups
        const arrangedGroupMessages = [];
        const userGroups = await GroupUser.where('userId').equals(userId);
        const groupMessages = userGroups.map(async(item) => {
            const group_messages = await Message.where('type').equals('group').where('groupId').equals(item.groupId);
            arrangedGroupMessages.push(
                {
                    group:item.toString(),
                    messages:group_messages
                }
            );
        });
        const awaitGroupMessages = await Promise.all(groupMessages);
        //copy all private messages and group messages into the array
        messages.push(...arrangedPrivateMessages,...arrangedGroupMessages);
        const sortedMessages = [...messages].sort((a,b) =>{
            // Get the latest createdAt value in each messages array
            const dateA = a.messages?.[a.messages.length - 1]?.createdAt;
            const dateB = b.messages?.[b.messages.length - 1]?.createdAt;
            // Compare the dates for sorting (ascending order)
            return dateB - dateA;
        })
        return sortedMessages
    } catch (error) {
        // console.log(error), 'from function';
        return {
            type: 'error',
            message :error.message
        }
        // throw new Error(error.message)
    }
}
module.exports = get_sorted_messages;