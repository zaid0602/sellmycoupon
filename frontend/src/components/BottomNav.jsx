import React from 'react'
import { Home, Plus, BarChart3, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './BottomNav.css'

function BottomNav({ activeNav, setActiveNav }) {
  const navigate = useNavigate()

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'add', label: 'Add', icon: Plus, path: '/add' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ]

  const handleNavClick = (item) => {
    setActiveNav(item.id)
    navigate(item.path)
  }

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        <div className="bottom-nav-items">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
