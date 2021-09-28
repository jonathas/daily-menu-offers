class Util {

    public addTrailingZero(x: number) {
        return (x < 10) ? `0${x}` : x;
    }

}

export default new Util();
