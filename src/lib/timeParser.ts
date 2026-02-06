export interface TimeValue {
  hours: number;
  minutes: number;
  totalMinutes: number;
  isValid: boolean;
}

export function parseTimeString(input: string): TimeValue {
  if (!input.trim()) {
    return { hours: 0, minutes: 0, totalMinutes: 0, isValid: true };
  }

  const normalized = input.replace(/\s+/g, "");
  let index = 0;

  let totalMinutes = 0;
  let hasTokens = false;
  let hasInvalidTokens = false;

  while (index < normalized.length) {
    let sign = 1;
    while (index < normalized.length) {
      const char = normalized[index];
      if (char === "+") {
        index += 1;
        continue;
      }
      if (char === "-") {
        sign *= -1;
        index += 1;
        continue;
      }
      break;
    }

    const tokenStart = index;
    while (index < normalized.length && normalized[index] !== "+" && normalized[index] !== "-") {
      index += 1;
    }

    const rawToken = normalized.slice(tokenStart, index);
    if (!rawToken) {
      continue;
    }

    hasTokens = true;
    const tokenMinutes = parseTimeToken(rawToken);
    if (tokenMinutes === null) {
      hasInvalidTokens = true;
      continue;
    }

    totalMinutes += sign * tokenMinutes;
  }

  if (!hasTokens) {
    return { hours: 0, minutes: 0, totalMinutes: 0, isValid: false };
  }

  const absoluteMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const mins = Math.abs(totalMinutes) % 60;
  const sign = totalMinutes < 0 ? -1 : 1;

  return {
    hours: sign * hours,
    minutes: mins,
    totalMinutes,
    isValid: !hasInvalidTokens,
  };
}

function parseTimeToken(token: string): number | null {
  const trimmed = token.trim().replace(",", ".");
  if (!trimmed) return null;

  const numberPattern = /^(?:\d+(?:\.\d+)?|\.\d+)$/;
  const integerPattern = /^\d+$/;

  // Handle formats like :45 (just minutes).
  if (trimmed.startsWith(":")) {
    const minutesPart = trimmed.slice(1);
    if (!integerPattern.test(minutesPart)) {
      return null;
    }
    return Number.parseInt(minutesPart, 10);
  }

  // Handle formats like 1:30 (hours:minutes).
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":");
    if (parts.length !== 2) {
      return null;
    }

    const [hoursPart, minsPart] = parts;
    if (!numberPattern.test(hoursPart) || !integerPattern.test(minsPart)) {
      return null;
    }

    const hours = Number.parseFloat(hoursPart);
    const mins = Number.parseInt(minsPart, 10);
    if (mins >= 60) {
      return null;
    }

    return hours * 60 + mins;
  }

  // Handle plain numbers (treated as hours).
  if (!numberPattern.test(trimmed)) {
    return null;
  }

  return Number.parseFloat(trimmed) * 60;
}

export function parseDurationHours(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;

  if (normalized.startsWith(":")) {
    const minutesPart = normalized.slice(1);
    if (!/^\d+$/.test(minutesPart)) {
      return null;
    }
    return Number.parseInt(minutesPart, 10) / 60;
  }

  if (normalized.includes(":")) {
    const parts = normalized.split(":");
    if (parts.length !== 2) {
      return null;
    }

    const [hoursPart, minutesPart] = parts;
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(hoursPart) || !/^\d+$/.test(minutesPart)) {
      return null;
    }

    const hours = Number.parseFloat(hoursPart);
    const minutes = Number.parseInt(minutesPart, 10);
    if (minutes >= 60) {
      return null;
    }
    return hours + minutes / 60;
  }

  if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized)) {
    return null;
  }

  return Number.parseFloat(normalized);
}

export function formatTime(totalMinutes: number): string {
  const roundedTotal = Math.round(totalMinutes);
  const isNegative = roundedTotal < 0;
  const absMinutes = Math.abs(roundedTotal);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  
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
  const roundedTotal = Math.round(totalMinutes);
  const isNegative = roundedTotal < 0;
  const absMinutes = Math.abs(roundedTotal);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;
  
  const sign = isNegative ? '-' : '';
  const hourStr = hours === 1 ? 'hour' : 'hours';
  const minStr = mins === 1 ? 'minute' : 'minutes';
  
  if (hours === 0 && mins === 0) return '0 minutes';
  if (hours === 0) return `${sign}${mins} ${minStr}`;
  if (mins === 0) return `${sign}${hours} ${hourStr}`;
  return `${sign}${hours} ${hourStr} ${mins} ${minStr}`;
}
