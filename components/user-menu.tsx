'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Heart, LogOut, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { TasteProfileModal } from './taste-profile-modal'

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showTasteProfile, setShowTasteProfile] = useState(false)

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="hidden md:block text-sm font-medium">{user.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
          
          <div className="py-2">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Favorites</span>
            </button>
            
            <button 
              onClick={() => {
                setShowTasteProfile(true)
                setIsOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Taste Profile</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <User className="w-4 h-4" />
              <span className="text-sm">Account Settings</span>
            </button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}

      <TasteProfileModal
        isOpen={showTasteProfile}
        onClose={() => setShowTasteProfile(false)}
      />
    </div>
  )
}