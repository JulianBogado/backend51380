import MockServices from "../services/mock.services.js";

const Services = new MockServices();

export const getMockProducts = async (req, res) => {
  const response = await Services.getAllProducts();
  return res.status(response.status).json(response.result);
};
