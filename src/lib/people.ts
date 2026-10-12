/**
 * Portraits whose cut-out is cropped flat on its own left/right edge (scripts/check-people-edges.mjs): the fraction of
 * the image height, from the bottom, that must sit BELOW the card edge so no side cut shows in mid-air (16.2 rule 1).
 */
export const SIDE_CUT_SINK: Record<string, number> = {
  "/people/andrea-belotti.webp": 0.27,
  "/people/andrea-zonca.webp": 0.26,
  "/people/beatrice-parimbelli.webp": 0.23,
  "/people/francesco-crivena.webp": 0.24,
  "/people/lorenzo-ciresa.webp": 0.31,
  "/people/nicholas-previtali.webp": 0.34,
  "/people/simone-mazzoleni.webp": 0.23,
  "/people/stefano-crivena.webp": 0.36,
  "/people/poses/nicholas-previtali--pose-alt.webp": 0.33,
};
