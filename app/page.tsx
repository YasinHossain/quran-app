'use client';

import FeaturesLayout from './(features)/layout';
import { HomePage } from './(features)/home/components/HomePage';

export default function Page(): React.JSX.Element {
  return (
    <FeaturesLayout>
      <HomePage />
    </FeaturesLayout>
  );
}
