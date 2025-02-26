import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/pages/account/login";
import Register from "@/pages/account/register";
import WorkoutList from "./pages/workouts/workout-list.tsx";
import WorkoutDetails from "@/pages/workouts/workout-details";
import CreateWorkout from "@/pages/workouts/create-workout";
import Navbar from "./components/layout/Navbar";
import PrivateRoute from "@/utils/private-route";
import Dashboard from "@/pages/dashboard/Dashboard";
import Analysis from "@/pages/analysis/Analysis";
const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/workouts" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/workouts" element={<WorkoutList />} />
                        <Route path="/workouts/:id" element={<WorkoutDetails />} />
                        <Route path="/create-workout" element={<CreateWorkout />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/analysis" element={<Analysis />} />
                    </Route>
                </Routes>
                <ToastContainer position="top-center" autoClose={3000} />
            </div>
        </Router>
    );
};

export default App;
