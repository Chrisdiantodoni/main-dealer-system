import instance from "../instance";

class support {
  async duplicateFakturReceived(query) {
    return await instance
      .get(`/support/faktur-received/duplicate?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteFakturApplication(id) {
    return await instance
      .delete(`/support/faktur-received/duplicate${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new support();
