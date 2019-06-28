

// export getConfig = () : Promise<Config> => {
//     return axios.get('/conf/config.json').then((response) => {
//         console.log("Axio ConfigLoader :", response.data);
//         return <Config> response.data;
//     })
// }

// export const configuration = {
//     // Show console logs of application
//     DEBUG: true,
//     // Allow fake auth (only if ADFS is not working, for testing purpose only)
//     ALLOW_FAKE_AUTH: true,
//     // true = redirect SSo login process is automatic on /login page
//     // False = user has to click on authentification button to execute SSO auth process
//     AUTOLOGIN: false,
//     // Token duration in seconds, 0 = until ADFS expires (1 hour), XX = token will expire in XX seconds.
//     TOKEN_DURATION: 0,
//     MG2_PROPOSITION_BACK_URL: "http://127.0.0.1:8080/mg2-proposal-backend",
//     ADFS_BASE_URL: "https://adfs.cerp-rrm.com/adfs/oauth2/token",
//     ADFS_URL: "https://adfs.cerp-rrm.com/adfs/oauth2/authorize?response_type=code&client_id=1663150c-8e05-4a64-bee3-a39d463168ec&redirect_uri=http://serialisation.cerp-rrm.com/login&resource=apc-serialization",
//     GRANT_TYPE: "authorization_code",
//     CLIENT_ID: "1663150c-8e05-4a64-bee3-a39d463168ec",
//     REDIRECT_URI: "http://serialisation.cerp-rrm.com/login",
//     RESOURCE: "apc-serialization"
// };