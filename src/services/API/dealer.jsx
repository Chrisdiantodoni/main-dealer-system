import instance from "../instance";

class dealer {
  async getDealer(query) {
    return await instance
      .get(`/dealer/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new dealer();
