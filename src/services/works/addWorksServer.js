import Works from "../../db/models/works.js";
const addWorkServer = async (id, req) => {

  const worksArray = req.body.map(work => ({
    ...work,
    userId: id
  }));

  await Works.insertMany(worksArray);
};

export default addWorkServer;
