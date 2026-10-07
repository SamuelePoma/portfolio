export type FrameJob = (time: number) => void;

type Phase = "read" | "update" | "render";

const order: readonly Phase[] = ["read", "update", "render"];
const queues: Record<Phase, Set<FrameJob>> = {
  read: new Set(),
  update: new Set(),
  render: new Set(),
};
let requested = false;

function request(): void {
  requested = true;
  requestAnimationFrame(run);
}

function run(time: number): void {
  try {
    for (const phase of order) {
      // Jobs a phase queues for a later phase still run this frame; jobs it queues for
      // itself (a spring that hasn't arrived) run on the next one.
      const jobs = [...queues[phase]];
      queues[phase].clear();
      for (const job of jobs) job(time);
    }
  } finally {
    requested = false;
    if (order.some((phase) => queues[phase].size > 0)) request();
  }
}

function schedule(phase: Phase, job: FrameJob): void {
  queues[phase].add(job);
  if (!requested) request();
}

/**
 * One shared animation-frame loop. Each frame first reads layout, then updates values
 * (springs), then writes styles, so the page is never measured halfway through being
 * changed. A job queued twice for the same frame runs once.
 */
export const frame = {
  read: (job: FrameJob) => {
    schedule("read", job);
  },
  update: (job: FrameJob) => {
    schedule("update", job);
  },
  render: (job: FrameJob) => {
    schedule("render", job);
  },
  cancel: (job: FrameJob) => {
    for (const phase of order) queues[phase].delete(job);
  },
};
