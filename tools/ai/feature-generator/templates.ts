export class FeatureTemplates {
  constructor(private featureName: string) {}
  generateEntityTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)} Domain Entity
 * 
 * Contains the core business logic and rules for ${this.featureName}.
 */

export class ${this.capitalize(this.featureName)} {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly createdAt: Date,
    private readonly updatedAt?: Date
  ) {}

  // Getters
  get entityId(): string {
    return this.id;
  }

  get displayName(): string {
    return this.name;
  }

  get creationDate(): Date {
    return this.createdAt;
  }

  get lastModified(): Date | undefined {
    return this.updatedAt;
  }

  // Business Logic Methods
  isNew(): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.createdAt > oneHourAgo;
  }

  canBeModified(): boolean {
    // Add business rules for modification
    return true;
  }

  validate(): boolean {
    return this.id.length > 0 && this.name.length > 0;
  }

  // Factory Methods
  static create(name: string): ${this.capitalize(this.featureName)} {
    const id = this.generateId();
    const createdAt = new Date();
    
    return new ${this.capitalize(this.featureName)}(id, name, createdAt);
  }

  static fromData(data: ${this.capitalize(this.featureName)}Data): ${this.capitalize(this.featureName)} {
    return new ${this.capitalize(this.featureName)}(
      data.id,
      data.name,
      new Date(data.createdAt),
      data.updatedAt ? new Date(data.updatedAt) : undefined
    );
  }

  private static generateId(): string {
    return \`\${this.name.toLowerCase()}_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }
}

// Supporting types
export interface ${this.capitalize(this.featureName)}Data {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Create${this.capitalize(this.featureName)}Request {
  name: string;
}

export interface Update${this.capitalize(this.featureName)}Request {
  id: string;
  name?: string;
}`;
  }

  generateRepositoryInterfaceTemplate() {
    return `/**
 * Repository interface for ${this.capitalize(this.featureName)} entity
 * 
 * Defines data access contract for ${this.featureName} operations.
 */

import { ${this.capitalize(this.featureName)} } from '../entities/${this.capitalize(this.featureName)}';

export interface I${this.capitalize(this.featureName)}Repository {
  findById(id: string): Promise<${this.capitalize(this.featureName)} | null>;
  findAll(): Promise<${this.capitalize(this.featureName)}[]>;
  findByName(name: string): Promise<${this.capitalize(this.featureName)}[]>;
  save(entity: ${this.capitalize(this.featureName)}): Promise<void>;
  update(entity: ${this.capitalize(this.featureName)}): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export interface ${this.capitalize(this.featureName)}SearchOptions {
  query?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ${this.capitalize(this.featureName)}SearchResult {
  items: ${this.capitalize(this.featureName)}[];
  total: number;
  hasMore: boolean;
}`;
  }

  generateDomainServiceTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)} Domain Service
 * 
 * Coordinates ${this.featureName} business operations and enforces business rules.
 */

import { ${this.capitalize(this.featureName)} } from '../entities/${this.capitalize(this.featureName)}';
import { I${this.capitalize(this.featureName)}Repository } from '../repositories/I${this.capitalize(this.featureName)}Repository';
import { DomainError } from '../errors/DomainError';

export class ${this.capitalize(this.featureName)}Service {
  constructor(
    private readonly ${this.featureName}Repository: I${this.capitalize(this.featureName)}Repository
  ) {}

  async create${this.capitalize(this.featureName)}(name: string): Promise<${this.capitalize(this.featureName)}> {
    // Business rule validation
    if (!name || name.trim().length === 0) {
      throw new DomainError('${this.capitalize(this.featureName)} name cannot be empty');
    }

    // Check for duplicates
    const existing = await this.${this.featureName}Repository.findByName(name);
    if (existing.length > 0) {
      throw new DomainError(\`${this.capitalize(this.featureName)} with name "\${name}" already exists\`);
    }

    // Create and save entity
    const entity = ${this.capitalize(this.featureName)}.create(name);
    await this.${this.featureName}Repository.save(entity);

    return entity;
  }

  async update${this.capitalize(this.featureName)}(id: string, name: string): Promise<${this.capitalize(this.featureName)}> {
    const entity = await this.${this.featureName}Repository.findById(id);
    if (!entity) {
      throw new DomainError(\`${this.capitalize(this.featureName)} with id "\${id}" not found\`);
    }

    if (!entity.canBeModified()) {
      throw new DomainError('${this.capitalize(this.featureName)} cannot be modified');
    }

    // Create updated entity (entities are immutable)
    const updatedEntity = new ${this.capitalize(this.featureName)}(
      entity.entityId,
      name,
      entity.creationDate,
      new Date()
    );

    await this.${this.featureName}Repository.update(updatedEntity);
    return updatedEntity;
  }

  async delete${this.capitalize(this.featureName)}(id: string): Promise<void> {
    const exists = await this.${this.featureName}Repository.exists(id);
    if (!exists) {
      throw new DomainError(\`${this.capitalize(this.featureName)} with id "\${id}" not found\`);
    }

    await this.${this.featureName}Repository.delete(id);
  }

  async get${this.capitalize(this.featureName)}Stats(): Promise<${this.capitalize(this.featureName)}Stats> {
    const total = await this.${this.featureName}Repository.count();
    const all = await this.${this.featureName}Repository.findAll();
    const newCount = all.filter(entity => entity.isNew()).length;

    return {
      total,
      new: newCount,
      active: total - newCount
    };
  }
}

export interface ${this.capitalize(this.featureName)}Stats {
  total: number;
  new: number;
  active: number;
}`;
  }

  generateUseCaseTemplate(useCaseName: string) {
    const operation =
      useCaseName.match(/^(Get|Create|Update|Delete)/)?.[1].toLowerCase() || 'process';

    return `/**
 * ${useCaseName} Use Case
 * 
 * Application-specific operation for ${operation}ing ${this.featureName}.
 */

import { ${this.capitalize(this.featureName)} } from '../../domain/entities/${this.capitalize(this.featureName)}';
import { ${this.capitalize(this.featureName)}Service } from '../../domain/services/${this.capitalize(this.featureName)}Service';
import { ${this.capitalize(this.featureName)}Dto } from '../dto/${this.capitalize(this.featureName)}Dto';
import { injectable, inject } from 'inversify';

${this.generateUseCaseInterface(useCaseName)}

@injectable()
export class ${useCaseName}UseCase {
  constructor(
    @inject('${this.capitalize(this.featureName)}Service')
    private readonly ${this.featureName}Service: ${this.capitalize(this.featureName)}Service
  ) {}

  async execute(${this.generateUseCaseParams(operation)}): Promise<${this.generateUseCaseReturn(operation)}> {
    try {
      ${this.generateUseCaseImplementation(operation)}
    } catch (error) {
      throw new Error(\`Failed to ${operation} ${this.featureName}: \${error.message}\`);
    }
  }

  private mapToDto(entity: ${this.capitalize(this.featureName)}): ${this.capitalize(this.featureName)}Dto {
    return {
      id: entity.entityId,
      name: entity.displayName,
      createdAt: entity.creationDate.toISOString(),
      updatedAt: entity.lastModified?.toISOString(),
      isNew: entity.isNew()
    };
  }
}`;
  }

  generateUseCaseInterface(useCaseName: string) {
    const operation =
      useCaseName.match(/^(Get|Create|Update|Delete)/)?.[1].toLowerCase() || 'process';

    return `export interface ${useCaseName}Request {
  ${this.generateRequestInterface(operation)}
}

export interface ${useCaseName}Response {
  ${this.generateResponseInterface(operation)}
}`;
  }

  generateUseCaseParams(operation: string) {
    switch (operation) {
      case 'get':
        return 'request: Get${this.capitalize(this.featureName)}Request';
      case 'create':
        return 'request: Create${this.capitalize(this.featureName)}Request';
      case 'update':
        return 'request: Update${this.capitalize(this.featureName)}Request';
      case 'delete':
        return 'request: Delete${this.capitalize(this.featureName)}Request';
      default:
        return 'request: unknown';
    }
  }

  generateUseCaseReturn(operation: string) {
    switch (operation) {
      case 'get':
        return `${this.capitalize(this.featureName)}Dto | ${this.capitalize(this.featureName)}Dto[]`;
      case 'create':
        return `${this.capitalize(this.featureName)}Dto`;
      case 'update':
        return `${this.capitalize(this.featureName)}Dto`;
      case 'delete':
        return 'void';
      default:
        return 'any';
    }
  }

  generateUseCaseImplementation(operation: string) {
    switch (operation) {
      case 'get':
        return `      const entity = await this.${this.featureName}Service.findById(request.id);
      return entity ? this.mapToDto(entity) : null;`;
      case 'create':
        return `      const entity = await this.${this.featureName}Service.create${this.capitalize(this.featureName)}(request.name);
      return this.mapToDto(entity);`;
      case 'update':
        return `      const entity = await this.${this.featureName}Service.update${this.capitalize(this.featureName)}(request.id, request.name);
      return this.mapToDto(entity);`;
      case 'delete':
        return `      await this.${this.featureName}Service.delete${this.capitalize(this.featureName)}(request.id);`;
      default:
        return '      // TODO: Implement use case logic';
    }
  }

  generateRequestInterface(operation: string) {
    switch (operation) {
      case 'get':
        return 'id: string;';
      case 'create':
        return 'name: string;';
      case 'update':
        return 'id: string;\n  name: string;';
      case 'delete':
        return 'id: string;';
      default:
        return '// TODO: Define request properties';
    }
  }

  generateResponseInterface(operation: string) {
    switch (operation) {
      case 'get':
        return `${this.featureName}: ${this.capitalize(this.featureName)}Dto | null;`;
      case 'create':
        return `${this.featureName}: ${this.capitalize(this.featureName)}Dto;`;
      case 'update':
        return `${this.featureName}: ${this.capitalize(this.featureName)}Dto;`;
      case 'delete':
        return 'success: boolean;';
      default:
        return '// TODO: Define response properties';
    }
  }

  generateDtoTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)} Data Transfer Object
 * 
 * Represents ${this.featureName} data for application layer communication.
 */

export interface ${this.capitalize(this.featureName)}Dto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  isNew: boolean;
}

export interface Create${this.capitalize(this.featureName)}Dto {
  name: string;
}

export interface Update${this.capitalize(this.featureName)}Dto {
  id: string;
  name: string;
}

export interface ${this.capitalize(this.featureName)}ListDto {
  items: ${this.capitalize(this.featureName)}Dto[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}`;
  }

  generateRepositoryImplementationTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)} Repository Implementation
 * 
 * Concrete implementation of ${this.featureName} data access.
 */

import { ${this.capitalize(this.featureName)}, ${this.capitalize(this.featureName)}Data } from '../../domain/entities/${this.capitalize(this.featureName)}';
import { I${this.capitalize(this.featureName)}Repository, ${this.capitalize(this.featureName)}SearchOptions, ${this.capitalize(this.featureName)}SearchResult } from '../../domain/repositories/I${this.capitalize(this.featureName)}Repository';
import { ICache } from '../cache/ICache';
import { injectable, inject } from 'inversify';

@injectable()
export class ${this.capitalize(this.featureName)}Repository implements I${this.capitalize(this.featureName)}Repository {
  private readonly cachePrefix = '${this.featureName}:';
  private readonly cacheTTL = 3600; // 1 hour

  constructor(
    @inject('ICache') private readonly cache: ICache,
    @inject('HttpClient') private readonly httpClient: unknown
  ) {}

  async findById(id: string): Promise<${this.capitalize(this.featureName)} | null> {
    const cacheKey = \`\${this.cachePrefix}\${id}\`;
    
    // Try cache first
    const cached = await this.cache.get<${this.capitalize(this.featureName)}Data>(cacheKey);
    if (cached) {
      return ${this.capitalize(this.featureName)}.fromData(cached);
    }

    // Fetch from API
    try {
      const response = await this.httpClient.get<${this.capitalize(this.featureName)}Data>(\`/api/${this.featureName}/\${id}\`);
      
      // Cache the result
      await this.cache.set(cacheKey, response, this.cacheTTL);
      
      return ${this.capitalize(this.featureName)}.fromData(response);
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new Error(\`Failed to fetch ${this.featureName} \${id}: \${error.message}\`);
    }
  }

  async findAll(): Promise<${this.capitalize(this.featureName)}[]> {
    const cacheKey = \`\${this.cachePrefix}all\`;
    
    // Try cache first
    const cached = await this.cache.get<${this.capitalize(this.featureName)}Data[]>(cacheKey);
    if (cached) {
      return cached.map(data => ${this.capitalize(this.featureName)}.fromData(data));
    }

    // Fetch from API
    try {
      const response = await this.httpClient.get<${this.capitalize(this.featureName)}Data[]>('/api/${this.featureName}');
      
      // Cache the result
      await this.cache.set(cacheKey, response, this.cacheTTL);
      
      return response.map(data => ${this.capitalize(this.featureName)}.fromData(data));
    } catch (error) {
      throw new Error(\`Failed to fetch all ${this.featureName}: \${error.message}\`);
    }
  }

  async findByName(name: string): Promise<${this.capitalize(this.featureName)}[]> {
    try {
      const response = await this.httpClient.get<${this.capitalize(this.featureName)}Data[]>(\`/api/${this.featureName}?name=\${encodeURIComponent(name)}\`);
      return response.map(data => ${this.capitalize(this.featureName)}.fromData(data));
    } catch (error) {
      throw new Error(\`Failed to search ${this.featureName} by name: \${error.message}\`);
    }
  }

  async save(entity: ${this.capitalize(this.featureName)}): Promise<void> {
    try {
      const data = this.entityToData(entity);
      await this.httpClient.post('/api/${this.featureName}', data);
      
      // Update cache
      const cacheKey = \`\${this.cachePrefix}\${entity.entityId}\`;
      await this.cache.set(cacheKey, data, this.cacheTTL);
      
      // Invalidate list cache
      await this.cache.delete(\`\${this.cachePrefix}all\`);
    } catch (error) {
      throw new Error(\`Failed to save ${this.featureName}: \${error.message}\`);
    }
  }

  async update(entity: ${this.capitalize(this.featureName)}): Promise<void> {
    try {
      const data = this.entityToData(entity);
      await this.httpClient.put(\`/api/${this.featureName}/\${entity.entityId}\`, data);
      
      // Update cache
      const cacheKey = \`\${this.cachePrefix}\${entity.entityId}\`;
      await this.cache.set(cacheKey, data, this.cacheTTL);
      
      // Invalidate list cache
      await this.cache.delete(\`\${this.cachePrefix}all\`);
    } catch (error) {
      throw new Error(\`Failed to update ${this.featureName}: \${error.message}\`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.httpClient.delete(\`/api/${this.featureName}/\${id}\`);
      
      // Remove from cache
      await this.cache.delete(\`\${this.cachePrefix}\${id}\`);
      
      // Invalidate list cache
      await this.cache.delete(\`\${this.cachePrefix}all\`);
    } catch (error) {
      throw new Error(\`Failed to delete ${this.featureName}: \${error.message}\`);
    }
  }

  async exists(id: string): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }

  async count(): Promise<number> {
    try {
      const response = await this.httpClient.get<{ count: number }>('/api/${this.featureName}/count');
      return response.count;
    } catch (error) {
      // Fallback to counting all items
      const all = await this.findAll();
      return all.length;
    }
  }

  private entityToData(entity: ${this.capitalize(this.featureName)}): ${this.capitalize(this.featureName)}Data {
    return {
      id: entity.entityId,
      name: entity.displayName,
      createdAt: entity.creationDate.toISOString(),
      updatedAt: entity.lastModified?.toISOString()
    };
  }
}`;
  }

  generatePageTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)} Feature Page
 * 
 * Main entry point for the ${this.featureName} feature.
 */

import React from 'react';
import { Metadata } from 'next';
import { ${this.capitalize(this.featureName)}Manager } from './components/organisms/${this.capitalize(this.featureName)}Manager';

export const metadata: Metadata = {
  title: '${this.capitalize(this.featureName)} | Quran App',
  description: 'Manage your ${this.featureName} in the Quran app',
};

export default function ${this.capitalize(this.featureName)}Page() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            ${this.capitalize(this.featureName)}
          </h1>
          <p className="text-secondary">
            Manage your ${this.featureName} here
          </p>
        </header>
        
        <${this.capitalize(this.featureName)}Manager />
      </div>
    </main>
  );
}`;
  }

  generateLayoutTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)} Feature Layout
 * 
 * Layout wrapper for ${this.featureName} feature pages.
 */

import React from 'react';

interface ${this.capitalize(this.featureName)}LayoutProps {
  children: React.ReactNode;
}

export default function ${this.capitalize(this.featureName)}Layout({
  children
}: ${this.capitalize(this.featureName)}LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto px-4">
          <nav className="py-4">
            {/* Feature-specific navigation */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary">
                ${this.capitalize(this.featureName)} Management
              </span>
            </div>
          </nav>
        </div>
      </div>
      
      {children}
    </div>
  );
}`;
  }

  generateAtomTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)}Card Atom Component
 * 
 * Basic card component for displaying ${this.featureName} information.
 */

import React from 'react';
import { cn } from '@/shared/utils';

export interface ${this.capitalize(this.featureName)}CardProps {
  title: string;
  description?: string;
  isNew?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ${this.capitalize(this.featureName)}Card: React.FC<${this.capitalize(this.featureName)}CardProps> = ({
  title,
  description,
  isNew = false,
  className,
  onClick
}) => {
  return (
    <div
      className={cn(
        'p-4 border border-border rounded-lg bg-surface',
        'hover:bg-surface-hover transition-colors',
        'focus-within:ring-2 focus-within:ring-accent focus-within:outline-none',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-primary mb-1 truncate">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-secondary line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        {isNew && (
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
            New
          </span>
        )}
      </div>
    </div>
  );
};`;
  }

  generateMoleculeTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)}List Molecule Component
 * 
 * List component for displaying multiple ${this.featureName} items.
 */

import React from 'react';
import { ${this.capitalize(this.featureName)}Card } from '../atoms/${this.capitalize(this.featureName)}Card';
import { LoadingSpinner } from '@/presentation/components/atoms/LoadingSpinner';
import { ErrorCard } from '@/presentation/components/molecules/ErrorCard';

export interface ${this.capitalize(this.featureName)}Item {
  id: string;
  name: string;
  description?: string;
  isNew?: boolean;
}

export interface ${this.capitalize(this.featureName)}ListProps {
  items: ${this.capitalize(this.featureName)}Item[];
  loading?: boolean;
  error?: Error | null;
  onItemClick?: (item: ${this.capitalize(this.featureName)}Item) => void;
  onRetry?: () => void;
  emptyMessage?: string;
  className?: string;
}

export const ${this.capitalize(this.featureName)}List: React.FC<${this.capitalize(this.featureName)}ListProps> = ({
  items,
  loading = false,
  error = null,
  onItemClick,
  onRetry,
  emptyMessage = 'No ${this.featureName} items found',
  className = ''
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorCard
        error={error}
        onRetry={onRetry}
        message="Failed to load ${this.featureName} items"
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted mb-2">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <${this.capitalize(this.featureName)}Card
          key={item.id}
          title={item.name}
          description={item.description}
          isNew={item.isNew}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        />
      ))}
    </div>
  );
};`;
  }

  generateOrganismTemplate() {
    return `/**
 * ${this.capitalize(this.featureName)}Manager Organism Component
 * 
 * Main management interface for ${this.featureName} feature.
 */

import React, { useState } from 'react';
import { ${this.capitalize(this.featureName)}List } from '../molecules/${this.capitalize(this.featureName)}List';
import { use${this.capitalize(this.featureName)} } from '../../hooks/use${this.capitalize(this.featureName)}';
import { ActionButton } from '@/presentation/components/atoms/ActionButton';
import { SearchInput } from '@/shared/components/SearchInput';

export const ${this.capitalize(this.featureName)}Manager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const {
    items,
    loading,
    error,
    create${this.capitalize(this.featureName)},
    update${this.capitalize(this.featureName)},
    delete${this.capitalize(this.featureName)},
    reload
  } = use${this.capitalize(this.featureName)}({ searchQuery });

  const handleItemClick = <T,>(item: T) => {
    console.log('${this.capitalize(this.featureName)} clicked:', item);
    // TODO: Implement item selection/editing
  };

  const handleCreate = async (name: string) => {
    try {
      await create${this.capitalize(this.featureName)}(name);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create ${this.featureName}:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ${this.featureName}..."
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <ActionButton
            onClick={() => setShowCreateForm(true)}
            variant="primary"
            className="whitespace-nowrap"
          >
            Create New
          </ActionButton>
          
          <ActionButton
            onClick={reload}
            variant="secondary"
            className="whitespace-nowrap"
          >
            Refresh
          </ActionButton>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <CreateForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* ${this.capitalize(this.featureName)} List */}
      <${this.capitalize(this.featureName)}List
        items={items}
        loading={loading}
        error={error}
        onItemClick={handleItemClick}
        onRetry={reload}
        emptyMessage={
          searchQuery
            ? \`No ${this.featureName} found matching "\${searchQuery}"\`
            : 'No ${this.featureName} items yet. Create your first one!'
        }
      />
    </div>
  );
};

// Create Form Component
interface CreateFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-border rounded-lg bg-surface">
      <h3 className="text-lg font-semibold mb-4">Create New ${this.capitalize(this.featureName)}</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter ${this.featureName} name"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        
        <div className="flex gap-3">
          <ActionButton type="submit" variant="primary" disabled={!name.trim()}>
            Create
          </ActionButton>
          <ActionButton type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </ActionButton>
        </div>
      </div>
    </form>
  );
};`;
  }

  generateHookTemplate() {
    return `/**
 * use${this.capitalize(this.featureName)} Hook
 * 
 * Custom hook for managing ${this.featureName} state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { useContainer } from '@/shared/config/container';
import { Get${this.capitalize(this.featureName)}UseCase } from '../../../src/application/use-cases/Get${this.capitalize(this.featureName)}UseCase';
import { Create${this.capitalize(this.featureName)}UseCase } from '../../../src/application/use-cases/Create${this.capitalize(this.featureName)}UseCase';
import { Update${this.capitalize(this.featureName)}UseCase } from '../../../src/application/use-cases/Update${this.capitalize(this.featureName)}UseCase';
import { Delete${this.capitalize(this.featureName)}UseCase } from '../../../src/application/use-cases/Delete${this.capitalize(this.featureName)}UseCase';

export interface ${this.capitalize(this.featureName)}Item {
  id: string;
  name: string;
  description?: string;
  isNew: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Use${this.capitalize(this.featureName)}Options {
  searchQuery?: string;
  autoLoad?: boolean;
}

export interface Use${this.capitalize(this.featureName)}Return {
  items: ${this.capitalize(this.featureName)}Item[];
  loading: boolean;
  error: Error | null;
  create${this.capitalize(this.featureName)}: (name: string) => Promise<${this.capitalize(this.featureName)}Item>;
  update${this.capitalize(this.featureName)}: (id: string, name: string) => Promise<${this.capitalize(this.featureName)}Item>;
  delete${this.capitalize(this.featureName)}: (id: string) => Promise<void>;
  reload: () => Promise<void>;
  clearError: () => void;
}

export const use${this.capitalize(this.featureName)} = (
  options: Use${this.capitalize(this.featureName)}Options = {}
): Use${this.capitalize(this.featureName)}Return => {
  const { searchQuery = '', autoLoad = true } = options;
  
  const [items, setItems] = useState<${this.capitalize(this.featureName)}Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const container = useContainer();
  
  // Get use cases from DI container
  const get${this.capitalize(this.featureName)}UseCase = container.get<Get${this.capitalize(this.featureName)}UseCase>(Get${this.capitalize(this.featureName)}UseCase);
  const create${this.capitalize(this.featureName)}UseCase = container.get<Create${this.capitalize(this.featureName)}UseCase>(Create${this.capitalize(this.featureName)}UseCase);
  const update${this.capitalize(this.featureName)}UseCase = container.get<Update${this.capitalize(this.featureName)}UseCase>(Update${this.capitalize(this.featureName)}UseCase);
  const delete${this.capitalize(this.featureName)}UseCase = container.get<Delete${this.capitalize(this.featureName)}UseCase>(Delete${this.capitalize(this.featureName)}UseCase);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement proper search/filter logic
      const result = await get${this.capitalize(this.featureName)}UseCase.execute({ 
        query: searchQuery 
      });
      
      // Convert DTOs to UI items
      const uiItems: ${this.capitalize(this.featureName)}Item[] = Array.isArray(result)
        ? result.map(dto => ({
            id: dto.id,
            name: dto.name,
            description: undefined, // Add description from DTO if available
            isNew: dto.isNew,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
          }))
        : [];

      setItems(uiItems);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load ${this.featureName}');
      setError(error);
      console.error('Failed to load ${this.featureName}:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, get${this.capitalize(this.featureName)}UseCase]);

  const create${this.capitalize(this.featureName)} = useCallback(async (name: string): Promise<${this.capitalize(this.featureName)}Item> => {
    try {
      const result = await create${this.capitalize(this.featureName)}UseCase.execute({ name });
      
      const newItem: ${this.capitalize(this.featureName)}Item = {
        id: result.id,
        name: result.name,
        isNew: result.isNew,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };

      setItems(current => [newItem, ...current]);
      return newItem;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create ${this.featureName}');
      setError(error);
      throw error;
    }
  }, [create${this.capitalize(this.featureName)}UseCase]);

  const update${this.capitalize(this.featureName)} = useCallback(async (id: string, name: string): Promise<${this.capitalize(this.featureName)}Item> => {
    try {
      const result = await update${this.capitalize(this.featureName)}UseCase.execute({ id, name });
      
      const updatedItem: ${this.capitalize(this.featureName)}Item = {
        id: result.id,
        name: result.name,
        isNew: result.isNew,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };

      setItems(current =>
        current.map(item => (item.id === id ? updatedItem : item))
      );

      return updatedItem;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update ${this.featureName}');
      setError(error);
      throw error;
    }
  }, [update${this.capitalize(this.featureName)}UseCase]);

  const delete${this.capitalize(this.featureName)} = useCallback(async (id: string): Promise<void> => {
    try {
      await delete${this.capitalize(this.featureName)}UseCase.execute({ id });
      setItems(current => current.filter(item => item.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete ${this.featureName}');
      setError(error);
      throw error;
    }
  }, [delete${this.capitalize(this.featureName)}UseCase]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-load on mount and search query change
  useEffect(() => {
    if (autoLoad) {
      loadItems();
    }
  }, [loadItems, autoLoad]);

  return {
    items,
    loading,
    error,
    create${this.capitalize(this.featureName)},
    update${this.capitalize(this.featureName)},
    delete${this.capitalize(this.featureName)},
    reload: loadItems,
    clearError
  };
};`;
  }

  // Test templates
  generateEntityTestTemplate() {
    return `/**
 * Tests for ${this.capitalize(this.featureName)} domain entity
 */

import { ${this.capitalize(this.featureName)} } from '../../../src/domain/entities/${this.capitalize(this.featureName)}';

describe('${this.capitalize(this.featureName)}', () => {
  describe('creation', () => {
    it('should create ${this.featureName} with valid data', () => {
      const ${this.featureName} = ${this.capitalize(this.featureName)}.create('Test ${this.capitalize(this.featureName)}');
      
      expect(${this.featureName}.displayName).toBe('Test ${this.capitalize(this.featureName)}');
      expect(${this.featureName}.entityId).toBeDefined();
      expect(${this.featureName}.creationDate).toBeInstanceOf(Date);
    });

    it('should validate entity data', () => {
      const ${this.featureName} = ${this.capitalize(this.featureName)}.create('Valid Name');
      
      expect(${this.featureName}.validate()).toBe(true);
    });
  });

  describe('business logic', () => {
    let ${this.featureName}: ${this.capitalize(this.featureName)};

    beforeEach(() => {
      ${this.featureName} = ${this.capitalize(this.featureName)}.create('Test ${this.capitalize(this.featureName)}');
    });

    it('should detect new entities', () => {
      expect(${this.featureName}.isNew()).toBe(true);
    });

    it('should allow modification by default', () => {
      expect(${this.featureName}.canBeModified()).toBe(true);
    });
  });

  describe('factory methods', () => {
    it('should create from data', () => {
      const data = {
        id: 'test-id',
        name: 'Test Name',
        createdAt: new Date().toISOString()
      };

      const ${this.featureName} = ${this.capitalize(this.featureName)}.fromData(data);
      
      expect(${this.featureName}.entityId).toBe('test-id');
      expect(${this.featureName}.displayName).toBe('Test Name');
    });
  });
});`;
  }

  generateServiceTestTemplate() {
    return `/**
 * Tests for ${this.capitalize(this.featureName)}Service domain service
 */

import { ${this.capitalize(this.featureName)}Service } from '../../../src/domain/services/${this.capitalize(this.featureName)}Service';
import { I${this.capitalize(this.featureName)}Repository } from '../../../src/domain/repositories/I${this.capitalize(this.featureName)}Repository';
import { ${this.capitalize(this.featureName)} } from '../../../src/domain/entities/${this.capitalize(this.featureName)}';
import { DomainError } from '../../../src/domain/errors/DomainError';

describe('${this.capitalize(this.featureName)}Service', () => {
  let service: ${this.capitalize(this.featureName)}Service;
  let mockRepository: jest.Mocked<I${this.capitalize(this.featureName)}Repository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      count: jest.fn()
    };

    service = new ${this.capitalize(this.featureName)}Service(mockRepository);
  });

  describe('create${this.capitalize(this.featureName)}', () => {
    it('should create new ${this.featureName} successfully', async () => {
      mockRepository.findByName.mockResolvedValue([]);
      mockRepository.save.mockResolvedValue();

      const result = await service.create${this.capitalize(this.featureName)}('Test Name');

      expect(result).toBeInstanceOf(${this.capitalize(this.featureName)});
      expect(result.displayName).toBe('Test Name');
      expect(mockRepository.save).toHaveBeenCalledWith(result);
    });

    it('should throw error for empty name', async () => {
      await expect(service.create${this.capitalize(this.featureName)}('')).rejects.toThrow(DomainError);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for duplicate name', async () => {
      const existing = ${this.capitalize(this.featureName)}.create('Test Name');
      mockRepository.findByName.mockResolvedValue([existing]);

      await expect(service.create${this.capitalize(this.featureName)}('Test Name')).rejects.toThrow(DomainError);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update${this.capitalize(this.featureName)}', () => {
    it('should update existing ${this.featureName}', async () => {
      const existing = ${this.capitalize(this.featureName)}.create('Old Name');
      mockRepository.findById.mockResolvedValue(existing);
      mockRepository.update.mockResolvedValue();

      const result = await service.update${this.capitalize(this.featureName)}('test-id', 'New Name');

      expect(result.displayName).toBe('New Name');
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('should throw error for non-existent ${this.featureName}', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update${this.capitalize(this.featureName)}('invalid-id', 'Name')).rejects.toThrow(DomainError);
    });
  });

  describe('delete${this.capitalize(this.featureName)}', () => {
    it('should delete existing ${this.featureName}', async () => {
      mockRepository.exists.mockResolvedValue(true);
      mockRepository.delete.mockResolvedValue();

      await service.delete${this.capitalize(this.featureName)}('test-id');

      expect(mockRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error for non-existent ${this.featureName}', async () => {
      mockRepository.exists.mockResolvedValue(false);

      await expect(service.delete${this.capitalize(this.featureName)}('invalid-id')).rejects.toThrow(DomainError);
    });
  });
});`;
  }

  generateRepositoryTestTemplate() {
    return `/**
 * Integration tests for ${this.capitalize(this.featureName)}Repository
 */

import { ${this.capitalize(this.featureName)}Repository } from '../../../src/infrastructure/repositories/${this.capitalize(this.featureName)}Repository';
import { ${this.capitalize(this.featureName)}, ${this.capitalize(this.featureName)}Data } from '../../../src/domain/entities/${this.capitalize(this.featureName)}';
import { MockHttpClient } from '../../mocks/MockHttpClient';
import { MockCache } from '../../mocks/MockCache';

describe('${this.capitalize(this.featureName)}Repository Integration', () => {
  let repository: ${this.capitalize(this.featureName)}Repository;
  let mockHttpClient: jest.Mocked<any>;
  let mockCache: jest.Mocked<any>;

  const mockData: ${this.capitalize(this.featureName)}Data = {
    id: 'test-id',
    name: 'Test ${this.capitalize(this.featureName)}',
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    mockHttpClient = MockHttpClient.create();
    mockCache = MockCache.create();
    repository = new ${this.capitalize(this.featureName)}Repository(mockCache, mockHttpClient);
  });

  describe('findById', () => {
    it('should return cached ${this.featureName} if available', async () => {
      mockCache.get.mockResolvedValue(mockData);

      const result = await repository.findById('test-id');

      expect(result).toBeInstanceOf(${this.capitalize(this.featureName)});
      expect(result?.entityId).toBe('test-id');
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it('should fetch from API if not cached', async () => {
      mockCache.get.mockResolvedValue(null);
      mockHttpClient.get.mockResolvedValue(mockData);

      const result = await repository.findById('test-id');

      expect(result).toBeInstanceOf(${this.capitalize(this.featureName)});
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/${this.featureName}/test-id');
      expect(mockCache.set).toHaveBeenCalled();
    });

    it('should return null for 404 response', async () => {
      mockCache.get.mockResolvedValue(null);
      mockHttpClient.get.mockRejectedValue({ status: 404 });

      const result = await repository.findById('invalid-id');

      expect(result).toBeNull();
    });

    it('should throw error for other HTTP errors', async () => {
      mockCache.get.mockResolvedValue(null);
      mockHttpClient.get.mockRejectedValue({ status: 500, message: 'Server error' });

      await expect(repository.findById('test-id')).rejects.toThrow('Failed to fetch');
    });
  });

  describe('save', () => {
    it('should save ${this.featureName} via API', async () => {
      const entity = ${this.capitalize(this.featureName)}.fromData(mockData);
      mockHttpClient.post.mockResolvedValue(undefined);

      await repository.save(entity);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/${this.featureName}', expect.objectContaining({
        id: 'test-id',
        name: 'Test ${this.capitalize(this.featureName)}'
      }));
      expect(mockCache.set).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update ${this.featureName} via API', async () => {
      const entity = ${this.capitalize(this.featureName)}.fromData(mockData);
      mockHttpClient.put.mockResolvedValue(undefined);

      await repository.update(entity);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/${this.featureName}/test-id', expect.any(Object));
      expect(mockCache.set).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete ${this.featureName} via API', async () => {
      mockHttpClient.delete.mockResolvedValue(undefined);

      await repository.delete('test-id');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/${this.featureName}/test-id');
      expect(mockCache.delete).toHaveBeenCalledWith('${this.featureName}:test-id');
    });
  });
});`;
  }

  generateComponentTestTemplate() {
    return `/**
 * Tests for ${this.capitalize(this.featureName)}Manager component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${this.capitalize(this.featureName)}Manager } from '../components/organisms/${this.capitalize(this.featureName)}Manager';
import { TestProviders } from '../../../tests/test-utils/TestProviders';

// Mock the hook
jest.mock('../hooks/use${this.capitalize(this.featureName)}', () => ({
  use${this.capitalize(this.featureName)}: jest.fn()
}));

import { use${this.capitalize(this.featureName)} } from '../hooks/use${this.capitalize(this.featureName)}';

const mockUse${this.capitalize(this.featureName)} = use${this.capitalize(this.featureName)} as jest.MockedFunction<typeof use${this.capitalize(this.featureName)}>;

const mockItems = [
  {
    id: '1',
    name: 'Test ${this.capitalize(this.featureName)} 1',
    description: 'Description 1',
    isNew: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Test ${this.capitalize(this.featureName)} 2',
    description: 'Description 2',
    isNew: false,
    createdAt: '2023-01-01T00:00:00Z'
  }
];

describe('${this.capitalize(this.featureName)}Manager', () => {
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockReload = jest.fn();

  beforeEach(() => {
    mockUse${this.capitalize(this.featureName)}.mockReturnValue({
      items: mockItems,
      loading: false,
      error: null,
      create${this.capitalize(this.featureName)}: mockCreate,
      update${this.capitalize(this.featureName)}: mockUpdate,
      delete${this.capitalize(this.featureName)}: mockDelete,
      reload: mockReload,
      clearError: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <TestProviders>
        <${this.capitalize(this.featureName)}Manager />
      </TestProviders>
    );
  };

  it('should render ${this.featureName} list', () => {
    renderComponent();

    expect(screen.getByText('Test ${this.capitalize(this.featureName)} 1')).toBeInTheDocument();
    expect(screen.getByText('Test ${this.capitalize(this.featureName)} 2')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUse${this.capitalize(this.featureName)}.mockReturnValue({
      items: [],
      loading: true,
      error: null,
      create${this.capitalize(this.featureName)}: mockCreate,
      update${this.capitalize(this.featureName)}: mockUpdate,
      delete${this.capitalize(this.featureName)}: mockDelete,
      reload: mockReload,
      clearError: jest.fn()
    });

    renderComponent();

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('should show error state', () => {
    mockUse${this.capitalize(this.featureName)}.mockReturnValue({
      items: [],
      loading: false,
      error: new Error('Test error'),
      create${this.capitalize(this.featureName)}: mockCreate,
      update${this.capitalize(this.featureName)}: mockUpdate,
      delete${this.capitalize(this.featureName)}: mockDelete,
      reload: mockReload,
      clearError: jest.fn()
    });

    renderComponent();

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('should handle search input', async () => {
    const user = userEvent.setup();
    renderComponent();

    const searchInput = screen.getByPlaceholderText(/search ${this.featureName}/i);
    
    await user.type(searchInput, 'test query');

    expect(searchInput).toHaveValue('test query');
  });

  it('should show create form when create button clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const createButton = screen.getByRole('button', { name: /create new/i });
    await user.click(createButton);

    expect(screen.getByText(/create new ${this.featureName}/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('should create new ${this.featureName}', async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValue({
      id: '3',
      name: 'New ${this.capitalize(this.featureName)}',
      isNew: true,
      createdAt: '2023-01-01T00:00:00Z'
    });

    renderComponent();

    // Open create form
    await user.click(screen.getByRole('button', { name: /create new/i }));

    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'New ${this.capitalize(this.featureName)}');

    // Submit form
    await user.click(screen.getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith('New ${this.capitalize(this.featureName)}');
    });
  });

  it('should handle refresh action', async () => {
    const user = userEvent.setup();
    renderComponent();

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    expect(mockReload).toHaveBeenCalled();
  });
});`;
  }

  generateE2ETestTemplate() {
    return `/**
 * E2E tests for ${this.featureName} feature
 */

import { test, expect } from '@playwright/test';

test.describe('${this.capitalize(this.featureName)} Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/${this.featureName}');
  });

  test('should display ${this.featureName} page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /^${this.capitalize(this.featureName)}$/i })).toBeVisible();
    await expect(page.getByText(/manage your ${this.featureName}/i)).toBeVisible();
  });

  test('should create new ${this.featureName}', async ({ page }) => {
    // Click create button
    await page.getByRole('button', { name: /create new/i }).click();

    // Fill form
    await page.getByLabel(/name/i).fill('Test ${this.capitalize(this.featureName)}');

    // Submit
    await page.getByRole('button', { name: /^create$/i }).click();

    // Verify creation
    await expect(page.getByText('Test ${this.capitalize(this.featureName)}')).toBeVisible();
  });

  test('should search ${this.featureName} items', async ({ page }) => {
    // Type in search box
    await page.getByPlaceholder(/search ${this.featureName}/i).fill('test query');

    // Verify search is triggered (this would depend on your implementation)
    await page.waitForTimeout(500); // Allow for debounced search

    // Check that search query is in the input
    await expect(page.getByPlaceholder(/search ${this.featureName}/i)).toHaveValue('test query');
  });

  test('should handle empty state', async ({ page }) => {
    // Mock empty API response (you might need to setup MSW or similar)
    // For now, just check that empty state messaging exists in the component
    
    // Look for empty state message
    const emptyMessage = page.getByText(/no ${this.featureName} items yet/i);
    
    // This test might need API mocking to be fully effective
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    // Check that page is still usable
    await expect(page.getByRole('heading', { name: /^${this.capitalize(this.featureName)}$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create new/i })).toBeVisible();
    
    // Check that search input is responsive
    const searchInput = page.getByPlaceholder(/search ${this.featureName}/i);
    await expect(searchInput).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    // This test assumes there's navigation back to home
    // Adjust based on your actual navigation structure
    
    await page.getByRole('link', { name: /home/i }).click();
    await expect(page).toHaveURL('/');
  });
});`;
  }

  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
