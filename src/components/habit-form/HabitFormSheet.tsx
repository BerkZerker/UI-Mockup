import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, Modal,
  TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../theme';
import { getHabitColor } from '../../theme/palette';
import { Habit, HabitColorId, DayOfWeek, TargetUnit, Category } from '../../types';
import { ColorPicker } from './ColorPicker';
import { DaySelector } from './DaySelector';
import { IconPicker } from './IconPicker';
import { TargetInput } from './TargetInput';

const CATEGORY_OPTIONS: Category[] = ['Wellness', 'Learning', 'Creative', 'Fitness', 'Finance'];

interface HabitFormSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  editHabit?: Habit;
}

function generateId(): string {
  return 'h-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

/** Modal form for creating or editing habits with progressive disclosure */
export function HabitFormSheet({ visible, onClose, onSave, editHabit }: HabitFormSheetProps) {
  const { theme, accent } = useTheme();

  const [title, setTitle] = useState('');
  const [colorId, setColorId] = useState<HabitColorId>('sage');
  const [icon, setIcon] = useState('');
  const [category, setCategory] = useState<Category>('Wellness');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [targetEnabled, setTargetEnabled] = useState(false);
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState<TargetUnit | null>(null);
  const [notes, setNotes] = useState('');
  const [expanded, setExpanded] = useState(false);

  // Reset form when opening / changing editHabit
  useEffect(() => {
    if (visible) {
      if (editHabit) {
        setTitle(editHabit.title);
        setColorId(editHabit.colorId);
        setIcon(editHabit.icon);
        setCategory(editHabit.category);
        setSelectedDays(editHabit.selectedDays);
        setTargetEnabled(editHabit.targetValue != null);
        setTargetValue(editHabit.targetValue?.toString() ?? '');
        setTargetUnit(editHabit.targetUnit);
        setNotes(editHabit.notes);
        setExpanded(true);
      } else {
        setTitle('');
        setColorId('sage');
        setIcon('');
        setCategory('Wellness');
        setSelectedDays([]);
        setTargetEnabled(false);
        setTargetValue('');
        setTargetUnit(null);
        setNotes('');
        setExpanded(false);
      }
    }
  }, [visible, editHabit]);

  const habitColor = getHabitColor(colorId);
  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const habit: Habit = {
      id: editHabit?.id ?? generateId(),
      title: title.trim(),
      colorId,
      icon,
      category,
      selectedDays,
      targetValue: targetEnabled && targetValue ? Number(targetValue) : null,
      targetUnit: targetEnabled ? targetUnit : null,
      notes: notes.trim(),
      createdAt: editHabit?.createdAt ?? new Date().toISOString(),
      reminderEnabled: false,
      reminderTime: null,
      archived: editHabit?.archived ?? false,
    };
    onSave(habit);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback>
              <View style={[styles.sheet, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {editHabit ? 'Edit Habit' : 'New Habit'}
                  </Text>
                  <Pressable
                    onPress={onClose}
                    accessibilityLabel="Close"
                    style={({ pressed }) => ({
                      padding: SPACING.xs,
                      opacity: pressed ? INTERACTIVE.pressedOpacityHeavy : 1,
                    })}
                  >
                    <X size={22} color={theme.textSecondary} />
                  </Pressable>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Title input */}
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Habit name"
                    placeholderTextColor={theme.textTertiary}
                    autoFocus={!editHabit}
                    style={[
                      styles.titleInput,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.pillBg,
                      },
                    ]}
                  />

                  {/* Color picker */}
                  <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Color</Text>
                  <ColorPicker selected={colorId} onSelect={setColorId} />

                  {/* Customize toggle */}
                  <Pressable
                    onPress={() => setExpanded(!expanded)}
                    style={({ pressed }) => [
                      styles.expandToggle,
                      { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
                    ]}
                  >
                    <Text style={[styles.expandText, { color: theme.textSecondary }]}>
                      Customize
                    </Text>
                    {expanded
                      ? <ChevronUp size={16} color={theme.textSecondary} />
                      : <ChevronDown size={16} color={theme.textSecondary} />
                    }
                  </Pressable>

                  {expanded && (
                    <View style={styles.expandedSection}>
                      {/* Frequency */}
                      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Frequency</Text>
                      <DaySelector selectedDays={selectedDays} onToggle={setSelectedDays} colorId={colorId} />

                      {/* Icon */}
                      <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: SPACING.xl }]}>Icon</Text>
                      <IconPicker selected={icon} onSelect={setIcon} colorId={colorId} />

                      {/* Category */}
                      <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: SPACING.xl }]}>Category</Text>
                      <View style={styles.categoryRow}>
                        {CATEGORY_OPTIONS.map(cat => (
                          <Pressable
                            key={cat}
                            onPress={() => setCategory(cat)}
                            style={({ pressed }) => [
                              styles.categoryPill,
                              {
                                backgroundColor: category === cat ? habitColor.muted : theme.pillBg,
                                opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
                              },
                            ]}
                          >
                            <Text style={[
                              styles.categoryText,
                              { color: category === cat ? habitColor.primary : theme.pillText },
                            ]}>
                              {cat}
                            </Text>
                          </Pressable>
                        ))}
                      </View>

                      {/* Target toggle */}
                      <Pressable
                        onPress={() => setTargetEnabled(!targetEnabled)}
                        style={({ pressed }) => [
                          styles.targetToggle,
                          {
                            backgroundColor: targetEnabled ? habitColor.faint : theme.pillBg,
                            opacity: pressed ? INTERACTIVE.pressedOpacity : 1,
                          },
                        ]}
                      >
                        <Text style={[styles.targetToggleText, { color: targetEnabled ? habitColor.primary : theme.pillText }]}>
                          {targetEnabled ? 'Target enabled' : 'Add target'}
                        </Text>
                      </Pressable>

                      {targetEnabled && (
                        <View style={{ marginTop: SPACING.md }}>
                          <TargetInput
                            value={targetValue}
                            unit={targetUnit}
                            onChangeValue={setTargetValue}
                            onChangeUnit={setTargetUnit}
                          />
                        </View>
                      )}

                      {/* Notes */}
                      <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: SPACING.xl }]}>Notes</Text>
                      <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Optional notes..."
                        placeholderTextColor={theme.textTertiary}
                        multiline
                        numberOfLines={3}
                        style={[
                          styles.notesInput,
                          {
                            color: theme.text,
                            borderColor: theme.border,
                            backgroundColor: theme.pillBg,
                          },
                        ]}
                      />
                    </View>
                  )}
                </ScrollView>

                {/* Create / Save button */}
                <Pressable
                  onPress={handleSave}
                  disabled={!canSave}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.saveButton,
                    {
                      backgroundColor: canSave ? habitColor.primary : theme.pillBg,
                      opacity: pressed ? INTERACTIVE.pressedOpacityLight : 1,
                    },
                  ]}
                >
                  <Text style={[styles.saveText, { color: canSave ? '#fff' : theme.textTertiary }]}>
                    {editHabit ? 'Save Changes' : 'Create Habit'}
                  </Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '88%',
    borderTopLeftRadius: RADIUS['3xl'],
    borderTopRightRadius: RADIUS['3xl'],
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 34, // safe area
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  titleInput: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.medium,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  sectionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.sm,
  },
  expandText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.medium,
  },
  expandedSection: {
    paddingBottom: SPACING.md,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryPill: {
    paddingVertical: SPACING.sm - 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  categoryText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  targetToggle: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  targetToggleText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.medium,
  },
  notesInput: {
    fontSize: FONT_SIZE.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  saveText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
