import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Node } from "web-tree-sitter";
import CodeMirror from "@uiw/react-codemirror";
import type { Extension, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import type { LanguageSupport } from "@codemirror/language";
import { Compartment } from "@codemirror/state";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";

import { parseCode } from "../utils/parse-code";
import type { IParser } from "../parsers";
import TreeView from "./tree-view";

const languageCompartment = new Compartment();

function Parser() {
  const { parser } = useLoaderData() as {
    parser: IParser;
  };
  const codeMirrorRef = useRef<ReactCodeMirrorRef>({});
  const [code, setCode] = useState("");
  const [cst, setCst] = useState<undefined | Node>();

  useEffect(() => {
    async function codeToCst(code: string) {
      const cst = await parseCode(code, parser.wasmUrl);

      setCst(cst?.rootNode);
    }

    codeToCst(code);
  }, [code, parser.wasmUrl]);

  useEffect(() => {
    async function loadLang() {
      const name = parser?.name?.toLowerCase?.() || "";
      const { javascript } = await import("@codemirror/lang-javascript");
      let language: LanguageSupport = javascript({ jsx: true });
      try {
        switch (name) {
          case "typescript":
          case "javascript":
            break;
          case "java": {
            const { java } = await import("@codemirror/lang-java");
            language = java();
            break;
          }
          case "python": {
            const { python } = await import("@codemirror/lang-python");
            language = python();
            break;
          }
          case "go": {
            const { go } = await import("@codemirror/lang-go");
            language = go();
            break;
          }
          case "c++":
          case "c": {
            const { cpp } = await import("@codemirror/lang-cpp");
            language = cpp();
            break;
          }
        }
      } catch {
        // ignore
      }
      langExt.current = languageCompartment.of(language);
      codeMirrorRef.current?.view?.dispatch({
        effects: languageCompartment.reconfigure(language),
      });
    }

    loadLang();
  }, [parser?.name]);

  useLayoutEffect(() => {}, []);

  function treeNodeOnClickHandler(startIndex: number, endIndex: number): void {
    codeMirrorRef.current?.view?.dispatch({
      selection: { anchor: startIndex, head: endIndex },
    });
  }

  const langExt = useRef<Extension>(languageCompartment.of([]));

  return (
    <div className="flex flex-1 h-full min-h-0">
      <div className="flex w-1/2 flex-1 px-1 border-r-2 content-container min-h-0 overflow-x-auto">
        <CodeMirror
          value={code}
          onChange={setCode}
          className="max-h-full max-w-full"
          height="100%"
          width="100%"
          ref={codeMirrorRef}
          extensions={[vscodeLight, langExt.current]}
        />
      </div>

      <div className="flex flex-1 px-1 overflow-auto content-container min-h-0">
        {cst ? (
          <TreeView
            node={cst}
            onClick={treeNodeOnClickHandler}
            nodeNameIsShown={false}
            terminalSymbolsIsShown={false}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Parser;
