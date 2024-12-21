import { data } from "autoprefixer";
import instance from "../instance";

class shippingOrder {
  async listShippingOrder(query) {
    return await instance
      .get(`/shipping-order/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async detailShippingOrder(id) {
    return await instance
      .get(`/shipping-order/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async syncShippingOrder(body) {
    return await instance
      .post(`/shipping-order/sync`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async deleteShippingOrder(data) {
    return await instance
      .put(`/support/shipping-order/delete`, data)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
}

export default new shippingOrder();
