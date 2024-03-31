export default class TaskColorUtil {
    static #colors = [
        { "color": "#94b0c2", "numberOfTimesUsed": 0 },
        { "color": "#73eff7", "numberOfTimesUsed": 0 },
        { "color": "#a7f070", "numberOfTimesUsed": 0 },
        { "color": "#ffcd75", "numberOfTimesUsed": 0 }
    ];

    static randomColor(): string {
        if (this.#colors.some(color => color.numberOfTimesUsed !== 0)) {
            this.#colors[this.#colors.length - 1].numberOfTimesUsed++;
        } else {
            this.#colors[Math.floor(Math.random() * this.#colors.length)].numberOfTimesUsed++;
        }
        this.#colors = this.#colors.sort(({ numberOfTimesUsed }, { numberOfTimesUsed: numberOfTimesUsed2 }) =>
            (numberOfTimesUsed > numberOfTimesUsed2) ? -1
                : ((numberOfTimesUsed2 > numberOfTimesUsed) ? 1 : 0));

        return this.#colors[this.#colors.length - 1].color;
    };
}