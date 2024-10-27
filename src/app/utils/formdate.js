// utils/formatDate.js

export function formatDate(isoString) {
  const date = new Date(isoString);

  // Define an array of month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract month, day, and year
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Format as "Mon-DD-YYYY"
  return `${month}-${day}-${year}`;
}
