/* =====================================================
   FINTRACK - TRANSACTION SYSTEM
===================================================== */


/* =====================================================
   ELEMENT TRANSAKSI
===================================================== */

const transactionModal = document.getElementById("transactionModal");
const addTransactionButton = document.getElementById("addTransactionButton");
const closeTransactionModal = document.getElementById("closeTransactionModal");
const cancelTransactionButton = document.getElementById("cancelTransactionButton");

const transactionForm = document.getElementById("transactionForm");

const transactionTableBody = document.getElementById("transactionTableBody");
const emptyTransaction = document.getElementById("emptyTransaction");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const totalBalance = document.getElementById("totalBalance");

const searchTransaction = document.getElementById("searchTransaction");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");


/* =====================================================
   LOCAL STORAGE
===================================================== */

let transactions =
    JSON.parse(localStorage.getItem("fintrackTransactions")) || [];


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);

}


/* =====================================================
   SIMPAN KE LOCAL STORAGE
===================================================== */

function saveTransactions() {

    localStorage.setItem(
        "fintrackTransactions",
        JSON.stringify(transactions)
    );

}


/* =====================================================
   BUKA MODAL
===================================================== */

if (addTransactionButton) {

    addTransactionButton.addEventListener("click", function () {

        transactionModal.classList.add("active");

        setDefaultDate();

    });

}


/* =====================================================
   TUTUP MODAL
===================================================== */

function closeModal() {

    transactionModal.classList.remove("active");

}


if (closeTransactionModal) {

    closeTransactionModal.addEventListener(
        "click",
        closeModal
    );

}


if (cancelTransactionButton) {

    cancelTransactionButton.addEventListener(
        "click",
        closeModal
    );

}


/* =====================================================
   KLIK LUAR MODAL
===================================================== */

if (transactionModal) {

    transactionModal.addEventListener("click", function (event) {

        if (event.target === transactionModal) {

            closeModal();

        }

    });

}


/* =====================================================
   TANGGAL DEFAULT
===================================================== */

function setDefaultDate() {

    const dateInput =
        document.getElementById("transactionDate");

    if (!dateInput) return;

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    dateInput.value =
        `${year}-${month}-${day}`;

}


/* =====================================================
   TAMBAH TRANSAKSI
===================================================== */

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById("transactionName").value;

            const amount =
                Number(
                    document.getElementById("transactionAmount").value
                );

            const date =
                document.getElementById("transactionDate").value;

            const type =
                document.getElementById("transactionType").value;

            const category =
                document.getElementById("transactionCategory").value;

            const note =
                document.getElementById("transactionNote").value;


            /* =========================
               VALIDASI
            ========================== */

            if (
                !name ||
                !amount ||
                !date ||
                !type ||
                !category
            ) {

                alert("Mohon lengkapi semua data transaksi.");

                return;

            }


            /* =========================
               OBJECT TRANSAKSI
            ========================== */

            const newTransaction = {

                id: Date.now(),

                name: name,

                amount: amount,

                date: date,

                type: type,

                category: category,

                note: note

            };


            /* =========================
               MASUKKAN DATA
            ========================== */

            transactions.push(newTransaction);


            /* =========================
               SIMPAN
            ========================== */

            saveTransactions();


            /* =========================
               RESET FORM
            ========================== */

            transactionForm.reset();


            /* =========================
               TUTUP MODAL
            ========================== */

            closeModal();


            /* =========================
               UPDATE TAMPILAN
            ========================== */

            renderTransactions();

            updateSummary();


            alert("Transaksi berhasil ditambahkan.");

        }
    );

}


/* =====================================================
   NAMA KATEGORI
===================================================== */

function getCategoryName(category) {

    const categories = {

        food: "Makanan",

        transport: "Transportasi",

        entertainment: "Hiburan",

        shopping: "Belanja",

        education: "Pendidikan",

        other: "Lainnya"

    };

    return categories[category] || category;

}


/* =====================================================
   NAMA JENIS
===================================================== */

function getTypeName(type) {

    if (type === "income") {

        return "Pemasukan";

    }

    return "Pengeluaran";

}


/* =====================================================
   FORMAT TANGGAL
===================================================== */

function formatDate(date) {

    if (!date) return "-";

    const parts = date.split("-");

    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


/* =====================================================
   RENDER TRANSAKSI
===================================================== */

function renderTransactions() {

    if (!transactionTableBody) return;


    transactionTableBody.innerHTML = "";


    /* =========================
       FILTER
    ========================== */

    const search =
        searchTransaction
            ? searchTransaction.value.toLowerCase()
            : "";

    const selectedType =
        filterType
            ? filterType.value
            : "all";

    const selectedCategory =
        filterCategory
            ? filterCategory.value
            : "all";


    const filteredTransactions =
        transactions.filter(function (transaction) {


            const matchesSearch =
                transaction.name
                    .toLowerCase()
                    .includes(search);


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );

        });


    /* =========================
       EMPTY STATE
    ========================== */

    if (filteredTransactions.length === 0) {

        if (emptyTransaction) {

            emptyTransaction.style.display = "block";

        }

        return;

    }


    if (emptyTransaction) {

        emptyTransaction.style.display = "none";

    }


    /* =========================
       TAMPILKAN DATA
    ========================== */

    filteredTransactions
        .sort(function (a, b) {

            return new Date(b.date) - new Date(a.date);

        })
        .forEach(function (transaction) {


            const row =
                document.createElement("tr");


            const amountClass =
                transaction.type === "income"
                    ? "transactionIncome"
                    : "transactionExpense";


            const amountSymbol =
                transaction.type === "income"
                    ? "+"
                    : "-";


            row.innerHTML = `

                <td>
                    ${formatDate(transaction.date)}
                </td>

                <td>

                    <strong>
                        ${escapeHTML(transaction.name)}
                    </strong>

                    ${
                        transaction.note
                        ?
                        `<br>
                        <small style="
                            color:#6f7b96;
                        ">
                            ${escapeHTML(transaction.note)}
                        </small>`
                        :
                        ""
                    }

                </td>

                <td>

                    <span class="transactionCategory">

                        ${getCategoryName(transaction.category)}

                    </span>

                </td>

                <td class="${amountClass}">

                    ${getTypeName(transaction.type)}

                </td>

                <td class="${amountClass}">

                    ${amountSymbol}
                    ${formatRupiah(transaction.amount)}

                </td>

                <td>

                    <button
                        class="deleteTransaction"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        Hapus
                    </button>

                </td>

            `;


            transactionTableBody.appendChild(row);

        });

}


/* =====================================================
   HAPUS TRANSAKSI
===================================================== */

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Apakah kamu yakin ingin menghapus transaksi ini?"
        );


    if (!confirmDelete) return;


    transactions =
        transactions.filter(function (transaction) {

            return transaction.id !== id;

        });


    saveTransactions();

    renderTransactions();

    updateSummary();

}


/* =====================================================
   UPDATE SUMMARY
===================================================== */

function updateSummary() {

    let income = 0;

    let expense = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            income += Number(transaction.amount);

        }


        if (transaction.type === "expense") {

            expense += Number(transaction.amount);

        }

    });


    const balance =
        income - expense;


    if (totalIncome) {

        totalIncome.textContent =
            formatRupiah(income);

    }


    if (totalExpense) {

        totalExpense.textContent =
            formatRupiah(expense);

    }


    if (totalBalance) {

        totalBalance.textContent =
            formatRupiah(balance);

    }

}


/* =====================================================
   SEARCH
===================================================== */

if (searchTransaction) {

    searchTransaction.addEventListener(
        "input",
        renderTransactions
    );

}


/* =====================================================
   FILTER TYPE
===================================================== */

if (filterType) {

    filterType.addEventListener(
        "change",
        renderTransactions
    );

}


/* =====================================================
   FILTER CATEGORY
===================================================== */

if (filterCategory) {

    filterCategory.addEventListener(
        "change",
        renderTransactions
    );

}


/* =====================================================
   ESCAPE HTML
   Mencegah input HTML masuk ke tabel
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =====================================================
   LOAD DATA SAAT HALAMAN DIBUKA
===================================================== */

if (transactionTableBody) {

    renderTransactions();

    updateSummary();

}