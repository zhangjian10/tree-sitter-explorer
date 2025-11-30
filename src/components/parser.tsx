import { useEffect, useRef, useState } from "react";
import { parseCode } from "../utils/parse-code";
import type { IParser } from "../parsers";
import { useLoaderData } from "react-router-dom";
import TreeView from "./tree-view";
import { Node } from "web-tree-sitter";
import CodeMirror from "@uiw/react-codemirror";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import type { LanguageSupport } from "@codemirror/language";
import { Compartment } from "@codemirror/state";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import InputCheckbox from "./input-checkbox";

const languageCompartment = new Compartment();
function Parser() {
  const { parser } = useLoaderData() as {
    parser: IParser;
  };
  const refs = useRef<ReactCodeMirrorRef>({});
  const [code, setCode] = useState("");
  const [cst, setCst] = useState<undefined | Node>();
  const [nodeNameIsShown, setNodeNameIsShown] = useState<boolean>(() => {
    const nodeNameIsShown = localStorage.getItem("nodeNameIsShown");

    return nodeNameIsShown ? JSON.parse(nodeNameIsShown) : true;
  });
  const [terminalSymbolsIsShown, setTerminalSymbolsIsShown] = useState<boolean>(
    () => {
      const terminalSymbolsIsShown = localStorage.getItem(
        "terminalSymbolsIsShown"
      );

      return terminalSymbolsIsShown ? JSON.parse(terminalSymbolsIsShown) : true;
    }
  );

  useEffect(() => {
    async function codeToCst(code: string) {
      const cst = await parseCode(code, parser.wasmUrl);

      setCst(cst?.rootNode);
    }

    codeToCst(code);
  }, [code, parser.wasmUrl]);

  // Dynamically load language extensions based on current parser
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
            return;
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
      refs.current?.view?.dispatch({
        effects: languageCompartment.reconfigure(language),
      });
    }

    loadLang();
  }, [parser?.name]);

  useEffect(() => {
    localStorage.setItem("nodeNameIsShown", JSON.stringify(nodeNameIsShown));
  }, [nodeNameIsShown]);

  useEffect(() => {
    localStorage.setItem(
      "terminalSymbolsIsShown",
      JSON.stringify(terminalSymbolsIsShown)
    );
  }, [terminalSymbolsIsShown]);

  function treeNodeOnClickHandler(startIndex: number, endIndex: number): void {
    refs.current?.view?.dispatch({
      selection: { anchor: startIndex, head: endIndex },
    });
  }

  return (
    <div className="flex-1 flex items-stretch">
      <div className="flex-1 p-4 border-r-2 overflow-auto content-container">
        <CodeMirror
          value={code}
          onChange={setCode}
          ref={refs}
          extensions={[vscodeLight, languageCompartment.of([])]}
        />
      </div>

      <div className="flex-1 p-4 overflow-auto content-container">
        <div className="mb-2">
          <InputCheckbox
            label="Show node name"
            checked={nodeNameIsShown}
            onChange={setNodeNameIsShown}
          />
          <InputCheckbox
            label="Show terminal symbols"
            checked={terminalSymbolsIsShown}
            onChange={setTerminalSymbolsIsShown}
          />
        </div>

        {cst ? (
          <TreeView
            node={cst}
            onClick={treeNodeOnClickHandler}
            nodeNameIsShown={nodeNameIsShown}
            terminalSymbolsIsShown={terminalSymbolsIsShown}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Parser;
