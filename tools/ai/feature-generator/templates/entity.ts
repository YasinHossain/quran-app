export function entityTemplate(name: string): string {
  const className = capitalize(name);
  return `/**
 * ${className} domain entity
 */
export interface ${className}Props {
  id: string;
  // add more fields here
}

export class ${className} {
  constructor(private readonly props: ${className}Props) {}

  get id(): string {
    return this.props.id;
  }
}
`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
