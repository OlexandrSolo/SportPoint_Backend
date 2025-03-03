import Auth from '../../db/models/auth.js';

const deleteAccountUserService = async (id) => {
   await Auth.findOneAndDelete({  _id: id });
   // I need delete account user hire
};

export default deleteAccountUserService;