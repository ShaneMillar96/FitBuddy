import { useState, useEffect } from "react";
import { useWorkoutTypes } from "@/hooks/useWorkoutTypes";
import { useScoreTypes } from "@/hooks/useScoreTypes";
import { useCreateWorkout } from "@/hooks/useCreateWorkout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import WorkoutBuilder from "@/components/workout/WorkoutBuilder";
import { CreateWorkoutExercise } from "@/interfaces/categories";
import { 
    WORKOUT_TYPES, 
    WorkoutTypeId, 
    WorkoutTypeData,
    EMOMWorkoutData,
    AMRAPWorkoutData,
    ForTimeWorkoutData,
    TabataWorkoutData,
    LadderWorkoutData
} from "@/interfaces/workout-types";
import { validateWorkout, getWorkoutTypeRequirements, getValidationTips } from "@/utils/workout-validation";
import { FaStar, FaClock, FaFlag, FaTrophy, FaSpinner, FaInfoCircle } from "react-icons/fa";


const CreateWorkout = () => {
    const navigate = useNavigate();
    const { data: workoutTypes, isLoading: typesLoading } = useWorkoutTypes();
    const { data: scoreTypes, isLoading: scoreTypesLoading } = useScoreTypes();
    const createWorkoutMutation = useCreateWorkout();
    
    // Form state
    const [name, setName] = useState("");
    const [typeId, setTypeId] = useState<number | null>(null);
    const [scoreTypeId, setScoreTypeId] = useState<number | null>(null);
    const [difficultyLevel, setDifficultyLevel] = useState<number | null>(null);
    const [estimatedDuration, setEstimatedDuration] = useState<number | undefined>();
    const [exercises, setExercises] = useState<CreateWorkoutExercise[]>([]);
    
    // Workout type specific data
    const [workoutTypeData, setWorkoutTypeData] = useState<WorkoutTypeData | null>(null);
    
    // UI state
    const [showValidation, setShowValidation] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    
    // Initialize workout type data based on selected type
    const initializeWorkoutTypeData = (workoutTypeId: WorkoutTypeId): WorkoutTypeData => {
        switch (workoutTypeId) {
            case WORKOUT_TYPES.EMOM:
                return { totalMinutes: 12, exercises: [] } as EMOMWorkoutData;
            case WORKOUT_TYPES.AMRAP:
                return { timeCapMinutes: 20, exercises: [] } as AMRAPWorkoutData;
            case WORKOUT_TYPES.FOR_TIME:
                return { totalRounds: 1, exercises: [] } as ForTimeWorkoutData;
            case WORKOUT_TYPES.TABATA:
                return { totalRounds: 1, exercises: [] } as TabataWorkoutData;
            case WORKOUT_TYPES.LADDER:
                return { ladderType: 'ascending', exercises: [] } as LadderWorkoutData;
            default:
                return { exercises: [] } as any;
        }
    };

    // Auto-focus on first load
    useEffect(() => {
        if (workoutTypes && workoutTypes.length > 0 && !typeId) {
            setTypeId(workoutTypes[0].id);
        }
    }, [workoutTypes, typeId]);

    // Handle workout type changes - reinitialize data when type changes
    useEffect(() => {
        if (typeId && Object.values(WORKOUT_TYPES).includes(typeId as WorkoutTypeId)) {
            const newWorkoutTypeData = initializeWorkoutTypeData(typeId as WorkoutTypeId);
            setWorkoutTypeData(newWorkoutTypeData);
            // Clear legacy exercises when switching to dynamic workout types
            setExercises([]);
        } else {
            // For non-dynamic workout types or no selection, clear workout type data
            setWorkoutTypeData(null);
        }
    }, [typeId]);

    // Validation helpers
    const validateForm = () => {
        const errors = [];
        if (!name.trim() || name.length < 3 || name.length > 25) {
            errors.push("Workout name must be between 3 and 25 characters");
        }
        if (!typeId) {
            errors.push("Please select a workout type");
        }
        
        // Check for exercises based on workout type
        if (workoutTypeData) {
            // For dynamic workout types, use specific validation
            if (typeId && Object.values(WORKOUT_TYPES).includes(typeId as WorkoutTypeId)) {
                const validationResult = validateWorkout(typeId as WorkoutTypeId, workoutTypeData);
                // Add validation errors
                validationResult.errors.forEach(error => {
                    errors.push(error.message);
                });
                // Show warnings as toast notifications (non-blocking)
                validationResult.warnings.forEach(warning => {
                    toast.warn(warning.message);
                });
            } else if (!workoutTypeData.exercises || workoutTypeData.exercises.length === 0) {
                errors.push("Please add at least one exercise");
            }
        } else {
            // For legacy workout types, check traditional exercises
            if (exercises.length === 0) {
                errors.push("Please add at least one exercise");
            }
        }
        
        return errors;
    };

    const isFormValid = () => validateForm().length === 0;

    const getCompletionPercentage = () => {
        let completed = 0;
        const total = 6;
        
        if (name.trim().length >= 3) completed++;
        if (typeId) completed++;
        if (scoreTypeId) completed++;
        if (difficultyLevel) completed++;
        if (estimatedDuration) completed++;
        
        // Check exercises based on workout type
        if (workoutTypeData) {
            if (workoutTypeData.exercises && workoutTypeData.exercises.length > 0) completed++;
        } else {
            if (exercises.length > 0) completed++;
        }
        
        return Math.round((completed / total) * 100);
    };

    const handleSubmit = () => {
        setShowValidation(true);
        const errors = validateForm();
        
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        // Prepare exercises data based on workout type
        const exercisesData = workoutTypeData ? workoutTypeData.exercises : exercises;

        const workoutData = {
            name: name.trim(),
            typeId: typeId!,
            scoreTypeId,
            difficultyLevel,
            estimatedDurationMinutes: estimatedDuration,
            exercises: exercisesData,
            workoutTypeData: workoutTypeData ? JSON.stringify(workoutTypeData) : undefined,  // Serialize workout-type specific data
        };

        createWorkoutMutation.mutate(workoutData, {
            onSuccess: () => {
                toast.success("Workout created successfully!");
                setTimeout(() => navigate("/"), 2000);
            },
            onError: (error) => {
                console.error("Error creating workout:", error);
                toast.error("Failed to create workout. Please try again.");
            },
        });
    };

    // Star rating component
    const StarRating = ({ value, onChange, label }: { value: number | null; onChange: (rating: number) => void; label: string }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`p-1 transition-colors ${
                            value && star <= value
                                ? "text-yellow-500 hover:text-yellow-600"
                                : "text-gray-300 hover:text-yellow-400"
                        }`}
                    >
                        <FaStar className="w-6 h-6" />
                    </button>
                ))}
            </div>
            {value && (
                <span className="text-sm text-gray-500">
                    {value === 1 && "Beginner"}
                    {value === 2 && "Easy"}
                    {value === 3 && "Moderate"}
                    {value === 4 && "Hard"}
                    {value === 5 && "Expert"}
                </span>
            )}
        </div>
    );

    if (typesLoading || scoreTypesLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-teal-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading workout options...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Enhanced Header with Progress */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                                    Create Workout
                                </h1>
                                <p className="text-gray-600 mt-1">Design a new workout to share with the community</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500 mb-1">Progress</div>
                                <div className="text-2xl font-bold text-teal-600">{getCompletionPercentage()}%</div>
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                                className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${getCompletionPercentage()}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex items-center mb-6">
                                <FaInfoCircle className="text-teal-500 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                            </div>
                            
                            {/* Workout Name */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Workout Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter a catchy workout name..."
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                                        showValidation && (!name.trim() || name.length < 3 || name.length > 25)
                                            ? "border-red-300 bg-red-50 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-teal-500"
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                />
                                <div className="flex justify-between mt-1">
                                    <span className={`text-xs ${
                                        showValidation && (!name.trim() || name.length < 3 || name.length > 25)
                                            ? "text-red-500"
                                            : "text-gray-500"
                                    }`}>
                                        {name.length < 3 ? "At least 3 characters required" : ""}
                                    </span>
                                    <span className="text-xs text-gray-400">{name.length}/25</span>
                                </div>
                            </div>

                            {/* Workout Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Workout Type *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {workoutTypes?.map((type) => (
                                        <motion.button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setTypeId(type.id)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                                                typeId === type.id
                                                    ? "border-teal-500 bg-teal-50 text-teal-700"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                            }`}
                                        >
                                            <div className="font-medium">{type.name}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Score Type */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Score Type
                                </label>
                                <select
                                    value={scoreTypeId || ""}
                                    onChange={(e) => setScoreTypeId(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                                >
                                    <option value="">Select how this workout is scored</option>
                                    {scoreTypes?.map((scoreType) => (
                                        <option key={scoreType.id} value={scoreType.id}>
                                            {scoreType.name} - {scoreType.description}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty Level */}
                            <div className="mb-6">
                                <StarRating
                                    value={difficultyLevel}
                                    onChange={setDifficultyLevel}
                                    label="Difficulty Level"
                                />
                            </div>

                            {/* Estimated Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaClock className="inline mr-2" />
                                    Estimated Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="600"
                                    value={estimatedDuration || ""}
                                    onChange={(e) => setEstimatedDuration(e.target.value ? Number(e.target.value) : undefined)}
                                    placeholder="How long will this take?"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                                />
                            </div>
                        </motion.div>

                        {/* Exercise Builder Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex items-center mb-6">
                                <FaTrophy className="text-teal-500 mr-3" />
                                <h2 className="text-xl font-semibold text-gray-800">Workout Exercises</h2>
                                {((workoutTypeData && workoutTypeData.exercises.length > 0) || exercises.length > 0) && (
                                    <span className="ml-auto bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {workoutTypeData ? workoutTypeData.exercises.length : exercises.length} exercises
                                    </span>
                                )}
                            </div>
                            
                            <WorkoutBuilder
                                exercises={exercises}
                                onExercisesChange={setExercises}
                                workoutTypeId={typeId && Object.values(WORKOUT_TYPES).includes(typeId as WorkoutTypeId) ? typeId as WorkoutTypeId : undefined}
                                onWorkoutTypeDataChange={setWorkoutTypeData}
                            />
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Tips */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-100"
                        >
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <FaFlag className="text-teal-500 mr-2" />
                                Quick Tips
                            </h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                {/* General tips */}
                                <div className="flex items-start">
                                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Choose a memorable name that describes the workout style</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>Set appropriate difficulty based on your target audience</span>
                                </div>
                                
                                {/* Workout-type specific tips */}
                                {typeId && Object.values(WORKOUT_TYPES).includes(typeId as WorkoutTypeId) && (
                                    <>
                                        {getValidationTips(typeId as WorkoutTypeId).map((tip, index) => (
                                            <div key={index} className="flex items-start">
                                                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span>{tip}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                                
                                {/* Default tips for non-dynamic workout types */}
                                {(!typeId || !Object.values(WORKOUT_TYPES).includes(typeId as WorkoutTypeId)) && (
                                    <>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span>Include 3-8 exercises for optimal workout flow</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span>Add weight descriptions like "bodyweight" or "moderate load"</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <button
                                onClick={handleSubmit}
                                disabled={createWorkoutMutation.isPending || !isFormValid()}
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                                    createWorkoutMutation.isPending || !isFormValid()
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                                }`}
                            >
                                {createWorkoutMutation.isPending ? (
                                    <span className="flex items-center justify-center">
                                        <FaSpinner className="animate-spin mr-2" />
                                        Creating Workout...
                                    </span>
                                ) : (
                                    "Create Workout"
                                )}
                            </button>
                            
                            {/* Validation Summary */}
                            {showValidation && !isFormValid() && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="text-sm text-red-700">
                                        <div className="font-medium mb-1">Please complete:</div>
                                        <ul className="list-disc list-inside space-y-1">
                                            {validateForm().map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkout;