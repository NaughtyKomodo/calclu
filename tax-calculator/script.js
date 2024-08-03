document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  const adminForm = document.getElementById("adminForm");

  // Data storage
  const storageKey = "taxData";
  let taxData = JSON.parse(localStorage.getItem(storageKey)) || {};

  if (userForm) {
    userForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userId = document.getElementById("userId").value;
      const paymentDate = new Date(
        document.getElementById("paymentDate").value
      );
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = "";

      if (!taxData[userId]) {
        resultDiv.innerHTML = "ID Unik tidak ditemukan.";
        return;
      }

      const { dueDate, baseAmount, discountRate, penaltyFee } = taxData[userId];
      const dueDateObj = new Date(dueDate);
      const timeDiff = dueDateObj - paymentDate;
      const monthDiff = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30));
      let totalAmount = baseAmount;

      if (monthDiff > 0) {
        const discount = (monthDiff * discountRate * baseAmount) / 100;
        totalAmount -= discount;
        resultDiv.innerHTML = `Total yang harus dibayar: Rp${totalAmount.toFixed(
          2
        )} (dengan potongan diskon Rp${discount.toFixed(2)})`;
      } else if (monthDiff === 0) {
        resultDiv.innerHTML = `Total yang harus dibayar: Rp${totalAmount.toFixed(
          2
        )} (tepat waktu, tanpa diskon atau denda)`;
      } else {
        const penalty = penaltyFee;
        totalAmount += penalty;
        resultDiv.innerHTML = `Total yang harus dibayar: Rp${totalAmount.toFixed(
          2
        )} (dengan denda Rp${penalty.toFixed(2)})`;
      }
    });
  }

  if (adminForm) {
    adminForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userId = document.getElementById("adminUserId").value;
      const dueDate = document.getElementById("dueDate").value;
      const baseAmount = parseFloat(
        document.getElementById("baseAmount").value
      );
      const discountRate = parseFloat(
        document.getElementById("discountRate").value
      );
      const penaltyFee = parseFloat(
        document.getElementById("penaltyFee").value
      );

      taxData[userId] = { dueDate, baseAmount, discountRate, penaltyFee };
      localStorage.setItem(storageKey, JSON.stringify(taxData));

      const adminResultDiv = document.getElementById("adminResult");
      adminResultDiv.innerHTML = `Data untuk ID ${userId} berhasil disimpan.`;

      // Debugging: Logging the saved data
      console.log("Data tersimpan:", JSON.stringify(taxData, null, 2));
    });
  }
});
