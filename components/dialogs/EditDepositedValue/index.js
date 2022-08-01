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
      await this.$axios.put(`config/update-deposited-value`, { deposited: this.depositedValue })
      return this.$emit('update', parseFloat(this.depositedValue));
    }
  }
}