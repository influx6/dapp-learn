import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

function MyApp({ Component, pageProps }) {
  return (
      <NotificationProvider>
          <MoralisProvider initializeOnMount={false}>
              <Component {...pageProps} />
          </MoralisProvider>
      </NotificationProvider>
  )
}

export default MyApp
