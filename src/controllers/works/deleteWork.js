import { ErrorsApp } from '../../constants/errors.js';
import deleteWorkServer from '../../services/works/deleteWorkService.js';

const worksDelete = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
   
    if (user.role !== 'couch') {
        return res.status(401).json({ message: ErrorsApp.FORBIDDEN });
    }

    await deleteWorkServer(id, user._id);

    res.status(204).json({
    status: 201,
    message: 'Тренування успішно видалено!'
  });

}

export default worksDelete;