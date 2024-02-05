export default {
    name: 'Register',
    data: () => ({
        loading: false,
        username: '',
        email: '',
        password: '',
    }),
    computed: {
    },
    created() {
        const accessToken = this.$cookies.get('accessToken');
        const refreshToken = this.$cookies.get('refreshToken');
        console.log("accessToken", accessToken)
        console.log("refreshToken", refreshToken)
    },
    methods: {
        async registerUser() {
            try {
                this.loading = true;

                const response = await this.$http.post('/auth/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                });

                const { accessToken, refreshToken } = response.data;

                this.$store.commit('setTokens', { accessToken, refreshToken });

                this.loading = false;
            } catch (error) {
                this.$toast.error(error);
            }
        },
    }
}