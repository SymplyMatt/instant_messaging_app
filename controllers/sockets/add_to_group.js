const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const add_to_group = async(userId, adminId, groupId) => {
    try {
        console.log('adding to group');
        const isValidUser = await User.findById(userId);
        if(!isValidUser) return {
            type: 'error',
            message :'invalid user id'
        };
        const isValidGroup = await Group.findById(groupId);
        if(!isValidGroup) return {
            type: 'error',
            message :'invalid group id'
        };
        //check if the supplied admin is an admin of the group
        const admin_group_user = await GroupUser.findOne({ groupId: groupId, userId: adminId });
        if(!admin_group_user.isAdmin) return {
            type: 'error',
            message :'only admins are allowed to add members to group'
        };
        //check if the supplied userId is already a member of the group
        const user_group = await GroupUser.findOne({ groupId: groupId, userId: userId });
        if(user_group) return {
            type: 'error',
            message :'user is already a member of the group'
        };
        
        let new_user_group = await GroupUser.create({
            userId,
            groupId
        });
        return new_user_group
    } catch (error) {
        return {
            type: 'error',
            message :error.message
        }
        // throw new Error(error.message)
    }
}
module.exports = add_to_group;