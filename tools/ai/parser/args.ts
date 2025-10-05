export interface Prop {
  name: string;
  optional: boolean;
  type: string;
}

export function parseProps(propsString: string): Prop[] {
  const props: Prop[] = [];
  const propMatches = propsString.matchAll(/(\w+)(\??):\s*([^;]+)/g);

  for (const match of propMatches) {
    const name = match[1] ?? '';
    const opt = match[2] ?? '';
    const typ = (match[3] ?? '').trim();
    props.push({
      name,
      optional: opt === '?',
      type: typ,
    });
  }

  return props;
}
