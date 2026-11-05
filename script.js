// ======================================
// SHAFFIQ & ADE - ADMIN SYSTEM
// LUXURY ROYAL MAROON & GOLD
// ======================================


// ======================================
// FUNGSI DASAR
// ======================================

function ambilData(kunci, defaultValue) {
    try {
        const data = localStorage.getItem(kunci);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function simpanLocal(kunci, data) {
    try {
        localStorage.setItem(kunci, JSON.stringify(data));
        return true;
    } catch (e) {
        alert("Penyimpanan penuh. Kurangi ukuran foto atau musik.");
        return false;
    }
}

function gabungDataUndangan(dataBaru) {
    let dataLama = ambilData("dataUndangan", {});
    let dataGabungan = Object.assign({}, dataLama, dataBaru);

    return simpanLocal("dataUndangan", dataGabungan);
}


// ======================================
// NAVIGASI ADMIN
// ======================================

function showPage(id) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.style.display = "none";
    });

    const halaman = document.getElementById(id);

    if (halaman) {
        halaman.style.display = "block";
    }
}


// ======================================
// DATA MEMPELAI DAN ACARA
// ======================================

const fieldIds = [
    "pria",
    "panggilan_pria",
    "ayah_pria",
    "ibu_pria",
    "wanita",
    "panggilan_wanita",
    "ayah_wanita",
    "ibu_wanita",
    "tanggal_akad",
    "jam_akad",
    "lokasi_akad",
    "tanggal_resepsi",
    "jam_resepsi",
    "lokasi_resepsi",
    "maps",
    "tema",
    "musik",
    "arab"
];

function simpanData() {
    let data = {};

    fieldIds.forEach(function(id) {
        const elemen = document.getElementById(id);

        if (elemen) {
            data[id] = elemen.value;
        }
    });

    if (gabungDataUndangan(data)) {
        alert("Data berhasil disimpan!");
    }
}

function muatData() {
    const data = ambilData("dataUndangan", {});

    fieldIds.forEach(function(id) {
        const elemen = document.getElementById(id);

        if (elemen && data[id] !== undefined) {
            elemen.value = data[id];
        }
    });
}


// ======================================
// FOTO MEMPELAI DAN GALERI
// ======================================

function kompresFoto(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();

            img.onload = function() {
                const canvas = document.createElement("canvas");

                let lebar = img.width;
                let tinggi = img.height;

                const maksimal = 1200;

                if (lebar > maksimal || tinggi > maksimal) {
                    const skala = Math.min(
                        maksimal / lebar,
                        maksimal / tinggi
                    );

                    lebar = lebar * skala;
                    tinggi = tinggi * skala;
                }

                canvas.width = lebar;
                canvas.height = tinggi;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, lebar, tinggi);

                resolve(
                    canvas.toDataURL("image/jpeg", 0.75)
                );
            };

            img.onerror = reject;
            img.src = event.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function simpanFoto() {
    const daftarFoto = [
        {
            input: "foto_pria",
            nama: "pria",
            preview: "preview_pria"
        },
        {
            input: "foto_wanita",
            nama: "wanita",
            preview: "preview_wanita"
        },
        {
            input: "foto_bersama",
            nama: "bersama",
            preview: "preview_bersama"
        }
    ];

    let foto = ambilData("fotoUndangan", {});

    try {
        for (const item of daftarFoto) {
            const input = document.getElementById(item.input);

            if (input && input.files && input.files[0]) {
                const hasil = await kompresFoto(input.files[0]);

                foto[item.nama] = hasil;
            }
        }

        if (simpanLocal("fotoUndangan", foto)) {
            tampilkanFoto();
            alert("Foto berhasil disimpan!");
        }

    } catch (error) {
        alert("Gagal memproses foto. Silakan coba foto lainnya.");
    }
}

function tampilkanFoto() {
    const foto = ambilData("fotoUndangan", {});

    const daftarFoto = [
        ["pria", "preview_pria"],
        ["wanita", "preview_wanita"],
        ["bersama", "preview_bersama"]
    ];

    daftarFoto.forEach(function(item) {
        const gambar = document.getElementById(item[1]);

        if (gambar && foto[item[0]]) {
            gambar.src = foto[item[0]];
            gambar.style.display = "block";
        }
    });
}


// ======================================
// WEDDING GIFT
// ======================================

function simpanGift() {
    const gift = {
        nama_bank: document.getElementById("nama_bank").value,
        nomor_rekening: document.getElementById("nomor_rekening").value,
        atas_nama: document.getElementById("atas_nama").value,
        alamat_gift: document.getElementById("alamat_gift").value
    };

    if (gabungDataUndangan({
        gift: gift,
        nama_bank: gift.nama_bank,
        nomor_rekening: gift.nomor_rekening,
        atas_nama: gift.atas_nama,
        alamat_gift: gift.alamat_gift
    })) {
        alert("Informasi Wedding Gift berhasil disimpan!");
    }
}

function muatGift() {
    const data = ambilData("dataUndangan", {});
    const gift = data.gift || data;

    const daftar = [
        "nama_bank",
        "nomor_rekening",
        "atas_nama",
        "alamat_gift"
    ];

    daftar.forEach(function(id) {
        const elemen = document.getElementById(id);

        if (elemen && gift[id] !== undefined) {
            elemen.value = gift[id];
        }
    });
}


// ======================================
// MENU UNDANGAN
// ======================================

let daftarMenu = ambilData("daftarMenu", [
    "Pembuka",
    "Mempelai",
    "Akad Nikah",
    "Resepsi",
    "Galeri",
    "Wedding Gift",
    "Buku Tamu"
]);

function simpanMenu() {
    simpanLocal("daftarMenu", daftarMenu);
}

function tampilkanMenu() {
    const tempat = document.getElementById("daftarMenu");

    if (!tempat) return;

    tempat.innerHTML = "";

    if (daftarMenu.length === 0) {
        tempat.innerHTML = "Belum ada menu.";
        return;
    }

    daftarMenu.forEach(function(menu, index) {
        const box = document.createElement("div");

        box.className = "item-box";

        const nama = document.createElement("span");
        nama.textContent = menu;

        const tombol = document.createElement("button");
        tombol.className = "danger";
        tombol.textContent = "Hapus";

        tombol.onclick = function() {
            hapusMenu(index);
        };

        box.appendChild(nama);
        box.appendChild(document.createElement("br"));
        box.appendChild(tombol);

        tempat.appendChild(box);
    });
}

function tambahMenu() {
    const input = document.getElementById("inputMenu");

    const nama = input.value.trim();

    if (nama === "") {
        alert("Masukkan nama menu terlebih dahulu.");
        return;
    }

    if (daftarMenu.includes(nama)) {
        alert("Menu sudah tersedia.");
        return;
    }

    daftarMenu.push(nama);

    simpanMenu();
    tampilkanMenu();

    input.value = "";

    alert("Menu berhasil ditambahkan!");
}

function hapusMenu(index) {
    if (!confirm("Yakin ingin menghapus menu ini?")) {
        return;
    }

    daftarMenu.splice(index, 1);

    simpanMenu();
    tampilkanMenu();
}


// ======================================
// TAMPILAN DAN MUSIK
// ======================================

async function simpanTampilan() {
    const inputMusik = document.getElementById("fileMusik");

    let data = {
        tema: document.getElementById("tema").value,
        musik: document.getElementById("musik").value,
        arab: document.getElementById("arab").value
    };

    if (inputMusik && inputMusik.files.length > 0) {
        const file = inputMusik.files[0];

        if (file.size > 1500000) {
            alert("Ukuran musik maksimal 1,5 MB untuk penyimpanan browser.");
            return;
        }

        try {
            data.namaMusik = file.name;
            data.musik = await bacaFile(file);
        } catch (e) {
            alert("Gagal membaca file musik.");
            return;
        }
    }

    if (gabungDataUndangan(data)) {
        alert("Pengaturan tampilan dan musik berhasil disimpan!");
    }
}

function bacaFile(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();

        reader.onload = function(event) {
            resolve(event.target.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}


// ======================================
// LINK UNDANGAN PUBLIK
// ======================================

function simpanLinkPublik() {
    const input = document.getElementById("linkUndangan");

    const link = input.value.trim();

    if (!link) {
        alert("Masukkan link undangan terlebih dahulu.");
        return;
    }

    try {
        const url = new URL(link);

        if (url.protocol !== "https:" && url.protocol !== "http:") {
            throw new Error("URL tidak valid");
        }

        if (simpanLocal("linkUndanganPublik", link)) {
            alert("Link undangan berhasil disimpan!");
        }

    } catch (e) {
        alert("Link tidak valid. Contoh: https://alamat-undangan");
    }
}

function muatLinkPublik() {
    const input = document.getElementById("linkUndangan");

    if (input) {
        input.value = ambilData("linkUndanganPublik", "");
    }
}


// ======================================
// MANAJEMEN DAFTAR TAMU
// ======================================

let daftarTamu = ambilData("daftarTamuShaffiqAde", []);

function simpanDaftarTamu() {
    return simpanLocal("daftarTamuShaffiqAde", daftarTamu);
}

function tambahTamu() {
    const input = document.getElementById("inputNamaTamu");

    const nama = input.value.trim();

    if (nama === "") {
        alert("Masukkan nama tamu terlebih dahulu.");
        return;
    }

    const tamu = {
        id: Date.now(),
        nama: nama
    };

    daftarTamu.push(tamu);

    if (simpanDaftarTamu()) {
        input.value = "";
        tampilkanTamu();

        alert("Nama tamu berhasil ditambahkan!");
    } else {
        daftarTamu.pop();
    }
}

function tampilkanTamu() {
    const tempat = document.getElementById("daftarTamu");
    const jumlah = document.getElementById("jumlahTamu");

    if (!tempat) return;

    tempat.innerHTML = "";

    if (jumlah) {
        jumlah.textContent = daftarTamu.length;
    }

    if (daftarTamu.length === 0) {
        tempat.textContent = "Belum ada tamu.";
        return;
    }

    daftarTamu.forEach(function(tamu) {
        const box = document.createElement("div");

        box.className = "item-box";

        const nama = document.createElement("strong");
        nama.textContent = tamu.nama;

        const tombolLink = document.createElement("button");
tombolLink.className = "small";
tombolLink.textContent = "Link Undangan";

tombolLink.onclick = function() {
    bagikanTamu(tamu.id);
};

const tombolSalin = document.createElement("button");
tombolSalin.className = "small";
tombolSalin.textContent = "📋 Salin Link";

tombolSalin.onclick = function() {
    salinLinkTamu(tamu.id);
};

        const tombolEdit = document.createElement("button");
        tombolEdit.className = "small";
        tombolEdit.textContent = "Edit";

        tombolEdit.onclick = function() {
            editTamu(tamu.id);
        };

        const tombolHapus = document.createElement("button");
        tombolHapus.className = "danger";
        tombolHapus.textContent = "Hapus";

        tombolHapus.onclick = function() {
            hapusTamu(tamu.id);
        };

        box.appendChild(nama);
        box.appendChild(document.createElement("br"));
        box.appendChild(tombolLink);
box.appendChild(tombolSalin);
box.appendChild(tombolEdit);
        box.appendChild(tombolHapus);

        tempat.appendChild(box);
    });
}

function editTamu(id) {
    const tamu = daftarTamu.find(function(item) {
        return item.id === id;
    });

    if (!tamu) return;

    const namaBaru = prompt("Ubah nama tamu:", tamu.nama);

    if (namaBaru === null) return;

    if (namaBaru.trim() === "") {
        alert("Nama tamu tidak boleh kosong.");
        return;
    }

    tamu.nama = namaBaru.trim();

    if (simpanDaftarTamu()) {
        tampilkanTamu();
    }
}

function hapusTamu(id) {
    if (!confirm("Yakin ingin menghapus tamu ini?")) {
        return;
    }

    const index = daftarTamu.findIndex(function(item) {
        return item.id === id;
    });

    if (index !== -1) {
        const tamuLama = daftarTamu.splice(index, 1)[0];

        if (simpanDaftarTamu()) {
            tampilkanTamu();
        } else {
            daftarTamu.splice(index, 0, tamuLama);
        }
    }
}


// ======================================
// BAGIKAN UNDANGAN MELALUI WHATSAPP
// ======================================

function buatLinkTamu(nama) {
    let link = document.getElementById("linkUndangan").value.trim();

    if (!link) {
        link = ambilData("linkUndanganPublik", "");
    }

    if (!link) {
        alert("Simpan link undangan publik terlebih dahulu.");
        return "";
    }

    try {
        const url = new URL(link);

        url.searchParams.set("to", nama);

        return url.toString();

    } catch (e) {
        alert("Link undangan tidak valid.");
        return "";
    }
}

function bagikanTamu(id) {
    const tamu = daftarTamu.find(function(item) {
        return item.id === id;
    });

    if (!tamu) return;

    const link = buatLinkTamu(tamu.nama);

    if (!link) return;

    const pesan =
        "Assalamu'alaikum Wr. Wb.\n\n" +
        "Kepada Yth. " + tamu.nama + "\n\n" +
        "Dengan hormat, kami mengundang Anda untuk menghadiri acara pernikahan kami.\n\n" +
        "Shaffiq & Ade\n\n" +
        "Silakan buka undangan melalui link berikut:\n" +
        link + "\n\n" +
        "Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir.\n\n" +
        "Terima kasih.";

    const whatsapp =
        "https://wa.me/?text=" + encodeURIComponent(pesan);

    window.open(whatsapp, "_blank");
}


// ======================================
// SAAT ADMIN DIBUKA
// ======================================

window.addEventListener("load", function() {

    muatData();

    tampilkanFoto();

    muatGift();

    tampilkanMenu();

    tampilkanTamu();

    muatLinkPublik();

    showPage("mempelai");

});
async function salinLinkTamu(id) {
    const tamu = daftarTamu.find(function(item) {
        return item.id === id;
    });

    if (!tamu) return;

    const link = buatLinkTamu(tamu.nama);

    if (!link) return;

    try {
        await navigator.clipboard.writeText(link);
        alert("Link undangan berhasil disalin!");
    } catch (e) {
        const input = document.createElement("textarea");
        input.value = link;
        document.body.appendChild(input);
        input.select();

        const berhasil = document.execCommand("copy");
        document.body.removeChild(input);

        if (berhasil) {
            alert("Link undangan berhasil disalin!");
        } else {
            prompt("Salin link berikut:", link);
        }
    }
}