import { downloadFile } from "../../utils/fileDownloader";
import React, { useState } from 'react';
import { Plus, Trash2, Calculator, GraduationCap, Award } from 'lucide-react';

export default function GpaCalculatorTool() {
  const [courses, setCourses] = useState([
    { name: 'Course 1', credits: 3, grade: 4.0 },
    { name: 'Course 2', credits: 4, grade: 3.7 },
    { name: 'Course 3', credits: 3, grade: 3.3 }
  ]);

  const GRADE_SCALE = [
    { label: 'A (4.0)', value: 4.0 },
    { label: 'A- (3.7)', value: 3.7 },
    { label: 'B+ (3.3)', value: 3.3 },
    { label: 'B (3.0)', value: 3.0 },
    { label: 'B- (2.7)', value: 2.7 },
    { label: 'C+ (2.3)', value: 2.3 },
    { label: 'C (2.0)', value: 2.0 },
    { label: 'D (1.0)', value: 1.0 },
    { label: 'F (0.0)', value: 0.0 }
  ];

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { name: `Course ${prev.length + 1}`, credits: 3, grade: 4.0 }
    ]);
  };

  const removeCourse = (index) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCourse = (index, field, value) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const totalCredits = courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
  const totalGradePoints = courses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0) * (parseFloat(c.grade) || 0), 0);
  const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  const percentageEstimate = (parseFloat(gpa) * 9.5).toFixed(1);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* GPA Result Box */}
      <div className="bg-gradient-to-tr from-[#3525cd] to-indigo-600 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1 justify-center sm:justify-start">
            <GraduationCap className="h-4 w-4" /> Estimated GPA Score
          </span>
          <div className="text-4xl font-mono font-black mt-1">{gpa} / 4.0</div>
          <p className="text-xs text-indigo-200 mt-1">Approx. {percentageEstimate}% Marks Equivalent</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center">
          <span className="text-[10px] uppercase font-bold text-indigo-200">Total Credits</span>
          <div className="text-2xl font-mono font-black">{totalCredits}</div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="h-4 w-4 text-[#3525cd]" /> Course Grade List
          </h3>
          <button
            onClick={addCourse}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#3525cd] text-white hover:bg-indigo-600 transition shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Course
          </button>
        </div>

        <div className="space-y-2">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80"
            >
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(idx, 'name', e.target.value)}
                placeholder="Course title"
                className="flex-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#3525cd]"
              />

              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={course.credits}
                  onChange={(e) => updateCourse(idx, 'credits', parseFloat(e.target.value) || 0)}
                  placeholder="Credits"
                  className="w-full bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 text-center focus:outline-none"
                />
              </div>

              <div className="w-32">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(idx, 'grade', parseFloat(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {GRADE_SCALE.map((g) => (
                    <option key={g.label} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {courses.length > 1 && (
                <button
                  onClick={() => removeCourse(idx)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                  title="Remove Course"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
