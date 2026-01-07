'use client';

import { HomePage } from './(features)/home/components/HomePage';
import FeaturesLayout from './(features)/layout';

export default function Page(): React.JSX.Element {
  return (
    <FeaturesLayout>
      <HomePage />
    </FeaturesLayout>
  );
}
