export default class TaskColorUtil {
  static #colors = ['#94b0c2', '#73eff7', '#a7f070', '#ffcd75'];
  static #rareColors = this.#colors.map((color) => {
    return { color, numberOfTimesUsed: 0 };
  });

  static randomColor(): String {
    return this.#colors[Math.floor(Math.random() * this.#colors.length)];
  }

  static randomRareColor(): string {
    if (this.#rareColors.some((color) => color.numberOfTimesUsed !== 0)) {
      this.#rareColors[this.#rareColors.length - 1].numberOfTimesUsed++;
    } else {
      this.#rareColors[Math.floor(Math.random() * this.#rareColors.length)]
        .numberOfTimesUsed++;
    }
    this.#rareColors = this.#rareColors.sort(
      ({ numberOfTimesUsed }, { numberOfTimesUsed: numberOfTimesUsed2 }) =>
        numberOfTimesUsed > numberOfTimesUsed2
          ? -1
          : numberOfTimesUsed2 > numberOfTimesUsed
          ? 1
          : 0
    );

    return this.#rareColors[this.#rareColors.length - 1].color;
  }
}
