import NumberField from "~/components/textFields/NumberField/index.vue";
import GeneralServices from "~/services/GeneralServices";
export default {
  name: 'UpdateMatchDialog',
  components: { NumberField },
  data: () => ({
    generalServices: new GeneralServices(),
    loading: false,
    match: null
  }),
  props: {
    matchProp: Object,
    leagues: Array
  },
  created() {
    this.match = JSON.parse(JSON.stringify(this.matchProp))
  },
  methods: {
    async submit() {
      const result = this.$refs.form.validate();
      if (!result) {
        return;
      }
      this.loading = true
      await this.$axios.put(`match/update`, this.match)
        .then((resp) => {
          this.$emit('updated')
        })
        .catch((err) => {
          this.$toast.error(err.message)
        });
      this.loading = false
    }
  }
}