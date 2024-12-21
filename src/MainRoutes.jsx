import { lazy } from "react";

const ShippingOrder = lazy(() => import("./pages/app/shipping/ShippingOrder"));
const ShippingOrderDetail = lazy(() =>
  import("./pages/app/shipping/detail/ShippingOrderDetail")
);
const UnitReturn = lazy(() => import("./pages/app/unit/UnitReturn"));
const UnitReturnDetail = lazy(() =>
  import("./pages/app/unit/detail/UnitReturnDetail")
);
const UnitStock = lazy(() => import("./pages/app/unit/UnitStock"));
const UnitStockDetail = lazy(() =>
  import("./pages/app/unit/detail/UnitStockDetail")
);
const MasterMainDealer = lazy(() => import("./pages/master/MainDealer"));
const MasterPoolingSource = lazy(() => import("./pages/master/PoolingSource"));
const MasterDealer = lazy(() => import("./pages/master/Dealer"));
const MasterDealerNeq = lazy(() => import("./pages/master/DealerNeq"));
const MasterMarital = lazy(() => import("./pages/master/Marital"));
const MasterHobbies = lazy(() => import("./pages/master/Hobbies"));
const MasterResidence = lazy(() => import("./pages/master/Residence"));
const MasterMotorBrand = lazy(() => import("./pages/master/MotorBrand"));
const MasterEducation = lazy(() => import("./pages/master/Education"));
const MasterOccupation = lazy(() => import("./pages/master/Occupation"));
const MasterSalesman = lazy(() => import("./pages/master/Salesman"));
const MasterMicrofinance = lazy(() => import("./pages/master/Microfinance"));
const MasterLeasing = lazy(() => import("./pages/master/Leasing"));
const MasterIncome = lazy(() => import("./pages/master/Income"));
const MasterExpenditure = lazy(() => import("./pages/master/Expenditure"));
const MasterTenor = lazy(() => import("./pages/master/Tenor"));
const MasterApiKey = lazy(() => import("./pages/master/ApiKey"));
const MasterMotor = lazy(() => import("./pages/master/Motor"));
const MasterColor = lazy(() => import("./pages/master/Color"));
const MasterUserMd = lazy(() => import("./pages/master/User"));
const MasterUserMdDetail = lazy(() =>
  import("./pages/master/Detail/DetailMasterUser")
);
const MasterProvince = lazy(() => import("./pages/master/Province"));
const MasterCity = lazy(() => import("./pages/master/City"));
const MasterDistrict = lazy(() => import("./pages/master/District"));
const MasterSubDistrict = lazy(() => import("./pages/master/SubDistrict"));
const DetailMasterApiKey = lazy(() =>
  import("./pages/master/Detail/DetailApiKey")
);
const FakturReceive = lazy(() => import("./pages/Biro/FakturReceive"));
const FakturDelivery = lazy(() => import("./pages/Biro/FakturDelivery"));
const FakturDeliveryAdd = lazy(() =>
  import("./pages/Biro/Form/FakturDelivery")
);
const FakturDeliveryDetail = lazy(() =>
  import("./pages/Biro/Detail/FakturDelivery")
);
const SamsatDelivery = lazy(() => import("./pages/Biro/SamsatDelivery"));
const SamsatDeliveryAdd = lazy(() =>
  import("./pages/Biro/Form/SamsatDelivery")
);
const SamsatDeliveryDetail = lazy(() =>
  import("./pages/Biro/Detail/SamsatDelivery")
);

const SamsatReceive = lazy(() => import("./pages/Biro/SamsatReceive"));
const SamsatReceiveAdd = lazy(() => import("./pages/Biro/Form/SamsatReceive"));
const SamsatReceiveDetail = lazy(() =>
  import("./pages/Biro/Detail/SamsatReceive")
);
const DeliveryToDealer = lazy(() => import("./pages/Biro/DeliveryDealer"));
const DeliveryToDealerAdd = lazy(() =>
  import("./pages/Biro/Form/DeliveryDealer")
);
const DeliveryToDealerDetail = lazy(() =>
  import("./pages/Biro/Detail/DeliveryDealer")
);
const BiroList = lazy(() => import("./pages/master/Biro"));
const DealerReceive = lazy(() => import("./pages/Biro/DealerReceive"));
const DealerReceiveDetail = lazy(() =>
  import("./pages/Biro/Detail/DealerReceive")
);
const UnitUpload = lazy(() => import("./pages/app/shipping/UnitUpload"));
const SpkDigital = lazy(() => import("./pages/app/database/SpkDigital"));
const MotorVaiant = lazy(() => import("./pages/master/MotorVariant"));

const unitRoutes = [
  {
    path: "shipping-order",
    component: ShippingOrder,
  },
  {
    path: "shipping-order/upload",
    component: UnitUpload,
  },
  {
    path: "shipping-order/:id",
    component: ShippingOrderDetail,
  },
  {
    path: "unit-return",
    component: UnitReturn,
  },
  {
    path: "unit-return/:id",
    component: UnitReturnDetail,
  },
  {
    path: "unit-order",
    component: UnitStock,
  },
  {
    path: "unit-order/:id",
    component: UnitStockDetail,
  },
];

const biroRoutes = [
  {
    path: "biro/faktur-receive",
    component: FakturReceive,
  },
  {
    path: "biro/faktur-delivery",
    component: FakturDelivery,
  },
  {
    path: "biro/faktur-delivery/add",
    component: FakturDeliveryAdd,
  },
  {
    path: "biro/faktur-delivery/:id",
    component: FakturDeliveryDetail,
  },
  {
    path: "biro/dealer-receive",
    component: DealerReceive,
  },
  {
    path: "biro/dealer-receive/:id",
    component: DealerReceiveDetail,
  },
  {
    path: "biro/samsat-delivery",
    component: SamsatDelivery,
  },
  {
    path: "biro/samsat-delivery/add",
    component: SamsatDeliveryAdd,
  },
  {
    path: "biro/samsat-delivery/:id",
    component: SamsatDeliveryDetail,
  },
  {
    path: "biro/samsat-receive",
    component: SamsatReceive,
  },
  {
    path: "biro/samsat-receive/add",
    component: SamsatReceiveAdd,
  },
  {
    path: "biro/samsat-receive/:id",
    component: SamsatReceiveDetail,
  },
  {
    path: "biro/delivery-dealer",
    component: DeliveryToDealer,
  },
  {
    path: "biro/delivery-dealer/add",
    component: DeliveryToDealerAdd,
  },
  {
    path: "biro/delivery-dealer/:id",
    component: DeliveryToDealerDetail,
  },
];

const masterDataRoutes = [
  {
    path: "master-data/main-dealer",
    component: MasterMainDealer,
  },
  {
    path: "master-data/dealer",
    component: MasterDealer,
  },
  {
    path: "master-data/dealer-neq",
    component: MasterDealerNeq,
  },
  {
    path: "master-data/pooling-source",
    component: MasterPoolingSource,
  },
  {
    path: "master-data/province",
    component: MasterProvince,
  },
  {
    path: "master-data/city",
    component: MasterCity,
  },
  {
    path: "master-data/district",
    component: MasterDistrict,
  },
  {
    path: "master-data/sub-district",
    component: MasterSubDistrict,
  },
  {
    path: "master-data/marital",
    component: MasterMarital,
  },
  {
    path: "master-data/hobbies",
    component: MasterHobbies,
  },
  {
    path: "master-data/residence",
    component: MasterResidence,
  },
  {
    path: "master-data/motor-brand",
    component: MasterMotorBrand,
  },
  {
    path: "master-data/education",
    component: MasterEducation,
  },
  {
    path: "master-data/occupation",
    component: MasterOccupation,
  },
  {
    path: "master-data/salesman",
    component: MasterSalesman,
  },
  {
    path: "master-data/microfinance",
    component: MasterMicrofinance,
  },
  {
    path: "master-data/leasing",
    component: MasterLeasing,
  },
  {
    path: "master-data/income",
    component: MasterIncome,
  },
  {
    path: "master-data/expenditure",
    component: MasterExpenditure,
  },
  {
    path: "master-data/tenor",
    component: MasterTenor,
  },
  {
    path: "master-data/api-key",
    component: MasterApiKey,
  },
  {
    path: "master-data/motor",
    component: MasterMotor,
  },
  {
    path: "master-data/color",
    component: MasterColor,
  },
  {
    path: "master-data/api-key/:id",
    component: DetailMasterApiKey,
  },
  {
    path: "master-data/biro",
    component: BiroList,
  },
  {
    path: "master-data/user",
    component: MasterUserMd,
  },
  {
    path: "master-data/motor-variant",
    component: MotorVaiant,
  },
  {
    path: "master-data/user/:id",
    component: MasterUserMdDetail,
  },
];

const databaseDataRoutes = [
  {
    path: "database-fixer/spk-digital",
    component: SpkDigital,
  },
];

const mainRoutes = [
  ...unitRoutes,
  ...masterDataRoutes,
  ...biroRoutes,
  ...databaseDataRoutes,
];

export default mainRoutes;
