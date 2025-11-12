import type { Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';

const DemoPlayground = (): ReactElement => (
  <div className="min-h-screen space-y-8 bg-background p-6 text-foreground">
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Desktop column reservations</h2>
      <div className="hidden gap-4 lg:flex">
        <aside className="hidden w-reader-sidebar-left rounded-lg bg-surface p-4 shadow-card lg:block">
          Left column uses w-reader-sidebar-left
        </aside>
        <main className="flex-1 rounded-lg bg-surface p-4 shadow-card">
          Center content flexes between sidebars
        </main>
        <aside className="hidden w-reader-sidebar-right rounded-lg bg-surface p-4 shadow-card lg:block">
          Right column uses w-reader-sidebar-right
        </aside>
      </div>
      <p className="text-sm text-content-secondary">
        Resize to lg and above to see the token based widths applied.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Header offsets and calc usage</h2>
      <div className="relative h-48 rounded-lg border border-dashed border-border bg-surface/70">
        <div className="absolute left-6 right-6 top-reader-header flex h-10 items-center justify-center rounded-md border border-accent/40 bg-accent/10 text-sm">
          top-reader-header
        </div>
        <div className="absolute left-6 right-6 top-[calc(var(--reader-header-height-compact)+var(--reader-safe-area-top)+1rem)] flex h-10 items-center justify-center rounded-md border border-interactive bg-interactive/60 text-xs text-content-secondary">
          compact header + safe-area token mix
        </div>
      </div>
      <p className="text-sm text-content-secondary">
        Use the header tokens inside calc() expressions instead of hard coded rem values.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Safe padding helpers</h2>
      <div className="rounded-lg bg-surface p-4 pb-safe pt-safe">
        <p className="text-sm">
          `.pt-safe` and `.pb-safe` now expand to the precomputed safe padding variables so reader
          layouts inherit consistent insets.
        </p>
      </div>
    </section>
  </div>
);

const meta = {
  title: 'Reader/Layout/ThreeColumnTokens',
  component: DemoPlayground,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DemoPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Preview: Story = {
  render: (): ReactElement => <DemoPlayground />,
};
