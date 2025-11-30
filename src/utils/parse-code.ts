import { Parser, Language } from "web-tree-sitter";
import treeSitterWasm from "web-tree-sitter/tree-sitter.wasm?url";

let parser: Parser;

export async function parseCode(code: string, wasmUrl: string) {
  if (!parser) {
    await Parser.init({
      locateFile: () => treeSitterWasm,
    });
    parser = new Parser();
  }

  parser.setLanguage(await Language.load(wasmUrl));

  return parser.parse(code);
}
