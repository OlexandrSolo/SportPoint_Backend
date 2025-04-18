import Works from "../../db/models/works.js";
const deleteWorkServer = async (id, userId) => {

  return await Works.findOneAndDelete(
    { userId, _id: id },
    {
      new: true,
      projection: { createdAt: 0, updatedAt: 0 }
    }
  );
};

export default deleteWorkServer;