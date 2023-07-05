import moment from "moment";
export default class ValidationService {
  required(value) {
    return () => (value != null && value !== "") || "Required";
  }

  positiveNumber(value) {
    return () => (value && parseInt(value) > 0) || "Value must be a positive number";
  }

  validDate(date) {
    const dateParsed = moment(date, 'YYYY-MM-DD');
    return () =>
      (!date || (date &&
        dateParsed.year() > 1600 &&
        dateParsed.isValid())) || "Date is not valid";
  }
}
