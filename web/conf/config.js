const config = {
    // Show console logs of application
    DEBUG: false,
    // Allow fake auth (only if ADFS is not working, for testing purpose only)
    ALLOW_FAKE_AUTH: true,
    // true = redirect SSo login process is automatic on /login page
    // False = user has to click on authentification button to execute SSO auth process
    AUTOLOGIN: false,
    // Token duration in seconds, 0 = until ADFS expires (1 hour), XX = token will expire in XX seconds.
    TOKEN_DURATION: 0,
    ADFS_BASE_URL: "#",
    ADFS_URL: "#",

    // ADFS CONFIGURATION
    GRANT_TYPE: '#',
    CLIENT_ID: '#',
    REDIRECT_URI: '#',
    RESOURCE: '#',

    PROJECT_ADMIN_GROUP_ID: "S-1-5-21-1898398884-2118664892-1232828436-9129",
    PROJECT_GROUP_ID: "S-1-5-21-1898398884-2118664892-1232828436-13283"
};

/**
 * Object.freeze() to prevent modifying from client console...
 * */
window.configuration = Object.freeze(config);