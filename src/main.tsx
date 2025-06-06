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
    mainnet: { url: getFullnodeUrl('mainnet') },
    testnet: { url:  getFullnodeUrl('testnet') },
    devnet: { url: getFullnodeUrl('devnet')  },
    localnet: { url: 'https://localhost:8000' },
};

const slushWalletConfig = {
    name: 'Ghosty Tap',
    approveConnectionUrl: 'https://my.slush.app/approve-connection?requestId=',
    signPersonalMessageUrl: 'https://my.slush.app/sign-personal-message?requestId=',
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
        <SuiClientProvider networks={networks} defaultNetwork="devnet">
            <WalletProvider 
                autoConnect 
                slushWallet={slushWalletConfig}
            >
                <App />
            </WalletProvider>
        </SuiClientProvider>
    </QueryClientProvider>
    </Provider>
)

function preloadFonts(){
    document.fonts.load('1em Pixeloid Sans')
    document.fonts.load('1em Gagalin')
    document.fonts.load('1em LogoSC LongZhuTi')

    document.fonts.load('1em D-DINExp')
    document.fonts.load('1em SourceCodePro-Bold')
    document.fonts.load('1em SourceCodePro-Semibold')
    document.fonts.load('1em SourceCodePro-Semibold-stroke')
    document.fonts.load('1em SourceCodePro-Medium')
    document.fonts.load('1em SourceCodePro-Regular');
}
  
 



