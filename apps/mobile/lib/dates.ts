export function formatEuro(amount: number) {
  return `${amount.toFixed(2)}€`;
}

export function computeNextWindow(dayOfWeek: number, startTime: string, endTime: string) {
  const now = new Date();
  const currentDow = now.getDay();
  const daysAhead = (dayOfWeek - currentDow + 7) % 7;

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysAhead);

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = new Date(targetDate);
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date(targetDate);
  end.setHours(endHour, endMinute, 0, 0);

  if (start <= now) {
    start.setDate(start.getDate() + 7);
    end.setDate(end.getDate() + 7);
  }

  return {
    start,
    end
  };
}

export function formatDateTime(dateIso: string) {
  const date = new Date(dateIso);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
