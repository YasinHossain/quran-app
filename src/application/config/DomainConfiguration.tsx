'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ServiceLocator } from '../services/ServiceLocator';
import { DomainServiceProvider } from '../providers/DomainServiceProvider';
import { BookmarkProvider } from '../providers/BookmarkProvider';

// TODO: These will be implemented in Phase 4 (Infrastructure layer)
import type { IBookmarkRepository } from '@/src/domain/repositories/IBookmarkRepository';
import type { IVerseRepository } from '@/src/domain/repositories/IVerseRepository';
import type { ISurahRepository } from '@/src/domain/repositories/ISurahRepository';

interface DomainConfigurationProps {
  children: ReactNode;
  userId: string;
  repositories?: {
    bookmarkRepository: IBookmarkRepository;
    verseRepository: IVerseRepository;
    surahRepository: ISurahRepository;
  };
}

/**
 * Configures the domain layer and provides services to the application.
 * This component initializes all domain services and provides them through context.
 */
export const DomainConfiguration = ({
  children,
  userId,
  repositories,
}: DomainConfigurationProps) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [services, setServices] = useState<any>(null);

  useEffect(() => {
    if (repositories) {
      // Configure service locator with repositories
      const serviceLocator = ServiceLocator.getInstance();
      serviceLocator.configure(repositories);

      // Get all configured services
      const allServices = serviceLocator.getAllServices();
      setServices(allServices);
      setIsConfigured(true);
    } else {
      // TODO: For now, we'll mock the repositories
      // In Phase 4, this will be replaced with actual infrastructure implementations
      console.warn('No repositories provided. Domain services will use mock implementations.');
      setIsConfigured(false);
    }
  }, [repositories]);

  if (!isConfigured || !services) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted">Initializing domain services...</p>
        </div>
      </div>
    );
  }

  return (
    <DomainServiceProvider services={services}>
      <BookmarkProvider userId={userId}>{children}</BookmarkProvider>
    </DomainServiceProvider>
  );
};
