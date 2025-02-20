import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import WorkoutList from "./pages/workouts/workout-list";
import Login from "./pages/account/Login";
import WorkoutDetails from "@/pages/workouts/workout-details";
import CreateWorkout from "@/pages/workouts/create-workout";
import Register from "@/pages/account/Register";
import Navbar from "./components/layout/Navbar";


const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/workouts" element={<WorkoutList />} />
                    <Route path="/workouts/:id" element={<WorkoutDetails />} />
                    <Route path="/create-workout" element={<CreateWorkout />} />
                </Routes>
                <ToastContainer position="top-center" autoClose={3000} />
            </div>
        </Router>
    );
};

export default App;




