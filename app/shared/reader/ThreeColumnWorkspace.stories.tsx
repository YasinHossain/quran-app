import { ThreeColumnWorkspace } from './ThreeColumnWorkspace';
import { WorkspaceMain } from './WorkspaceMain';

import type { Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';

const DemoSidebar = ({ title }: { title: string }): ReactElement => (
  <div className="flex h-full flex-col gap-4 p-4 text-sm text-content-secondary">
    <div>
      <p className="text-xs uppercase tracking-wide text-content-muted">Sidebar</p>
      <h2 className="text-base font-semibold text-content-primary">{title}</h2>
    </div>
    <ul className="space-y-2">
      {['Overview', 'Notes', 'Highlights', 'Bookmarks', 'Settings'].map((item) => (
        <li
          key={item}
          className="rounded-md border border-border/60 bg-surface-secondary px-3 py-2 text-content-secondary"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const DemoMain = ({ heading }: { heading: string }): ReactElement => (
  <WorkspaceMain>
    <article className="space-y-6 pb-12">
      <header className="space-y-2">
        <p className="text-sm text-content-muted">Demo content</p>
        <h1 className="text-2xl font-semibold text-content-primary">{heading}</h1>
      </header>
      <section className="space-y-4 text-base leading-7 text-content-secondary">
        {[0, 1, 2].map((paragraph) => (
          <p key={paragraph}>
            The shared workspace shell keeps the focus on the central reading surface while
            reserving space for navigation and settings panels. This story helps validate token
            usage and slot composition without wiring real feature logic.
          </p>
        ))}
      </section>
    </article>
  </WorkspaceMain>
);

const meta = {
  title: 'Reader/Layout/ThreeColumnWorkspace',
  component: ThreeColumnWorkspace,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ThreeColumnWorkspace>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllColumns: Story = {
  render: (): ReactElement => (
    <ThreeColumnWorkspace
      left={<DemoSidebar title="Library" />}
      center={<DemoMain heading="All Columns" />}
      right={<DemoSidebar title="Reader Settings" />}
    />
  ),
};

export const CenterOnly: Story = {
  render: (): ReactElement => <ThreeColumnWorkspace center={<DemoMain heading="Center Only" />} />,
};

export const LeftAndCenter: Story = {
  render: (): ReactElement => (
    <ThreeColumnWorkspace
      left={<DemoSidebar title="Navigation" />}
      center={<DemoMain heading="Left & Center" />}
    />
  ),
};

export const CenterAndRight: Story = {
  render: (): ReactElement => (
    <ThreeColumnWorkspace
      center={<DemoMain heading="Center & Right" />}
      right={<DemoSidebar title="Translation Settings" />}
    />
  ),
};
