import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import '@ant-design/v5-patch-for-react-19';

import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();
// import '@ant-design/v5-patch-for-react-19';
import { SnackbarProvider } from "notistack";
import Router from "./router/router";
function App() {
  return (
      <SnackbarProvider
       maxSnack={3}
       anchorOrigin={{ vertical: "top", horizontal: "center" }}
       autoHideDuration={3000}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
        <Router />
        <ToastContainer />
      </QueryClientProvider>
      </SnackbarProvider>
  );
}

export default App;
