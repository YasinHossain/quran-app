export interface PanelController {
  isOpen: boolean;
  setOpen: (state: boolean) => void;
}

export const createPanelController = (
  panelId: string,
  openPanels: Set<string>,
  open: (id: string) => void,
  close: (id: string) => void
): PanelController => ({
  isOpen: openPanels.has(panelId),
  setOpen: (state: boolean) => (state ? open(panelId) : close(panelId)),
});
