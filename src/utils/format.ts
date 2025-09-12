export const toFa = (n: number | string) => Number(n || 0).toLocaleString("fa-IR");

export const toEnDigits = (str: string) =>
  (str || "")
    .replace(/[۰-۹]/g, (d: string) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    .replace(/[^0-9.]/g, "");
