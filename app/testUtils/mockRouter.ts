export const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));
