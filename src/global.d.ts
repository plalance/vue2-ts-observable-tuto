declare global {
    interface Configuration {
        // Show console logs of application
        DEBUG: boolean,
        // Allow fake auth (only if ADFS is not working, for testing purpose only)
        ALLOW_FAKE_AUTH: boolean,
        // true = redirect SSo login process is automatic on /login page
        // False = user has to click on authentification button to execute SSO auth process
        AUTOLOGIN: boolean,
        // Token duration in seconds, 0 = until ADFS expires (1 hour), XX = token will expire in XX seconds.
        TOKEN_DURATION: number,
        MG2_PROPOSITION_BACK_URL: string,
        ADFS_BASE_URL: string,
        ADFS_URL: string,
        GRANT_TYPE: string,
        CLIENT_ID: string,
        REDIRECT_URI: string,
        RESOURCE: string,
        PROJECT_ADMIN_GROUP_ID: string,
        PROJECT_GROUP_ID: string
    }
    var configuration: Configuration;

    interface Window {
        configuration: Configuration;
    }

    var window: Window;
}

export {}