export interface TimeValue {
  hours: number;
  minutes: number;
  totalMinutes: number;
}

export function parseTimeString(input: string): TimeValue {
  if (!input.trim()) {
    return { hours: 0, minutes: 0, totalMinutes: 0 };
  }

  // Normalize the input: replace multiple operators, handle spacing
  const normalized = input.replace(/\s+/g, '').replace(/--/g, '+').replace(/\+-|-\+/g, '-');
  
  // Split by + and - while keeping the operators
  const tokens: { value: string; operator: '+' | '-' }[] = [];
  let current = '';
  let currentOp: '+' | '-' = '+';
  
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (char === '+' || char === '-') {
      if (current) {
        tokens.push({ value: current, operator: currentOp });
      }
      current = '';
      currentOp = char as '+' | '-';
    } else {
      current += char;
    }
  }
  
  if (current) {
    tokens.push({ value: current, operator: currentOp });
  }

  let totalMinutes = 0;

  for (const token of tokens) {
    const minutes = parseTimeToken(token.value);
    if (token.operator === '+') {
      totalMinutes += minutes;
    } else {
      totalMinutes -= minutes;
    }
  }

  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const mins = Math.abs(totalMinutes) % 60;
  const sign = totalMinutes < 0 ? -1 : 1;

  return {
    hours: sign * hours,
    minutes: mins,
    totalMinutes,
  };
}

function parseTimeToken(token: string): number {
  const trimmed = token.trim();
  
  if (!trimmed) return 0;

  // Handle formats like :45 (just minutes)
  if (trimmed.startsWith(':')) {
    const mins = parseInt(trimmed.slice(1), 10);
    return isNaN(mins) ? 0 : mins;
  }

  // Handle formats like 1:30 (hours:minutes)
  if (trimmed.includes(':')) {
    const [hoursPart, minsPart] = trimmed.split(':');
    const hours = hoursPart ? parseFloat(hoursPart) : 0;
    const mins = minsPart ? parseInt(minsPart, 10) : 0;
    return (isNaN(hours) ? 0 : hours * 60) + (isNaN(mins) ? 0 : mins);
  }

  // Handle plain numbers (treated as hours)
  const num = parseFloat(trimmed);
  return isNaN(num) ? 0 : num * 60;
}

export function formatTime(totalMinutes: number): string {
  const isNegative = totalMinutes < 0;
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = Math.round(absMinutes % 60);
  
  const sign = isNegative ? '-' : '';
  return `${sign}${hours}:${mins.toString().padStart(2, '0')}`;
}

export function formatTimeDecimalHours(totalMinutes: number, fractionDigits = 2): string {
  const isNegative = totalMinutes < 0;
  const absMinutes = Math.abs(totalMinutes);
  const hours = absMinutes / 60;
  const sign = isNegative ? '-' : '';
  return `${sign}${hours.toFixed(fractionDigits)}h`;
}

export function formatTimeDecimalTenths(totalMinutes: number): string {
  const isNegative = totalMinutes < 0;
  const absMinutes = Math.abs(totalMinutes);
  const hours = absMinutes / 60;
  const rounded = Math.round(hours * 10) / 10;
  const sign = isNegative ? '-' : '';
  return `${sign}${rounded.toFixed(1)}h`;
}

export function formatTimeVerbose(totalMinutes: number): string {
  const isNegative = totalMinutes < 0;
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = Math.round(absMinutes % 60);
  
  const sign = isNegative ? '-' : '';
  const hourStr = hours === 1 ? 'hour' : 'hours';
  const minStr = mins === 1 ? 'minute' : 'minutes';
  
  if (hours === 0 && mins === 0) return '0 minutes';
  if (hours === 0) return `${sign}${mins} ${minStr}`;
  if (mins === 0) return `${sign}${hours} ${hourStr}`;
  return `${sign}${hours} ${hourStr} ${mins} ${minStr}`;
}
