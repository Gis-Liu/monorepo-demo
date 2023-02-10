export function formatRgbToHex(rgb: number[]) {
  return (
    "#" +
    rgb
      .map((r) => {
        let str = r.toString(16);
        if (str.length === 1) {
          str = "0" + str;
        }
        return str;
      })
      .join("")
  );
}
export const formatRgbStringToHex = (a: string) =>
  formatRgbToHex(a.split(",").map((r) => parseInt(r)));
