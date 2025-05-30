import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import { init } from './utils/init.ts';
import { Provider } from 'react-redux';
import store from './redux/store';

import '@mysten/dapp-kit/dist/index.css';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const networks = {
    // devnet: { url: getFullnodeUrl('devnet') },
    // mainnet: { url: getFullnodeUrl('mainnet') },
    mainnet: { url: 'https://fullnode.mainnet.sui.io:443' },
    testnet: { url: 'https://fullnode.testnet.sui.io:443' },
    devnet: { url: 'https://fullnode.devnet.sui.io:443' },
    localnet: { url: 'https://localhost:8000' },
};

const slushWalletConfig = {
    name: 'Ghosty Tap',
    approveConnectionUrl: 'https://my.slush.app/approve-connection?requestId=',
    iconUrl: 'https://slush.app/favicon.ico',
  };


window.onerror = (message, source, lineno, colno, error) => {
    console.log('cappppppp:',{message, source, lineno, colno, error});
}
window.addEventListener('unhandledrejection', (event) => {
    console.error("----------------------", event.reason);
})

preloadFonts();
init()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork="localnet">
            <WalletProvider 
                autoConnect 
                slushWallet={slushWalletConfig}
                // storage={localStorage}
                // storageKey="slush-wallet"
            >
                
                    <App />
      
            </WalletProvider>
        </SuiClientProvider>
    </QueryClientProvider>
    </Provider>
)

function preloadFonts(){
    document.fonts.load('1em Pixeloid Sans')

    document.fonts.load('1em D-DINExp')
    document.fonts.load('1em SourceCodePro-Bold')
    document.fonts.load('1em SourceCodePro-Semibold')
    document.fonts.load('1em SourceCodePro-Semibold-stroke')
    document.fonts.load('1em SourceCodePro-Medium')
    document.fonts.load('1em SourceCodePro-Regular');
}
  
 



