const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const remove_from_group = async(userId, adminId, groupId) => {
    try {
        console.log('removing from group');
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
            message :'only admins are allowed to remove members from group'
        };
        //check if the supplied userId is already a member of the group
        const group_user = await GroupUser.findOne({ groupId: groupId, userId: userId });
        if(!group_user){
            return {
                type: 'error',
                message :'user is not a member of this group'
            }    
        }else{
            await group_user.delete();
            return group_user
        }
    } catch (error) {
        return {
            type: 'error',
            message :error.message
        }
        // throw new Error(error.message)
    }
}
module.exports = remove_from_group;