import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WorkoutList from "./pages/workouts/workout-list.tsx";
import Navbar from "./components/layout/Navbar";

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<WorkoutList />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
