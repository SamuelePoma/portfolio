// @vitest-environment jsdom

import { frame } from "@/lib/motion/frame";
import { interpolate } from "@/lib/motion/interpolate";
import { scrollProgress } from "@/lib/motion/scroll";
import { isAtRest, type SpringConfig, stepSpring } from "@/lib/motion/spring";
import { buildStyle } from "@/lib/motion/style";
import { MotionValue } from "@/lib/motion/value";

describe("MotionValue", () => {
  it("notifies listeners of changes only, until they stop listening", () => {
    const value = new MotionValue(0);
    const seen: number[] = [];
    const stop = value.on((next) => seen.push(next));
    value.set(1);
    value.set(1);
    value.set(2);
    stop();
    value.set(3);
    expect(seen).toEqual([1, 2]);
    expect(value.get()).toBe(3);
  });
});

describe("interpolate", () => {
  it("maps numbers through a track and holds outside it", () => {
    const map = interpolate([0, 0.5, 1], [10, 20, 0]);
    expect(map(-1)).toBe(10);
    expect(map(0.25)).toBe(15);
    expect(map(0.5)).toBe(20);
    expect(map(0.75)).toBe(10);
    expect(map(2)).toBe(0);
  });

  it("interpolates every number inside strings of one shape", () => {
    expect(interpolate([0, 1], ["0vh", "-12vh"])(0.5)).toBe("-6vh");
    const clip = interpolate(
      [0, 1],
      ["inset(10% 14% 10% 14% round 24px)", "inset(0% 0% 0% 0% round 24px)"],
    );
    expect(clip(0.5)).toBe("inset(5% 7% 5% 7% round 24px)");
    expect(interpolate([0, 1], ["blur(10px)", "blur(0px)"])(0.75)).toBe("blur(2.5px)");
  });

  it("rounds instead of writing exponents", () => {
    expect(interpolate([0, 1], ["0px", "1px"])(1e-9)).toBe("0px");
  });

  it("jumps at a stop of zero length", () => {
    const map = interpolate([0, 0.5, 0.5, 1], [0, 1, 5, 5]);
    expect(map(0.5)).toBe(1);
    expect(map(0.6)).toBe(5);
  });

  it("rejects tracks it can't follow", () => {
    expect(() => interpolate([0], [1])).toThrow();
    expect(() => interpolate([0, 1], [1])).toThrow();
    expect(() => interpolate([0, 1], ["0px", "1vh"])).toThrow(/differ in shape/);
  });
});

describe("springs", () => {
  const settle = (config: SpringConfig, seconds = 3) => {
    let state = { position: 0, velocity: 0 };
    let peak = 0;
    for (let time = 0; time < seconds; time += 1 / 60) {
      state = stepSpring(state, 1, 1 / 60, config);
      peak = Math.max(peak, state.position);
    }
    return { state, peak };
  };

  it.each([
    ["underdamped", { stiffness: 264, damping: 10 }],
    ["critically damped", { stiffness: 100, damping: 20 }],
    ["overdamped", { stiffness: 140, damping: 14.5, mass: 0.35 }],
  ])("a %s spring arrives", (_, config) => {
    const { state } = settle(config);
    expect(state.position).toBeCloseTo(1, 3);
    expect(isAtRest(state, 1, config)).toBe(true);
  });

  it("overshoots only when underdamped", () => {
    expect(settle({ stiffness: 264, damping: 10 }).peak).toBeGreaterThan(1);
    expect(settle({ stiffness: 100, damping: 20 }).peak).toBeLessThanOrEqual(1);
    expect(settle({ stiffness: 140, damping: 14.5, mass: 0.35 }).peak).toBeLessThanOrEqual(1);
  });

  it("gives the same answer in one long step as in many short ones", () => {
    const config = { stiffness: 140, damping: 14.5, mass: 0.35 };
    const long = stepSpring({ position: 0, velocity: 0 }, 1, 0.1, config);
    let short = { position: 0, velocity: 0 };
    for (let step = 0; step < 10; step += 1) short = stepSpring(short, 1, 0.01, config);
    expect(long.position).toBeCloseTo(short.position, 10);
    expect(long.velocity).toBeCloseTo(short.velocity, 10);
  });

  it("isn't at rest while it is still moving", () => {
    const config = { stiffness: 100, damping: 20, restDelta: 0.01 };
    expect(isAtRest({ position: 1, velocity: 5 }, 1, config)).toBe(false);
    expect(isAtRest({ position: 0.5, velocity: 0 }, 1, config)).toBe(false);
  });
});

describe("scrollProgress", () => {
  const viewport = 800;

  it("runs from 0 to 1 while a pinned section scrolls past", () => {
    const pinned = ["start start", "end end"] as const;
    expect(scrollProgress({ top: 100, height: 2400 }, viewport, pinned)).toBe(0);
    expect(scrollProgress({ top: -800, height: 2400 }, viewport, pinned)).toBe(0.5);
    expect(scrollProgress({ top: -3000, height: 2400 }, viewport, pinned)).toBe(1);
  });

  it("reads centre and fractional edges", () => {
    const entering = ["start end", "center center"] as const;
    expect(scrollProgress({ top: 800, height: 400 }, viewport, entering)).toBe(0);
    expect(scrollProgress({ top: 200, height: 400 }, viewport, entering)).toBe(1);
    expect(scrollProgress({ top: 500, height: 400 }, viewport, entering)).toBe(0.5);
    const passing = ["start 0.75", "end 0.55"] as const;
    expect(scrollProgress({ top: 600, height: 400 }, viewport, passing)).toBe(0);
  });

  it("jumps when the track has no length", () => {
    const flat = ["start start", "start start"] as const;
    expect(scrollProgress({ top: 10, height: 100 }, viewport, flat)).toBe(0);
    expect(scrollProgress({ top: -10, height: 100 }, viewport, flat)).toBe(1);
  });

  it("rejects an edge it doesn't know", () => {
    expect(() =>
      scrollProgress({ top: 0, height: 1 }, viewport, ["start middle" as "start end", "end end"]),
    ).toThrow(/Unknown scroll edge/);
  });
});

describe("buildStyle", () => {
  it("joins transform shorthands in a fixed order with default units", () => {
    expect(buildStyle({ rotateY: 16, opacity: 0.5, x: "62%", scale: 0.9, z: -40 })).toEqual({
      opacity: 0.5,
      transform: "translateX(62%) translateZ(-40px) scale(0.9) rotateY(16deg)",
    });
  });

  it("leaves out identity values, down to none", () => {
    expect(buildStyle({ x: 0, y: "0vh", scale: 1, rotateX: 4 })).toEqual({
      transform: "rotateX(4deg)",
    });
    expect(buildStyle({ x: 0, scale: 1 })).toEqual({ transform: "none" });
  });

  it("adds no transform to a style without shorthands", () => {
    expect(buildStyle({ opacity: 1, clipPath: "inset(0%)" })).toEqual({
      opacity: 1,
      clipPath: "inset(0%)",
    });
  });
});

describe("frame", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reads, then updates, then renders, once per job and frame", () => {
    const calls: string[] = [];
    const render = () => calls.push("render");
    const update = () => {
      calls.push("update");
      frame.render(render);
    };
    const read = () => {
      calls.push("read");
      frame.update(update);
    };
    frame.render(render);
    frame.read(read);
    frame.read(read);
    vi.advanceTimersToNextFrame();
    expect(calls).toEqual(["read", "update", "render"]);
  });

  it("runs a job that queues itself again on the next frame", () => {
    let runs = 0;
    const job = () => {
      runs += 1;
      if (runs < 3) frame.update(job);
    };
    frame.update(job);
    vi.advanceTimersToNextFrame();
    expect(runs).toBe(1);
    vi.advanceTimersToNextFrame();
    vi.advanceTimersToNextFrame();
    expect(runs).toBe(3);
  });

  it("keeps running after a job throws", () => {
    const after = vi.fn();
    frame.update(() => {
      throw new Error("broken");
    });
    frame.render(after);
    expect(() => {
      vi.advanceTimersToNextFrame();
    }).toThrow("broken");
    frame.render(after);
    vi.advanceTimersToNextFrame();
    expect(after).toHaveBeenCalledTimes(1);
  });

  it("drops a cancelled job", () => {
    const job = vi.fn();
    frame.render(job);
    frame.cancel(job);
    vi.advanceTimersToNextFrame();
    expect(job).not.toHaveBeenCalled();
  });
});
