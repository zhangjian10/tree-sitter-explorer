import { Outlet, useNavigate, useParams } from "react-router-dom";
import { parsers } from "../parsers";
import type { IParser } from "../parsers";
import { defaultRoute, getParserById } from "../utils/router-utils";
import { useEffect, useState } from "react";
import Modal from "./modal";

function Application() {
  const navigate = useNavigate();
  const params = useParams();
  const [, setParser] = useState<IParser | undefined>(
    getParserById(params.parserId)
  );
  const [modalIsShown, setModalIsShown] = useState(false);

  useEffect(() => {
    if (params.parserId === undefined) {
      navigate(defaultRoute);
    }
  }, [navigate, params.parserId]);

  useEffect(() => {
    setParser(getParserById(params.parserId));
  }, [params.parserId]);

  return (
    <>
      {modalIsShown && (
        <Modal
          title="About"
          onClose={() => {
            setModalIsShown(false);
          }}
        >
          <p className="pb-4">
            This app is a playground for tree-sitter parsers. It uses wasm
            builds of the parsers.
          </p>
        </Modal>
      )}

      <div className="flex flex-col h-screen">
        <header className="flex-none h-16 flex items-center px-3 sm:px-4 lg:px-6 shadow">
          <h1 className="flex-none text-xl font-bold">
            <a href="/tree-sitter-explorer">Tree-sitter explorer</a>
          </h1>

          <select
            className="block rounded-md border-0 ring-1 ring-inset ring-gray-300 py-1.5 px-2 ml-4 bg-white"
            onChange={(e) => {
              navigate(`/${e.target.value}`);
            }}
            value={params.parserId}
          >
            {parsers.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </header>

        <main className="grow flex">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Application;
