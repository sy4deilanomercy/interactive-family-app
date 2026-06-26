const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

type DateFormat = "monthDay" | "monthDayYear" | "shortMonth" | "shortDate" | "monthYear";

export function formatDate(dateStr: string, format: DateFormat = "monthDay"): string {
  const parts = dateStr.split("T")[0].split("-");
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const year = parseInt(parts[0], 10);

  switch (format) {
    case "monthDay":
      return `${MONTHS[monthIdx]} ${day}`;
    case "monthDayYear":
      return `${MONTHS[monthIdx]} ${day}, ${year}`;
    case "shortMonth":
      return SHORT_MONTHS[monthIdx];
    case "shortDate":
      return `${SHORT_MONTHS[monthIdx]} ${day}, ${year}`;
    case "monthYear":
      return `${SHORT_MONTHS[monthIdx]} ${year}`;
  }
}
