import { Habit } from '../types';

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Morning meditation', colorId: 'sage', streak: 12, completed: false, time: '7:00 AM', weekly: [1, 1, 1, 0, 1, 1, 0], hasVoiceNote: true },
  { id: '2', name: 'Drink 8 glasses water', colorId: 'teal', streak: 8, completed: true, time: 'All day', weekly: [1, 1, 0, 1, 1, 1, 1] },
  { id: '3', name: 'Read 20 pages', colorId: 'sky', streak: 5, completed: true, time: '8:30 PM', weekly: [1, 0, 1, 1, 0, 1, 1] },
  { id: '4', name: 'Journal entry', colorId: 'lavender', streak: 23, completed: false, time: '9:00 PM', weekly: [1, 1, 1, 1, 1, 1, 0], hasVoiceNote: true },
  { id: '5', name: 'Gym workout', colorId: 'coral', streak: 0, completed: false, time: '6:00 PM', weekly: [0, 1, 0, 1, 0, 0, 0] },
  { id: '6', name: 'Practice Spanish', colorId: 'amber', streak: 15, completed: false, time: '12:30 PM', weekly: [1, 1, 1, 0, 1, 1, 0] },
  { id: '7', name: 'Skincare routine', colorId: 'rose', streak: 31, completed: true, time: '10:00 PM', weekly: [1, 1, 1, 1, 1, 1, 1] },
  { id: '8', name: 'No phone before bed', colorId: 'slate', streak: 3, completed: false, time: '9:30 PM', weekly: [0, 0, 1, 1, 0, 1, 0], hasVoiceNote: true },
];
