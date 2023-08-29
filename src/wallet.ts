import { InjectedConnector } from '@web3-react/injected-connector';

export const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 4] })

export const getNetwork = (chainId: number) => {
  switch (chainId) {
    case 1: return 'ethereum';
    case 4: return 'rinkeby';
    case 137: return 'polygon';
    default: return 'N/A';
  }
}