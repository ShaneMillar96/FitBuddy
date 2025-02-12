import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WorkoutList from "./pages/workouts/workout-list.tsx";
import WorkoutDetails from "@/pages/workouts/workout-details";
import Navbar from "./components/layout/Navbar";


const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<WorkoutList />} />
                    <Route path="/workouts/:id" element={<WorkoutDetails />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;




