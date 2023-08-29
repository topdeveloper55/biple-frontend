
const API_KEY = process.env.REACT_APP_API_KEY;

export const fetchNfts = (account, count) => {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api.nftport.xyz/v0/accounts/${account}?chain=ethereum&include=metadata&page_size=${count}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: API_KEY,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.nfts) resolve(data.nfts)
                else resolve([])
            })
            .catch((e) => {
                console.log(e);
                reject(e.message ? e.message : JSON.stringify(e))
            });
    })
}