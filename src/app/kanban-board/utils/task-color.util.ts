export default class TaskColorUtil {
    static #colors = [
        { "color": "#94b0c2", "numberOfTimesUsed": 0 },
        { "color": "#73eff7", "numberOfTimesUsed": 0 },
        { "color": "#a7f070", "numberOfTimesUsed": 0 },
        { "color": "#ffcd75", "numberOfTimesUsed": 0 }
    ];

    static randomColor(): string {
        if (this.#colors.every(color => color.numberOfTimesUsed === 0)) {
            this.#colors[Math.floor(Math.random() * this.#colors.length)].numberOfTimesUsed++;
        } else {
            this.#colors[this.#colors.length - 1].numberOfTimesUsed++;
        }
        this.#colors = this.#colors.sort((c1, c2) =>
            (c1.numberOfTimesUsed > c2.numberOfTimesUsed) ? -1
                : ((c2.numberOfTimesUsed > c1.numberOfTimesUsed) ? 1 : 0));

        return this.#colors[this.#colors.length - 1].color;
    };
}