export default class TaskColorUtil {
  static PALETTE = {
    PRIMARY_PALETTE: 'primary',
    SECONDARY_PALETTe: 'secondary',
  };
  static #primaryColorsPalette = ['#94b0c2', '#73eff7', '#a7f070', '#ffcd75'];
  static #secondaryColorsPalette = [
    '#9d94c2ff',
    '#73f796ff',
    '#e1f070ff',
    '#ff9c75ff',
  ];
  static #primaryRareColors = this.#primaryColorsPalette.map((color) => {
    return { color, numberOfTimesUsed: 0 };
  });
  static #secondaryRareColors = this.#secondaryColorsPalette.map((color) => {
    return { color, numberOfTimesUsed: 0 };
  });

  static randomColor(palette: string): string {
    return palette === this.PALETTE.PRIMARY_PALETTE
      ? this.#randomColor(this.#primaryColorsPalette)
      : this.#randomColor(this.#secondaryColorsPalette);
  }

  static #randomColor(colors: string[]): string {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  static randomRareColor(palette: string): string {
    return palette === this.PALETTE.PRIMARY_PALETTE
      ? this.#randomRareColor(this.#primaryRareColors)
      : this.#randomRareColor(this.#secondaryRareColors);
  }

  static #randomRareColor(
    rareColors: { color: string; numberOfTimesUsed: number }[]
  ): string {
    if (rareColors.some((color) => color.numberOfTimesUsed !== 0)) {
      rareColors[rareColors.length - 1].numberOfTimesUsed++;
    } else {
      rareColors[Math.floor(Math.random() * rareColors.length)]
        .numberOfTimesUsed++;
    }
    rareColors = rareColors.sort(
      ({ numberOfTimesUsed }, { numberOfTimesUsed: numberOfTimesUsed2 }) =>
        numberOfTimesUsed > numberOfTimesUsed2
          ? -1
          : numberOfTimesUsed2 > numberOfTimesUsed
          ? 1
          : 0
    );

    return rareColors[rareColors.length - 1].color;
  }
}
