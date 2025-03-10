"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var PrivateRoute = function () {
    var token = localStorage.getItem("token");
    return token ? <react_router_dom_1.Outlet /> : <react_router_dom_1.Navigate to="/login"/>;
};
exports.default = PrivateRoute;
