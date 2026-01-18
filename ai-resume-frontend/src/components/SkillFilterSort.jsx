import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown, ArrowUpDown, Sliders } from 'lucide-react';

export default function SkillFilterSort({ skills, onFilterApply }) {
  const [minCount, setMinCount] = useState(0);
  const [maxCount, setMaxCount] = useState(null);
  const [sortBy, setSortBy] = useState('frequency');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const maxSkillCount = useMemo(() => {
    return Math.max(...Object.values(skills), 0);
  }, [skills]);

  // Set maxCount to maxSkillCount by default
  const effectiveMaxCount = maxCount === null ? maxSkillCount : maxCount;

  const skillCategories = {
    'Programming Languages': ['Python', 'Java', 'JavaScript', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'TypeScript'],
    'Web Technologies': ['React', 'Angular', 'Vue', 'HTML', 'CSS', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI'],
    'Databases': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Cassandra', 'Firebase', 'DynamoDB'],
    'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git', 'Linux'],
    'Data & AI': ['Machine Learning', 'Deep Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau'],
    'Soft Skills': ['Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Project Management', 'Agile', 'Scrum']
  };

  const getCategoryForSkill = (skill) => {
    for (const [category, skillList] of Object.entries(skillCategories)) {
      if (skillList.some(s => skill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(skill.toLowerCase()))) {
        return category;
      }
    }
    return 'Other';
  };

  const filteredAndSorted = useMemo(() => {
    let result = { ...skills };
    
    // Filter by count range
    result = Object.fromEntries(
      Object.entries(result).filter(([_, count]) => count >= minCount && count <= effectiveMaxCount)
    );

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = Object.fromEntries(
        Object.entries(result).filter(([skill]) => skill.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = Object.fromEntries(
        Object.entries(result).filter(([skill]) => getCategoryForSkill(skill) === selectedCategory)
      );
    }
    
    // Sort
    const sorted = Object.entries(result).sort((a, b) => {
      if (sortBy === 'frequency') {
        return order === 'desc' ? b[1] - a[1] : a[1] - b[1];
      } else {
        return order === 'desc'
          ? b[0].localeCompare(a[0])
          : a[0].localeCompare(b[0]);
      }
    });
    
    return Object.fromEntries(sorted);
  }, [skills, minCount, effectiveMaxCount, sortBy, order, searchTerm, selectedCategory]);

  const handleApplyFilters = () => {
    onFilterApply?.(filteredAndSorted);
  };

  const stats = {
    total: Object.keys(skills).length,
    filtered: Object.keys(filteredAndSorted).length,
    maxCount: maxSkillCount,
    avgCount: Object.values(skills).length > 0
      ? (Object.values(skills).reduce((a, b) => a + b, 0) / Object.values(skills).length).toFixed(1)
      : 0
  };

  return (
    <div className="space-y-4 bg-white rounded-xl shadow-lg p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Total Skills</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Highest Freq</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{stats.maxCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Average</p>
          <p className="text-3xl font-bold text-purple-700 mt-2">{stats.avgCount}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">Filtered</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">{stats.filtered}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
        />
      </div>

      {/* Filter Controls */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full mb-4 font-semibold text-gray-800 hover:text-indigo-600 transition"
        >
          <span className="flex items-center">
            <Sliders className="w-5 h-5 mr-2" />
            Advanced Filters
          </span>
          <ChevronDown className={`w-5 h-5 transition transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Skill Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {Object.keys(skillCategories).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Count Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency Range: <span className="text-indigo-600 font-bold">{minCount}</span> - <span className="text-indigo-600 font-bold">{effectiveMaxCount}</span>
              </label>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Min Occurrences</p>
                  <input
                    type="range"
                    min="0"
                    max={Math.max(maxSkillCount, 1)}
                    value={minCount}
                    onChange={(e) => setMinCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Max Occurrences</p>
                  <input
                    type="range"
                    min={minCount}
                    max={Math.max(maxSkillCount, 1)}
                    value={effectiveMaxCount}
                    onChange={(e) => setMaxCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="frequency">Frequency</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleApplyFilters}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
          </div>
        )}
      </div>

      {/* Filtered Results */}
      {Object.keys(filteredAndSorted).length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">
            Filtered Results ({Object.keys(filteredAndSorted).length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filteredAndSorted).slice(0, 20).map(([skill, count]) => (
              <div
                key={skill}
                className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200 hover:bg-indigo-100 transition"
              >
                {skill} <span className="text-indigo-600 font-bold ml-1">×{count}</span>
              </div>
            ))}
          </div>
          {Object.keys(filteredAndSorted).length > 20 && (
            <p className="text-xs text-gray-500 mt-2">
              +{Object.keys(filteredAndSorted).length - 20} more skills
            </p>
          )}
        </div>
      )}
    </div>
  );
}
