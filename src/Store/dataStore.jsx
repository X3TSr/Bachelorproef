import { create } from 'zustand'
import { useUserStore } from './userStore'

// Provide a compatibility alias so other modules importing useDataStore keep working
export { useUserStore as useDataStore } from './userStore';
