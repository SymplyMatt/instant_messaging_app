const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const edit_group = async(groupId,adminId,name) => {
    try {
        console.log('editing group');
        const isValidUser = await User.findById(adminId);
        if(!isValidUser) return {
            type: 'error',
            message :'invalid admin id'
        };
        //check if the supplied admin is an admin of the group
        const admin_group_user = await GroupUser.findOne({ groupId: groupId, userId: adminId });
        if(!admin_group_user.isAdmin) return {
            type: 'error',
            message :'only admins are allowed to edit group info'
        };
        
        const groupInfo = await Group.findOne({_id : groupId}).exec();
        if(!groupInfo) return {
            type: 'error',
            message :'invalid group id'
        };
        groupInfo.name = name;
        groupInfo.save();
        return groupInfo;
    } catch (error) {
        return {
            type: 'error',
            message :error.message
        }
        // throw new Error(error.message)
    }
}
module.exports = edit_group;