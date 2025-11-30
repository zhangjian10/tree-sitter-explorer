import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Application from "./components/application";
import Parser from "./components/parser";
import { observer } from "mobx-react";
import { StrictMode } from "react";
import { defaultRoute, getParserById } from "./utils/router-utils";

export { defaultRoute, getParserById };

const router = createBrowserRouter([
  {
    path: "/",
    element: <Application />,
    children: [
      {
        path: "/",
        element: <Navigate to={defaultRoute} />,
      },
      {
        path: "/:parserId",
        element: <Parser />,
        loader: ({ params }) => {
          const parser = getParserById(params.parserId);

          return { parser };
        },
      },
    ],
  },
]);

const Main = observer(() => <RouterProvider router={router} />);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div id="modal-place" />
    <Main />
  </StrictMode>
);
