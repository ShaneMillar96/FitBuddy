import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTimes, 
  FaChevronDown, 
  FaChevronUp,
  FaStar,
  FaClock,
  FaUser,
  FaDumbbell
} from "react-icons/fa";
import { useCategories } from "@/hooks/useCategories";
import { useAvailableEquipment } from "@/hooks/useWorkouts";
import { CATEGORY_ICONS } from "@/interfaces/categories";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    categories: number[];
    subTypes: number[];
    difficulty: [number, number];
    duration: [number, number];
    equipment: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const WorkoutFilterPanel = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange
}: FilterPanelProps) => {
  const { data: categories } = useCategories();
  const { data: availableEquipment } = useAvailableEquipment();
  const [expandedSections, setExpandedSections] = useState<string[]>(['categories', 'difficulty']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const difficultyLabels = {
    1: 'Beginner',
    2: 'Easy',
    3: 'Moderate', 
    4: 'Hard',
    5: 'Expert'
  };

  const durationLabels = {
    0: '0min',
    15: '15min',
    30: '30min',
    45: '45min',
    60: '60min',
    90: '90min',
    120: '120min+'
  };


  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleCategory = (categoryId: number) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    updateFilter('categories', newCategories);
  };

  const toggleEquipment = (equipment: string) => {
    const newEquipment = filters.equipment.includes(equipment)
      ? filters.equipment.filter(e => e !== equipment)
      : [...filters.equipment, equipment];
    updateFilter('equipment', newEquipment);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:relative lg:bg-transparent lg:z-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto lg:relative lg:w-full lg:shadow-none lg:bg-gray-50 lg:rounded-xl lg:h-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 lg:bg-gray-50 lg:border-none">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Filter Sections */}
          <div className="p-6 space-y-6">
            {/* Categories */}
            <div>
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full mb-4"
              >
                <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <FaDumbbell className="text-teal-600" />
                  <span>Categories</span>
                </h3>
                {expandedSections.includes('categories') ? 
                  <FaChevronUp className="text-gray-400" /> : 
                  <FaChevronDown className="text-gray-400" />
                }
              </button>
              
              <AnimatePresence>
                {expandedSections.includes('categories') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3"
                  >
                    {categories?.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-2xl">
                          {CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS]}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-xs text-gray-500">{category.description}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Difficulty Range */}
            <div>
              <button
                onClick={() => toggleSection('difficulty')}
                className="flex items-center justify-between w-full mb-4"
              >
                <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <FaStar className="text-yellow-500" />
                  <span>Difficulty</span>
                </h3>
                {expandedSections.includes('difficulty') ? 
                  <FaChevronUp className="text-gray-400" /> : 
                  <FaChevronDown className="text-gray-400" />
                }
              </button>

              <AnimatePresence>
                {expandedSections.includes('difficulty') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="px-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{difficultyLabels[filters.difficulty[0] as keyof typeof difficultyLabels]}</span>
                        <span>{difficultyLabels[filters.difficulty[1] as keyof typeof difficultyLabels]}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={filters.difficulty[0]}
                          onChange={(e) => updateFilter('difficulty', [parseInt(e.target.value), filters.difficulty[1]])}
                          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={filters.difficulty[1]}
                          onChange={(e) => updateFilter('difficulty', [filters.difficulty[0], parseInt(e.target.value)])}
                          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    {/* Difficulty Quick Selects */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(difficultyLabels).map(([level, label]) => (
                        <button
                          key={level}
                          onClick={() => updateFilter('difficulty', [parseInt(level), parseInt(level)])}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filters.difficulty[0] === parseInt(level) && filters.difficulty[1] === parseInt(level)
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Duration */}
            <div>
              <button
                onClick={() => toggleSection('duration')}
                className="flex items-center justify-between w-full mb-4"
              >
                <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <FaClock className="text-blue-600" />
                  <span>Duration</span>
                </h3>
                {expandedSections.includes('duration') ? 
                  <FaChevronUp className="text-gray-400" /> : 
                  <FaChevronDown className="text-gray-400" />
                }
              </button>

              <AnimatePresence>
                {expandedSections.includes('duration') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="px-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{filters.duration[0]}min</span>
                        <span>{filters.duration[1] >= 120 ? '120min+' : `${filters.duration[1]}min`}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="120"
                          step="15"
                          value={filters.duration[0]}
                          onChange={(e) => updateFilter('duration', [parseInt(e.target.value), filters.duration[1]])}
                          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="120"
                          step="15"
                          value={filters.duration[1]}
                          onChange={(e) => updateFilter('duration', [filters.duration[0], parseInt(e.target.value)])}
                          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Duration Quick Selects */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateFilter('duration', [0, 15])}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Quick (&lt;15min)
                      </button>
                      <button
                        onClick={() => updateFilter('duration', [15, 30])}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Short (15-30min)
                      </button>
                      <button
                        onClick={() => updateFilter('duration', [30, 60])}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Medium (30-60min)
                      </button>
                      <button
                        onClick={() => updateFilter('duration', [60, 120])}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Long (60min+)
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Equipment */}
            <div>
              <button
                onClick={() => toggleSection('equipment')}
                className="flex items-center justify-between w-full mb-4"
              >
                <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <span>🔧</span>
                  <span>Equipment</span>
                </h3>
                {expandedSections.includes('equipment') ? 
                  <FaChevronUp className="text-gray-400" /> : 
                  <FaChevronDown className="text-gray-400" />
                }
              </button>

              <AnimatePresence>
                {expandedSections.includes('equipment') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3"
                  >
                    {availableEquipment?.map((equipment) => (
                      <label
                        key={equipment}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filters.equipment.includes(equipment)}
                          onChange={() => toggleEquipment(equipment)}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                          {equipment}
                        </span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <button
              onClick={() => {
                onFiltersChange({
                  categories: [],
                  subTypes: [],
                  difficulty: [1, 5],
                  duration: [0, 120],
                  equipment: []
                });
              }}
              className="w-full py-3 text-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkoutFilterPanel;