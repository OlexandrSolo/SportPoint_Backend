import { ErrorsApp } from '../../constants/errors.js';
import addWorkServer from '../../services/works/addWorksServer.js';
const worksAdd = async (req, res) => {
    const user = req.user;
      if (user.role !== 'couch') {
        return res.status(401).json({ message: ErrorsApp.FORBIDDEN });
    }
    
  const data =   await addWorkServer(user._id, req);

    res.status(201).json({
    status: 201,
    message: 'Тренування успішно додано!',
    data: data 
  });
 }

export default worksAdd;
