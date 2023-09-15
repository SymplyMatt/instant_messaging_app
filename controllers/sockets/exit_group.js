const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const exit_group = async(userId, groupId) => {
    try {
        console.log('exiting user');
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
module.exports = exit_group;