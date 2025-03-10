"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
var login_1 = require("@/pages/account/login");
var register_1 = require("@/pages/account/register");
var workout_list_tsx_1 = require("./pages/workouts/workout-list.tsx");
var workout_details_1 = require("@/pages/workouts/workout-details");
var create_workout_1 = require("@/pages/workouts/create-workout");
var Navbar_1 = require("./components/layout/Navbar");
var private_route_1 = require("@/utils/private-route");
var Dashboard_1 = require("@/pages/dashboard/Dashboard");
var Analysis_1 = require("@/pages/analysis/Analysis");
var App = function () {
    return (<react_router_dom_1.BrowserRouter>
            <Navbar_1.default />
            <div className="container mx-auto p-4">
                <react_router_dom_1.Routes>
                    <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/workouts"/>}/>
                    <react_router_dom_1.Route path="/login" element={<login_1.default />}/>
                    <react_router_dom_1.Route path="/register" element={<register_1.default />}/>
                    <react_router_dom_1.Route element={<private_route_1.default />}>
                        <react_router_dom_1.Route path="/workouts" element={<workout_list_tsx_1.default />}/>
                        <react_router_dom_1.Route path="/workouts/:id" element={<workout_details_1.default />}/>
                        <react_router_dom_1.Route path="/create-workout" element={<create_workout_1.default />}/>
                        <react_router_dom_1.Route path="/dashboard" element={<Dashboard_1.default />}/>
                        <react_router_dom_1.Route path="/analysis" element={<Analysis_1.default />}/>
                    </react_router_dom_1.Route>
                </react_router_dom_1.Routes>
                <react_toastify_1.ToastContainer position="top-center" autoClose={3000}/>
            </div>
        </react_router_dom_1.BrowserRouter>);
};
exports.default = App;
