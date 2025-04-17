import { ErrorsApp } from '../../constants/errors.js';
import Works from '../../db/models/works.js';

const worksGetAll = async (req, res) => {
    const user = req.user;
      
    if (user.role !== 'couch') {
        return res.status(401).json({ message: ErrorsApp.FORBIDDEN });
    }

    const works = await Works.find({ userId: user._id });

   res.status(200).json({
    status: 200,  
    data: works, 
  });
}

export default worksGetAll;