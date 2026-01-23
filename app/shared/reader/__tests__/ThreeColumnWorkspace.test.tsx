import { render, screen } from '@testing-library/react';

import { ThreeColumnWorkspace } from '@/app/shared/reader/ThreeColumnWorkspace';
import { WorkspaceMain } from '@/app/shared/reader/WorkspaceMain';
import { setMatchMedia } from '@/app/testUtils/matchMedia';

const useHeaderVisibilityMock = jest.fn(() => ({ isHidden: false }));

jest.mock('@/app/(features)/layout/context/HeaderVisibilityContext', () => ({
  useHeaderVisibility: (): { isHidden: boolean } => useHeaderVisibilityMock(),
}));

describe('ThreeColumnWorkspace', () => {
  beforeEach(() => {
    useHeaderVisibilityMock.mockReturnValue({ isHidden: false });
    setMatchMedia(false);
  });

  it('renders center content within the workspace', () => {
    render(<ThreeColumnWorkspace center={<WorkspaceMain>Center column content</WorkspaceMain>} />);

    expect(screen.getByText('Center column content')).toBeInTheDocument();
    const workspaceRoot = document.querySelector('[data-slot="workspace-root"]') as HTMLElement;
    const centerContainer = screen
      .getByText('Center column content')
      .closest('[data-slot="workspace-main"]') as HTMLElement;

    expect(workspaceRoot).not.toHaveClass(
      'pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]'
    );
    expect(centerContainer).toHaveClass(
      'pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]'
    );
  });

  it('unmounts desktop sidebars below breakpoint', () => {
    render(
      <ThreeColumnWorkspace
        left={<div>Left sidebar</div>}
        center={<WorkspaceMain>Center content</WorkspaceMain>}
        right={<div>Right sidebar</div>}
      />
    );

    expect(screen.queryByText('Left sidebar')).not.toBeInTheDocument();
    expect(screen.queryByText('Right sidebar')).not.toBeInTheDocument();
  });

  it('renders left and right slots at wide breakpoints', () => {
    setMatchMedia(true);

    render(
      <ThreeColumnWorkspace
        left={<div>Left sidebar</div>}
        center={<WorkspaceMain>Center content</WorkspaceMain>}
        right={<div>Right sidebar</div>}
      />
    );

    expect(screen.getByText('Left sidebar')).toBeInTheDocument();
    expect(screen.getByText('Right sidebar')).toBeInTheDocument();

    const leftContainer = screen
      .getByText('Left sidebar')
      .closest('[data-slot="workspace-left"]') as HTMLElement;
    const rightContainer = screen
      .getByText('Right sidebar')
      .closest('[data-slot="workspace-right"]') as HTMLElement;

    expect(leftContainer).toHaveClass('xl:w-reader-sidebar-left');
    expect(rightContainer).toHaveClass('2xl:w-reader-sidebar-right');
  });
});

describe('WorkspaceMain spacing defaults', () => {
  beforeEach(() => {
    useHeaderVisibilityMock.mockReturnValue({ isHidden: false });
    setMatchMedia(false);
  });

  it('does not reserve sidebar space by default', () => {
    render(
      <ThreeColumnWorkspace
        left={<div>Navigation</div>}
        right={<div>Settings</div>}
        center={<WorkspaceMain>Content area</WorkspaceMain>}
      />
    );

    const main = screen
      .getByText('Content area')
      .closest('[data-slot="workspace-main"]') as HTMLElement;
    expect(main).not.toHaveClass('xl:pl-reader-sidebar-left');
    expect(main).not.toHaveClass('xl:pr-reader-sidebar-right');
  });
});

describe('WorkspaceMain spacing overrides', () => {
  beforeEach(() => {
    useHeaderVisibilityMock.mockReturnValue({ isHidden: false });
    setMatchMedia(false);
  });

  it('reserves space when explicitly requested without sidebars', () => {
    render(
      <ThreeColumnWorkspace
        center={
          <WorkspaceMain reserveLeftSpace reserveRightSpace>
            Manual spacing
          </WorkspaceMain>
        }
      />
    );

    const main = screen
      .getByText('Manual spacing')
      .closest('[data-slot="workspace-main"]') as HTMLElement;
    expect(main).toHaveClass('xl:pl-reader-sidebar-left');
    expect(main).toHaveClass('xl:pr-reader-sidebar-right');
  });

  it('avoids double-reserving space when matching sidebars are present', () => {
    render(
      <ThreeColumnWorkspace
        left={<div>Navigation</div>}
        right={<div>Settings</div>}
        center={
          <WorkspaceMain reserveLeftSpace reserveRightSpace>
            Balanced layout
          </WorkspaceMain>
        }
      />
    );

    const main = screen
      .getByText('Balanced layout')
      .closest('[data-slot="workspace-main"]') as HTMLElement;
    expect(main).not.toHaveClass('xl:pl-reader-sidebar-left');
    expect(main).not.toHaveClass('xl:pr-reader-sidebar-right');
  });
});

describe('WorkspaceMain header awareness', () => {
  beforeEach(() => {
    useHeaderVisibilityMock.mockReturnValue({ isHidden: false });
    setMatchMedia(false);
  });

  it('keeps main padding stable even when the header is hidden', () => {
    useHeaderVisibilityMock.mockReturnValueOnce({ isHidden: true });

    render(<ThreeColumnWorkspace center={<WorkspaceMain>Scroll content</WorkspaceMain>} />);

    const workspaceRoot = document.querySelector('[data-slot="workspace-root"]') as HTMLElement;
    const main = screen
      .getByText('Scroll content')
      .closest('[data-slot="workspace-main"]') as HTMLElement;

    expect(workspaceRoot).not.toHaveClass('pt-[calc(var(--reader-safe-area-top))]');
    expect(main).toHaveClass('pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]');
  });
});
