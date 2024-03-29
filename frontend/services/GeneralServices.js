import moment from "moment";

export default class GeneralServices {
    format_value(value) {
        if (value == null) {
            return '-'
        }
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        return formatter.format(value);
    }

    format_date(dateText) {
        // Removing the 'Z' to ignore timezones
        return moment(dateText.replace('Z', '')).format('DD-MM-YYYY');
    }

    serialize(obj) {
        const str = [];
        for (const p in obj) {
            if (obj[p] != null) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    }
}
