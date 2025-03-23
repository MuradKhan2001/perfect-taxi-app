import Home from "./components/Home/Home";
import MainHome from "./components/admin/admin home/MainHome";
import Admin from "./components/admin/Admin/Admin";
import AboutUs from "./components/about-us/AboutUs";
import DriverForm from "./components/driver-form/DriverForm";
import LoginAdmin from "./components/login/LoginAdmin";
import Drivers from "./components/admin/drivers/Drivers";
import ChatDriver from "./components/admin/chat/ChatDriver";
import Clients from "./components/admin/clients/Clients";
import Colors from "./components/admin/colors/Colors";
import CarBrand from "./components/admin/car-brend/CarBrand";
import Service from "./components/admin/service/Service";
import Balance from "./components/admin/balance/Balance";
import Orders from "./components/admin/orders/Orders";
import CarModel from "./components/admin/car-model/CarModel";
import Payment from "./components/admin/payment/Payment";

export const publicRoutes = [
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/about-us",
        element: <AboutUs/>
    },
    {
        path: "/driver-form",
        element: <DriverForm/>
    },
    {
        path: "/login-admin-taxi",
        element: <LoginAdmin/>
    }

];

export const adminRoutes = [
    {
        path: "/*",
        element: <Admin/>
    },
];

export const adminPageRoutes = [
    {
        path: "/",
        element: <MainHome/>
    },
    {
        path: "/drivers",
        element: <Drivers/>
    },
    {
        path: "/clients",
        element: <Clients/>
    },
    {
        path: "/chat-drivers",
        element: <ChatDriver/>
    },
    {
        path: "/colors",
        element: <Colors/>
    },
    {
        path: "/car-brands",
        element: <CarBrand/>
    },
    {
        path: "/car-models",
        element: <CarModel/>
    },
    {
        path: "/service",
        element: <Service/>
    },
    {
        path: "/balance",
        element: <Balance/>
    },
    {
        path: "/orders",
        element: <Orders/>
    },
    {
        path: "/payment",
        element: <Payment/>
    },
];