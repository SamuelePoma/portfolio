export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
  /** How close to the target counts as arrived. */
  restDelta?: number;
  /** How slow counts as stopped, in units per second. */
  restSpeed?: number;
}

export interface SpringState {
  position: number;
  velocity: number;
}

/**
 * Advances a damped spring by `seconds` towards `target`. Solved exactly rather than
 * stepped, so a long or uneven frame never makes it overshoot or blow up.
 */
export function stepSpring(
  { position, velocity }: SpringState,
  target: number,
  seconds: number,
  { stiffness, damping, mass = 1 }: SpringConfig,
): SpringState {
  const offset = position - target;
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const t = seconds;

  if (zeta < 1) {
    // Underdamped: it oscillates inside a shrinking envelope.
    const decay = zeta * omega;
    const frequency = omega * Math.sqrt(1 - zeta * zeta);
    const envelope = Math.exp(-decay * t);
    const a = offset;
    const b = (velocity + decay * offset) / frequency;
    const cos = Math.cos(frequency * t);
    const sin = Math.sin(frequency * t);
    return {
      position: target + envelope * (a * cos + b * sin),
      velocity: envelope * ((b * frequency - decay * a) * cos - (a * frequency + decay * b) * sin),
    };
  }

  if (zeta === 1) {
    // Critically damped: the quickest approach that never overshoots.
    const b = velocity + omega * offset;
    const envelope = Math.exp(-omega * t);
    return {
      position: target + envelope * (offset + b * t),
      velocity: envelope * (velocity - omega * b * t),
    };
  }

  // Overdamped: two decaying terms, no oscillation.
  const root = omega * Math.sqrt(zeta * zeta - 1);
  const fast = -zeta * omega - root;
  const slow = -zeta * omega + root;
  const c2 = (velocity - slow * offset) / (fast - slow);
  const c1 = offset - c2;
  return {
    position: target + c1 * Math.exp(slow * t) + c2 * Math.exp(fast * t),
    velocity: c1 * slow * Math.exp(slow * t) + c2 * fast * Math.exp(fast * t),
  };
}

/** True once the spring is close enough to its target and slow enough to stop. */
export function isAtRest(
  { position, velocity }: SpringState,
  target: number,
  { restDelta = 0.01, restSpeed = restDelta * 10 }: SpringConfig,
): boolean {
  return Math.abs(position - target) < restDelta && Math.abs(velocity) < restSpeed;
}
