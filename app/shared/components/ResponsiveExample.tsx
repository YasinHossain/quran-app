'use client';

import {
  ResponsiveButton,
  ResponsiveCard,
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveRow,
  useResponsiveHelpers,
} from './ResponsiveUtils';

/**
 * Example component demonstrating the unified responsive system
 * This shows how components now adapt naturally without breakpoint-specific code
 */
export const ResponsiveExample = (): React.JSX.Element => {
  const { variant, breakpoint, isMobile, isDesktop } = useResponsiveHelpers();

  return (
    <div className="container-responsive py-6">
      <ResponsiveStack spacing="lg">
        {/* Header */}
        <ResponsiveCard>
          <ResponsiveStack>
            <h1 className="text-mobile-xl">Unified Responsive System</h1>
            <p className="text-mobile text-muted">
              Current breakpoint: <strong>{breakpoint}</strong> | Variant:{' '}
              <strong>{variant}</strong> | Is Mobile: <strong>{isMobile ? 'Yes' : 'No'}</strong>
            </p>
          </ResponsiveStack>
        </ResponsiveCard>

        {/* Button Examples */}
        <ResponsiveCard>
          <ResponsiveStack>
            <h2 className="text-mobile-lg">Responsive Buttons</h2>
            <p className="text-mobile-sm text-muted">
              These buttons automatically adjust their size and spacing based on screen size
            </p>

            <ResponsiveRow align="center" justify="start">
              <ResponsiveButton size="sm" variant="secondary">
                Small
              </ResponsiveButton>
              <ResponsiveButton size="md" variant="primary">
                Medium
              </ResponsiveButton>
              <ResponsiveButton size="lg" variant="ghost">
                Large
              </ResponsiveButton>
            </ResponsiveRow>
          </ResponsiveStack>
        </ResponsiveCard>

        {/* Grid Example */}
        <ResponsiveCard>
          <ResponsiveStack>
            <h2 className="text-mobile-lg">Adaptive Grid</h2>
            <p className="text-mobile-sm text-muted">
              This grid automatically adjusts columns: 1 on mobile, 2 on tablet, 3 on desktop
            </p>

            <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ResponsiveCard key={i} hover>
                  <div className="text-center p-4">
                    <div className="text-mobile-lg text-accent mb-2">{i}</div>
                    <p className="text-mobile-sm text-muted">Grid Item {i}</p>
                  </div>
                </ResponsiveCard>
              ))}
            </ResponsiveGrid>
          </ResponsiveStack>
        </ResponsiveCard>

        {/* Layout Example */}
        <ResponsiveCard>
          <ResponsiveStack>
            <h2 className="text-mobile-lg">Flexible Layout</h2>
            <p className="text-mobile-sm text-muted">
              This layout stacks on mobile, becomes a row on larger screens
            </p>

            <div className="flex-mobile-col">
              <div className="card bg-accent/10 text-accent">
                <h3 className="text-mobile font-semibold mb-2">Feature A</h3>
                <p className="text-mobile-sm">
                  Adapts naturally without manual breakpoint management
                </p>
              </div>

              <div className="card bg-interactive/20">
                <h3 className="text-mobile font-semibold mb-2">Feature B</h3>
                <p className="text-mobile-sm">Uses unified CSS classes for consistent behavior</p>
              </div>

              <div className="card bg-status-success/10 text-status-success">
                <h3 className="text-mobile font-semibold mb-2">Feature C</h3>
                <p className="text-mobile-sm">Touch-friendly and accessible across all devices</p>
              </div>
            </div>
          </ResponsiveStack>
        </ResponsiveCard>

        {/* Usage Example */}
        <ResponsiveCard>
          <ResponsiveStack>
            <h2 className="text-mobile-lg">Benefits</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-status-success mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-mobile font-medium">No More Breakpoint Hell</h4>
                  <p className="text-mobile-sm text-muted">
                    Components adapt using variants instead of manual breakpoint classes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-status-success mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-mobile font-medium">Better Performance</h4>
                  <p className="text-mobile-sm text-muted">
                    Single components instead of multiple mobile/desktop versions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-status-success mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-mobile font-medium">Consistent Experience</h4>
                  <p className="text-mobile-sm text-muted">
                    Unified behavior across all screen sizes and devices
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-status-success mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-mobile font-medium">Easy Maintenance</h4>
                  <p className="text-mobile-sm text-muted">
                    Update once, works everywhere. No more mobile vs desktop conflicts
                  </p>
                </div>
              </div>
            </div>
          </ResponsiveStack>
        </ResponsiveCard>

        {/* Debug Info */}
        <ResponsiveCard>
          <ResponsiveStack>
            <h2 className="text-mobile-lg">Debug Information</h2>
            <div className="bg-interactive/20 p-4 rounded-lg">
              <pre className="text-mobile-sm font-mono text-muted">
                {JSON.stringify(
                  {
                    breakpoint,
                    variant,
                    isMobile,
                    isDesktop,
                    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'SSR',
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </ResponsiveStack>
        </ResponsiveCard>
      </ResponsiveStack>
    </div>
  );
};
