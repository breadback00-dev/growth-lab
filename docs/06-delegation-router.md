# Delegation Router

The main agent owns the work. Side agents are optional helpers.

Default to one agent: the main agent. Delegate only when a side task can run independently and materially improves the result.

## Default Rule

Use **zero side agents** for most work.

Use **one side agent** only when research spans multiple sources or options, can run independently, and the main agent can keep progressing without the answer. Otherwise research directly in the main thread.

Ask the user before using **more than one side agent** unless the user explicitly requested parallel/subagent work.

## The One Default Side Agent

### Research Scout

Use Research Scout for:

- current official docs
- maintained GitHub repos
- plugin/tool/MCP discovery
- library/framework/API choices
- security or deployment best practices
- pricing, licensing, quotas, or platform support
- "is there a better current way to do this?"

Research Scout returns advice. The main agent decides.

## When Not To Delegate

Do not delegate when:

- the task is tiny
- the next step is blocked on the research result
- the question can be answered faster by reading one local file
- the work is tightly coupled to code edits
- delegation would duplicate what the main agent is already doing

## When To Ask Before More Agents

Ask before spawning or simulating multiple side agents when:

- multiple research tracks are possible
- a code review needs several specialist lenses
- architecture/security/performance all need independent analysis
- the work may become slower or more expensive because of delegation

Ask one concise question:

```text
This may benefit from multiple specialist side agents. Do you want me to keep it lean with one Research Scout, or run a broader multi-agent pass?
```

## Portable Fallback

If real subagents are unavailable, simulate Research Scout by using:

```text
prompts/subagents/research-scout.md
```

If subagents are available, delegate. If they are unavailable, run a bounded main-thread research pass using `prompts/subagents/research-scout.md` and return the same output contract.

The simulated scout should write a short research note or return concise findings to the main agent. It should not edit project code.

## Output Contract

Any side-agent result should include:

- question researched
- sources checked
- options found
- recommendation
- confidence
- source URLs, access date, and relevant version/release when applicable
- what would make the recommendation wrong
- what the main agent should do next
