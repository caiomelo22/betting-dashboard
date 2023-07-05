export default {
    name: 'EditDepositedValueDialog',
    props: {
        depositedValueProp: Number
    },
    data: () => ({
        depositedValue: 0,
    }),
    created() {
        this.depositedValue = this.depositedValueProp
    },
    methods: {
        async update_value() {
            const deposited = parseFloat(this.depositedValue)
            await this.$axios.put(`config/update-deposited-value`, { deposited })
            return this.$emit('update', deposited);
        }
    }
}