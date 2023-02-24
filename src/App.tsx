import Header from './Header/Header';
import Body from './Body/Body';
import { WagmiConfig } from "wagmi";
import { ethereumClient, wagmiClient } from './ethereumConfig';
import { VariantType, useSnackbar } from 'notistack';
import { useEffect } from 'react';
import * as React from 'react';

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const handleSnackbar = (variant: VariantType, body: any) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(body, { variant });
  };

  return (
    <div className="text-center">  
        <WagmiConfig client={wagmiClient}>
          <Header ethereumClient={ethereumClient} />
          <Body handleSnackbar={handleSnackbar} />
        </WagmiConfig>
    </div>
  );
}

export default App;
