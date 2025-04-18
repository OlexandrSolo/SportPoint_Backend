import Works from "../../db/models/works.js";
const updateWorkServer = async (id, userId, req) => {

  return await Works.findOneAndUpdate(
    { userId, _id: id },
    req.body,
    {
      new: true,
      projection: { createdAt: 0, updatedAt: 0 }
    }
  );
};

export default updateWorkServer;