import React from 'react'
import { X } from 'lucide-react'
import './FilterChip.css'

function FilterChip({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`filter-chip ${isActive ? 'filter-chip-active' : 'filter-chip-inactive'}`}
    >
      {label}
      {isActive && <X className="filter-close-icon" size={14} />}
    </button>
  )
}

export default FilterChip
