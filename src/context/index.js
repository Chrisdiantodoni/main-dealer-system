import { create } from "zustand";

const initialState = {
  modal: {
    modalMasterPoolingSource: false,
    modalMasterMarital: false,
    modalSyncShippingOrder: false,
    modalMasterDealer: false,
    modalMasterDealerNeq: false,
    modalMasterMarital: false,
    modalMasterHobbies: false,
    modalMasterResidence: false,
    modalMasterMotorBrand: false,
    modalMasterEducation: false,
    modalMasterOccupation: false,
    modalMasterMicrofinance: false,
    modalMasterLeasing: false,
    modalMasterIncome: false,
    modalMasterExpenditure: false,
    modalMasterTenor: false,
    modalMasterApiKey: false,
    modalMasterUserDealer: false,
    modalMasterAssignDealer: false,
    modalMasterAddUser: false,
    modalChangePassword: false,
    modalChangePasswordAuthenticated: false,
    modalAuthenticationPassword: false,
    modalFakturDelivery: false,
    modalSamsat: false,
    modalDeliveryDealer: false,
    modalMasterBiro: false,
    modalMasterProvince: false,
    modalMasterCity: false,
    modalMasterDistrict: false,
    modalMasterSubDistrict: false,
    modalDeleteShippingOrder: false,
    modalMasterMotorVariant: false,
  },
  permissionUser: [],
  mainDealer: {},
  pageTitle: "",
};

const createStore = create((set) => ({
  ...initialState,

  setTitle: (name) =>
    set((state) => ({
      ...state,
      pageTitle: name,
    })),
  handle: (name, value) =>
    set((state) => ({
      ...state,
      [name]: value,
    })),
  handleModal: (name, value, items, type) =>
    set((state) => ({
      ...state,
      modal: {
        ...state.modal,
        [name]: value,
      },
      modalItem: items,
    })),
}));

export default createStore;
