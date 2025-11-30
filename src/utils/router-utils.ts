import { parsers } from '../parsers';
import type { IParser } from '../parsers';

export const defaultRoute = 'tree-sitter-typescript';

export function getParserById(id: string | undefined): IParser | undefined {
  return parsers.find((item) => item.id === id);
}
