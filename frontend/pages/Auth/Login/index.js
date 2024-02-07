export default {
    name: 'Register',
    data: () => ({
        loading: false,
        username: '',
        password: '',
    }),
    computed: {
    },
    created() {
        this.$store.commit('clearTokens')
    },
    methods: {
        async registerUser() {
            try {
                this.loading = true;

                const response = await this.$axios.post('/auth/login', {
                    username: this.username,
                    password: this.password,
                });

                const { accessToken, refreshToken } = response.data;

                this.$store.commit('setTokens', { accessToken, refreshToken });

                this.$router.push('/dashboard');

                this.loading = false;
            } catch (error) {
                this.username = ''
                this.password = ''
            }
        },
    }
}