import { useState } from "react";
import { motion } from "framer-motion";
import { useCategories, useSubTypes } from "@/hooks/useCategories";
import { WorkoutCategory, WorkoutSubType, CATEGORY_ICONS } from "@/interfaces/categories";

interface CategorySelectorProps {
  selectedCategory?: number;
  selectedSubType?: number;
  onCategorySelect: (categoryId: number) => void;
  onSubTypeSelect: (subTypeId: number) => void;
  className?: string;
}

const CategorySelector = ({
  selectedCategory,
  selectedSubType,
  onCategorySelect,
  onSubTypeSelect,
  className = ""
}: CategorySelectorProps) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: subTypes, isLoading: subTypesLoading } = useSubTypes(selectedCategory || 0);

  if (categoriesLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (categoryId: number) => {
    return CATEGORY_ICONS[categoryId as keyof typeof CATEGORY_ICONS] || '🏋️';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Selection */}
      <div>
        <label className="block text-gray-600 text-sm font-medium mb-3">
          Workout Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories?.map((category) => (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => onCategorySelect(category.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                selectedCategory === category.id
                  ? 'border-teal-400 bg-teal-50 text-teal-700'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCategoryIcon(category.id)}</span>
                <div>
                  <div className="font-medium text-sm">{category.name}</div>
                  {category.description && (
                    <div className="text-xs opacity-70 mt-1 line-clamp-2">
                      {category.description}
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sub-type Selection */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-gray-600 text-sm font-medium mb-3">
            Workout Type
          </label>
          {subTypesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {subTypes?.map((subType) => (
                <motion.button
                  key={subType.id}
                  type="button"
                  onClick={() => onSubTypeSelect(subType.id)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-sm ${
                    selectedSubType === subType.id
                      ? 'border-teal-400 bg-teal-50 text-teal-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium">{subType.name}</div>
                  {subType.description && (
                    <div className="text-xs opacity-70 mt-1 line-clamp-1">
                      {subType.description}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CategorySelector;