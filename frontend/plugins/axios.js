export default function ({ $axios, redirect, store, $toast }) {
    $axios.interceptors.request.use((config) => {
        const accessToken = store.state.accessToken;

        if (accessToken) {
            config.headers.common.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });

    $axios.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        const { response, config } = error;

        if (response?.status == 401) {
            redirect('/auth/login');
            return Promise.reject(error);
        }

        if (config.url.includes('refresh-token')) {
            return Promise.reject(error);
        }

        if (response?.status === 403) {
            const accessToken = store.state.accessToken;

            if (accessToken) {
                try {
                    const refreshedTokenResponse = await $axios.post('/auth/refresh-token', {
                        token: store.state.refreshToken
                    });

                    store.commit('setAccessToken', refreshedTokenResponse.data.accessToken);

                    config.headers.Authorization = `Bearer ${refreshedTokenResponse.data.accessToken}`;
                    return $axios(config);
                } catch (refreshError) {
                    $toast.error("Login expired")
                    redirect('/auth/login');
                    return Promise.reject(error);
                }
            } else {
                $toast.error("Login expired")
                redirect('/auth/login');
                return Promise.reject(error);
            }
        }

        if (response?.data) {
            $toast.error(response.data);
        } else {
            $toast.error('An error occurred. Please try again later.');
        }
        return Promise.reject(error);
    });
}
