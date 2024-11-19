import { jsx } from 'react/jsx-runtime';
import { Toaster as Toaster$1 } from 'react-hot-toast';

function Toaster() {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      position: "bottom-right",
      toastOptions: {
        duration: 3e3,
        style: {
          background: "#363636",
          color: "#fff"
        },
        success: {
          duration: 3e3,
          iconTheme: {
            primary: "#4ade80",
            secondary: "#fff"
          }
        },
        error: {
          duration: 4e3,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff"
          }
        }
      }
    }
  );
}

export { Toaster as T };
