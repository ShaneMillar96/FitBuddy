"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./index.css");
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_query_1 = require("@tanstack/react-query");
var App_1 = require("./App");
var queryClient = new react_query_1.QueryClient();
client_1.default.createRoot(document.getElementById("root")).render(<react_1.default.StrictMode>
        <react_query_1.QueryClientProvider client={queryClient}> 
            <App_1.default />
        </react_query_1.QueryClientProvider>
    </react_1.default.StrictMode>);
