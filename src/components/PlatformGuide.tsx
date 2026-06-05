const steps = [
  {
    title: "Check the sales position",
    detail: "Pick the month, then compare current sales with the reward threshold."
  },
  {
    title: "Review experiment evidence",
    detail: "Look for scale, iterate, launch, or stop signals before changing spend."
  },
  {
    title: "Choose this week's actions",
    detail: "Use the operator queue to keep the next workday focused and small."
  },
  {
    title: "Update the data",
    detail: "Refresh sales and experiment notes weekly so recommendations stay useful."
  }
];

export default function PlatformGuide() {
  return (
    <section className="section-block platform-guide">
      <div className="section-heading">
        <div>
          <p className="eyebrow">How to use Growth Lab</p>
          <h2>Run the weekly loop</h2>
        </div>
        <span className="status-pill good">Simple rhythm</span>
      </div>

      <ol className="guide-steps" aria-label="Growth Lab weekly usage steps">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span>{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
