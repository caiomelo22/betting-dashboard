import moment from "moment";

export default class GeneralServices {
    formatValue(value) {
        if (value == null) {
            return '-'
        }
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        return formatter.format(value);
    }

    formatDate(dateText) {
        // Removing the 'Z' to ignore timezones
        return moment(dateText.replace('Z', '')).format('DD-MM');
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

    async getSportsbooks(axios) {
        const response = await axios.get(`bet/sportsbooks/list`)
        return response.data
    }

    async getSportsChain(axios) {
        const response = await axios.get(`bet/sports-chain`)
        return response.data
    }

    async getBetTypeOptions(axios) {
        const response = await axios.get(`bet-type/list`)
        return response.data
    }
}
