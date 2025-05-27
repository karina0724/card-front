import * as Yup from "yup";

export const cardSchema = Yup.object().shape({
  number: Yup.string()
    .matches(/^\d{16}$/, "El número de tarjeta debe contener exactamente 16 dígitos numéricos.")
    .required("El número de tarjeta es obligatorio."),
  holder: Yup.string()
    .matches(/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/, "El nombre debe contener solo letras y espacios.")
    .max(20, "El nombre no puede superar los 20 caracteres.")
    .required("El nombre del titular es obligatorio."),
  expiry: Yup.string()
    .trim()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "La fecha debe estar en formato MM/YY.")
    .required("La fecha de vencimiento es obligatoria.")
    .test("not-expired", "La tarjeta ha expirado.", function (value) {
      if (!value) return false;

      const [monthStr, yearStr] = value.split("/");
      const month = Number(monthStr);
      const year = Number(yearStr);

      if (isNaN(month) || isNaN(year)) return false;

      const now = new Date();

      // Convert two-digit year to full year (e.g. 25 → 2025, 99 → 2099, 01 → 2001)
      const currentYear = now.getFullYear();
      const currentCentury = Math.floor(currentYear / 100) * 100;
      let fullYear = currentCentury + year;

      // If fullYear is more than 50 years in the past, assume it's for next century (e.g. 49 → 2049, 50 → 2050, 51 → 1951 ❌ → 2151 ✅)
      if (fullYear < currentYear - 50) {
        fullYear += 100;
      }

      // Use last second of expiration month
      const expirationDate = new Date(fullYear, month, 0, 23, 59, 59);

      return expirationDate >= now;
    }),
  cvv: Yup.string()
    .matches(/^\d{3,4}$/, "El CVV debe contener 3 o 4 dígitos.")
    .required("El CVV es obligatorio."),
});
