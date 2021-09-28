import axios from 'axios';

class Pub {
    protected url: string;

    protected async fetchMenu() {
        try {
            const { data } = await axios.get(this.url);
            return data;
        } catch (err) {
            console.error(`ERROR: An error occurred while trying to fetch the URL: ${this.url}: ${err.message}`);
        }
    }
}

export default Pub;