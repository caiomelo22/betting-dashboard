import ValidationService from "@/services/ValidationService";
import GeneralServices from "@/services/GeneralServices";
import { NumberFieldEnum } from "@/shared/enums/NumberFieldEnum";
export default {
  name: "NumberField",
  data: () => ({
    validationService: new ValidationService(),
    generalServices: new GeneralServices(),
    numberFieldEnum: NumberFieldEnum
  }),
  computed: {
    value: {
      get() {
        if (this.disabled && typeof this.fieldValue === "number") {
          return this.fieldValue.toFixed(2);
        }
        return this.fieldValue;
      },
      set(newValue) {
        if (newValue === null || newValue === "") {
          this.$emit("update", 0);
        } else if (this.type === this.numberFieldEnum.Score) {
          this.$emit("update", parseInt(newValue));
        } else {
          this.$emit("update", parseFloat(newValue));
        }
      }
    }
  },
  props: {
    fieldTitle: String,
    fieldValue: Number,
    type: {
      type: Number,
      default: NumberFieldEnum.Score
    },
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
