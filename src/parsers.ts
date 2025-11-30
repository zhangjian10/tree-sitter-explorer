import packageJson from "../package.json";

// 动态导入 wasm 文件,Vite 会自动处理
import cWasm from "tree-sitter-c/tree-sitter-c.wasm?url";
import cppWasm from "tree-sitter-cpp/tree-sitter-cpp.wasm?url";
import goWasm from "tree-sitter-go/tree-sitter-go.wasm?url";
import javaWasm from "tree-sitter-java/tree-sitter-java.wasm?url";
import jsWasm from "tree-sitter-javascript/tree-sitter-javascript.wasm?url";
import pythonWasm from "tree-sitter-python/tree-sitter-python.wasm?url";
import tsWasm from "tree-sitter-typescript/tree-sitter-typescript.wasm?url";

export interface IParser {
  id: string;
  name: string;
  wasmUrl: string;
  version: string;
  homepage: string;
}

export const parsers: IParser[] = [
  {
    id: "tree-sitter-c",
    name: "C",
    wasmUrl: cWasm,
    version: packageJson.dependencies["tree-sitter-c"],
    homepage: "https://github.com/tree-sitter/tree-sitter-c",
  },
  {
    id: "tree-sitter-cpp",
    name: "C++",
    wasmUrl: cppWasm,
    version: packageJson.dependencies["tree-sitter-cpp"],
    homepage: "https://github.com/tree-sitter/tree-sitter-cpp",
  },
  {
    id: "tree-sitter-go",
    name: "Go",
    wasmUrl: goWasm,
    version: packageJson.dependencies["tree-sitter-go"],
    homepage: "https://github.com/tree-sitter/tree-sitter-go",
  },
  {
    id: "tree-sitter-java",
    name: "Java",
    wasmUrl: javaWasm,
    version: packageJson.dependencies["tree-sitter-java"],
    homepage: "https://github.com/tree-sitter/tree-sitter-java",
  },
  {
    id: "tree-sitter-javascript",
    name: "JavaScript",
    wasmUrl: jsWasm,
    version: packageJson.dependencies["tree-sitter-javascript"],
    homepage: "https://github.com/tree-sitter/tree-sitter-javascript",
  },
  {
    id: "tree-sitter-python",
    name: "Python",
    wasmUrl: pythonWasm,
    version: packageJson.dependencies["tree-sitter-python"],
    homepage: "https://github.com/tree-sitter/tree-sitter-python",
  },
  {
    id: "tree-sitter-typescript",
    name: "TypeScript",
    wasmUrl: tsWasm,
    version: packageJson.dependencies["tree-sitter-typescript"],
    homepage: "https://github.com/tree-sitter/tree-sitter-typescript",
  },
];
