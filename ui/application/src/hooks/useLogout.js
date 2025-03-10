"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogout = void 0;
var react_router_dom_1 = require("react-router-dom");
var react_toastify_1 = require("react-toastify");
var useLogout = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var logout = function () {
        localStorage.removeItem("token");
        react_toastify_1.toast.info("Logged out successfully.");
        navigate("/login");
    };
    return { logout: logout };
};
exports.useLogout = useLogout;
