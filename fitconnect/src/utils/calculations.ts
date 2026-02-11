/**
 * Utility functions for calculations
 */

/**
 * Calculate BMI (Body Mass Index)
 * @param weight - Weight in kilograms
 * @param height - Height in centimeters
 * @returns BMI value rounded to 1 decimal place
 */
export const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height || height === 0) return 0;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category
 * @param bmi - BMI value
 * @returns BMI category string
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Format time slot for display
 * @param startTime - Start time in HH:MM format
 * @param endTime - End time in HH:MM format
 * @returns Formatted time slot string
 */
export const formatTimeSlot = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

/**
 * Check if a time slot overlaps with existing slots
 * @param newSlot - New time slot to check
 * @param existingSlots - Array of existing time slots
 * @returns true if there's an overlap
 */
export const hasTimeSlotOverlap = (
  newSlot: { startTime: string; endTime: string },
  existingSlots: { startTime: string; endTime: string }[]
): boolean => {
  return existingSlots.some((slot) => {
    const newStart = timeToMinutes(newSlot.startTime);
    const newEnd = timeToMinutes(newSlot.endTime);
    const existingStart = timeToMinutes(slot.startTime);
    const existingEnd = timeToMinutes(slot.endTime);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
};

/**
 * Convert HH:MM time to minutes since midnight
 * @param time - Time in HH:MM format
 * @returns Minutes since midnight
 */
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
