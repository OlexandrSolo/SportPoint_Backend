
import Auth from '../../db/models/auth.js';
import { ErrorsApp } from '../../constants/errors.js';
import registerService from '../../services/auth/registerService.js';
import {
  handleFileUpload,
  handleMultipleFileUploads,
} from '../../helpers/uploadImageHelper.js';
import { createUserProfile } from '../../services/userProfileService.js';
import loginService from '../../services/auth/loginService.js';

const register = async (req, res) => {
   const { email, password } = req.body;
   const normalizeEmail = email.toLowerCase();

   //create profile body 
   const firstName = req.body.firstName ? req.body.firstName : '';
   const lastName = req.body.lastName ? req.body.lastName : '';
   const clubName = req.body.clubName ? req.body.clubName : '';
   const phone = req.body.phone ? req.body.phone : '';
   const address = req.body.address ? req.body.address : '';
   const abilities = req.body.abilities ? req.body.abilities : '';
    const descriptionObject = req.body.description
      ? JSON.parse(req.body.description)
      : {};
    const clubArray = req.body.club ? req.body.club.split(',') : [];
    const couchArray = req.body.couch ? req.body.couch.split(',') : [];

    const favoriteArray = req.body.favorite
      ? JSON.parse(req.body.favorite)
      : [];

    const avatarUrl = req.files?.avatar?.[0]
      ? await handleFileUpload(req.files.avatar[0])
      : null;
    const photoUrls = await handleMultipleFileUploads(req.files?.images || []);
    const certificates = await handleMultipleFileUploads(
      req.files?.certificates || [],
   );
   
   const sport = req.body.sport ? req.body.sport : '';
   

   
   const user = await Auth.findOne({ email: normalizeEmail });

   if (user) {
      return res.status(409).json({ message: ErrorsApp.EXIST_USER });
   }

   const newUser = await registerService(req, normalizeEmail, password);

   const findNewUser = await Auth.findOne({ email: normalizeEmail });


      const profileData = {
      ...req.body,
      userId: findNewUser._id,
      avatar: avatarUrl,
      images: photoUrls,
      certificates: certificates,
      role: findNewUser.role,
      description: {
        ...descriptionObject,
        email: findNewUser.email,
        phone,
        address,
        abilities
         },
      firstLastName: clubName !== '' ? clubName : `${firstName} ${lastName}`,
      club: clubArray,
      couch: couchArray,
      favorite: favoriteArray,
      sport,
   };
   
   await createUserProfile(profileData);

   const tokens = await loginService(findNewUser);



   res.status(201).json({
      message: "Successfully register user",
      email: newUser.email,
      token: tokens.token,
      refreshToken: tokens.refreshToken,
   });
};

export default register;