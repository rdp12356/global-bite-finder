'use client'

import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-600 dark:text-gray-400"
      >
        Discovering amazing restaurants...
      </motion.p>
    </div>
  )
}