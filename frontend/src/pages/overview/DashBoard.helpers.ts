import { differenceInDays, isPast } from "date-fns";

export const getDaysRemaining = (
  endDateString: string | Date | null | undefined
) => {
  if (!endDateString) return "No date";

  const endDate = new Date(endDateString);
  const today = new Date();

  // Check if date is valid
  if (isNaN(endDate.getTime())) return "Invalid date";

  // If the date is in the past
  if (isPast(endDate)) {
    return `${Math.abs(differenceInDays(today, endDate))}d overdue`;
  }

  // If the date is today
  if (differenceInDays(endDate, today) === 0) {
    return "Today";
  }

  // Return days remaining
  return `${differenceInDays(endDate, today)}d`;
};
