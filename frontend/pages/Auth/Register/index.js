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
        this.$store.commit('clearTokens')
    },
    methods: {
        async registerUser() {
            try {
                this.loading = true;

                const response = await this.$axios.post('/auth/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                });

                const { accessToken, refreshToken } = response.data;

                this.$store.commit('setTokens', { accessToken, refreshToken });

                this.$router.push('/dashboard');

                this.loading = false;
            } catch (error) {
                this.username = ''
                this.email = ''
                this.password = ''
            }
        },
    }
}