
export const TOTAL_GIFT = 80;
export const NUMBER_OF_TILES = 15;

// Distribution calculation for 80€ over 15 tiles
// 1x 15€, 1x 10€, 2x 8€, 3x 5€, 4x 3€, 4x 3€ (Wait, 4+4=8. 1+1+2+3+8 = 15)
// Let's refine:
// 1x 15€ (15)
// 1x 10€ (25)
// 2x 7€ (39)
// 3x 5€ (54)
// 4x 4€ (70)
// 4x 2.50€ (80)
export const AMOUNTS = [
  15, 10, 7, 7, 5, 5, 5, 4, 4, 4, 4, 2.5, 2.5, 2.5, 2.5
].sort(() => Math.random() - 0.5);

export const COLORS = {
  christmasRed: '#c41e3a',
  christmasGreen: '#165b33',
  gold: '#d4af37',
  snow: '#f8f9fa'
};
