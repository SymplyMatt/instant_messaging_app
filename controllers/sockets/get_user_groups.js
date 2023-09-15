const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const get_user_groups = async(userId) => {
    try {
        console.log('getting user groups');
        //get all user groups
        const userGroups = await GroupUser.where('userId').equals(userId);
        return userGroups
    } catch (error) {
        return []
        // throw new Error(error.message)
    }
}
module.exports = get_user_groups;