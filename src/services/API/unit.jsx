import instance from "../instance";

class Unit {
  async getListUnit(query) {
    return await instance
      .get(`/unit/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDetailUnit(id) {
    return await instance
      .get(`/unit/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async returUnitMds(id) {
    return await instance
      .post(`/unit/retur/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async uploadUnit(body) {
    return await instance
      .post("/import/shipping-order", body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async changeUnitToSPK(id) {
    return await instance
      .put(`/support/unit/update-spk/${id}`)
      .then((res) => res.data)
      .catch((err) => err.data);
  }
}

export default new Unit();
