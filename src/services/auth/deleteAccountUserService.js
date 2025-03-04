import Auth from '../../db/models/auth.js';
import { deleteUserProfile } from '../userProfileService.js';
import { UserProfileModel } from '../../db/models/UserProfileModel.js';

const deleteAccountUserService = async (id) => {
   await Auth.findOneAndDelete({  _id: id });
   const user = await UserProfileModel.findOne({
       userId: id,
     });
   if (user) {
      await deleteUserProfile(id); 
   }
  
};

export default deleteAccountUserService;