const User = require('../../model/User');
const Group = require('../../model/Group');
const Message = require('../../model/Message');
const GroupUser = require('../../model/GroupUser');



const create_group = async(userId, name) => {
    try {
        console.log('creating group');
        const isValidUser = await User.findById(userId);
        if(!isValidUser) return {
            type: 'error',
            message :'invalid admin id'
        };
        let new_group = await Group.create({
            name,
            createdBy : userId
        });
        let new_user_group = await GroupUser.create({
            userId,
            groupId : new_group._id,
            isAdmin : true
        });
        return new_group
    } catch (error) {
        return {
            type: 'error',
            message :error.message
        }
        // throw new Error(error.message)
    }
}
module.exports = create_group;