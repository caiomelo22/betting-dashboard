// store/index.js

export const state = () => ({
    accessToken: null,
    refreshToken: null,
});

export const mutations = {
    setAccessToken(state, accessToken) {
        state.accessToken = accessToken;

        this.$cookies.set('accessToken', accessToken);
    },
    setTokens(state, { accessToken, refreshToken }) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;

        this.$cookies.set('accessToken', accessToken);
        this.$cookies.set('refreshToken', refreshToken);
    },
    clearTokens(state) {
        state.accessToken = null;
        state.refreshToken = null;

        this.$cookies.remove('accessToken');
        this.$cookies.remove('refreshToken');
    },
};