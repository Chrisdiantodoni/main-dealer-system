export function formatRupiah(amount) {
  // Menggunakan fungsi toLocaleString untuk mengubah angka menjadi format mata uang
  if (!amount) return amount;

  // Format angka tanpa desimal terlebih dahulu
  const formattedWithoutDecimal = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);

  // Memisahkan angka menjadi bagian sebelum dan setelah desimal
  const parts = formattedWithoutDecimal.split(",");

  // Menambahkan spasi di antara angka ribuan pada bagian sebelum desimal
  const formattedWithSpace = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Menggabungkan kembali angka yang telah diformat dengan bagian desimal (jika ada)
  const finalFormatted =
    parts.length > 1 ? formattedWithSpace + "," + parts[1] : formattedWithSpace;

  // Mengembalikan hasil format dengan simbol mata uang 'Rp' di depan
  return "Rp " + finalFormatted;
}
export const inputCurrency = (number) => {
  return new Intl.NumberFormat("id-ID").format(number);
};

export const numberFormatter = (amount) => {
  // If amount is already a number, return it immediately
  if (typeof amount === "number") {
    return amount;
  }

  // If amount is undefined, return 0
  if (amount === undefined) {
    return 0;
  }

  // If amount is a string, parse it and format
  const number = parseFloat(amount.replace(/[,.]/g, "")) || 0;
  const integerValue = Math.floor(number) || 0;
  return integerValue;
};

export const handleWheelBlur = (event) => {
  event.target.blur();
};
