// _app.tsx

import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <NextUIProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </NextUIProvider>
  );
};

export default App;
