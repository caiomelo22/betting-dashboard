import { NumberFieldEnum } from "~/shared/enums/NumberFieldEnum";
import NumberField from "~/components/textFields/NumberField/index.vue";
export default {
    name: 'AddFinancialActionDialog',
    components: { NumberField },
    data: () => ({
        value: 0,
        numberFieldEnum: NumberFieldEnum
    }),
    methods: {
        async update_value() {
            await this.$axios.put(`financial-history/update`, { value: this.value })
            return this.$emit('update', this.value);
        }
    }
}