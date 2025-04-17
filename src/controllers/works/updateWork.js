import { ErrorsApp } from '../../constants/errors.js';
import updateWorkServer from '../../services/works/updateWorkService.js';

const worksUpdate = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    console.log(req.body);
    if (user.role !== 'couch') {
        return res.status(401).json({ message: ErrorsApp.FORBIDDEN });
    }
    const data = await updateWorkServer(id, user._id, req);
    res.status(201).json({
    status: 201,
    message: 'Тренування успішно оновлено!',
    data: data, 
  });
}

export default worksUpdate;