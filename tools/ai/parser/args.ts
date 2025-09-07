export interface Prop {
  name: string;
  optional: boolean;
  type: string;
}

export function parseProps(propsString: string): Prop[] {
  const props: Prop[] = [];
  const propMatches = propsString.matchAll(/(\w+)(\??):\s*([^;]+)/g);

  for (const match of propMatches) {
    props.push({
      name: match[1],
      optional: match[2] === '?',
      type: match[3].trim(),
    });
  }

  return props;
}
