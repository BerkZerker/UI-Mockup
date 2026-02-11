import * as Haptics from 'expo-haptics';

/** Trigger haptic feedback with a specified intensity */
export function triggerHaptic(type: 'light' | 'medium' | 'success') {
  try {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  } catch {
    // Haptics not available (e.g., simulator)
  }
}

/** Streak milestones that trigger celebrations */
export const MILESTONE_STREAKS = [7, 14, 30, 60, 90, 100, 365];

/** Check if a streak value is a milestone */
export function isMilestone(streak: number): boolean {
  return MILESTONE_STREAKS.includes(streak);
}

/** Get a celebration message for a milestone streak */
export function getMilestoneMessage(streak: number): string {
  if (streak >= 365) return '1 year streak!';
  if (streak >= 100) return '100 days!';
  if (streak >= 90) return '90 days!';
  if (streak >= 60) return '60 days!';
  if (streak >= 30) return '30-day streak!';
  if (streak >= 14) return '2-week streak!';
  if (streak >= 7) return '7-day streak!';
  return '';
}
