// store/index.js

export const state = () => ({
    accessToken: null,
    refreshToken: null,
});

export const mutations = {
    setTokens(state, { accessToken, refreshToken }) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;

        // Vue.$cookies.set('accessToken', accessToken);
        // Vue.$cookies.set('refreshToken', refreshToken);
    },
    clearTokens(state) {
        state.accessToken = null;
        state.refreshToken = null;

        // Vue.$cookies.remove('accessToken');
        // Vue.$cookies.remove('refreshToken');
    },
};

// // Load tokens from cookies on store initialization
// const accessToken = Vue.$cookies.get('accessToken');
// const refreshToken = Vue.$cookies.get('refreshToken');

// if (accessToken && refreshToken) {
//   state.accessToken = accessToken;
//   state.refreshToken = refreshToken;
// }