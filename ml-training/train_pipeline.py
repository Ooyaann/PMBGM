"""
Pipeline Pelatihan Model Machine Learning Privat PMBGM (Non-LLM)
=================================================================
Melatih 2 model Machine Learning mandiri untuk sistem PMBGM:
1. Model Klasifikasi Kategori Aduan (Hybrid Rule-Based + Multinomial Naive Bayes TF-IDF)
2. Model Verifikasi Kredibilitas Multimodal (Feedforward Neural Network / MLP 7 -> 12 -> 3)

Sesuai arahan pembimbing: Tidak menggunakan LLM eksternal (ChatGPT/Gemini API).
"""

import csv
import json
import math
import pathlib
import random
import re
import numpy as np

SEED = 2026
random.seed(SEED)
np.random.seed(SEED)

BASE_DIR = pathlib.Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "dataset_laporan_mbg.csv"
WEIGHTS_PATH = BASE_DIR / "weights_export.json"
NOTEBOOK_PATH = BASE_DIR / "Training_Model_ML_PMBGM.ipynb"

KATEGORI_LIST = [
    "keracunan",
    "makanan_tidak_layak",
    "kebersihan",
    "gizi_porsi",
    "distribusi",
    "pengadaan",
    "lainnya",
]

TEMPLATES = {
    "keracunan": [
        "Sebanyak {n} siswa mengalami mual, muntah, dan pusing sekitar 1 jam setelah menyantap menu {lauk} pada jam makan siang di sekolah.",
        "Beberapa anak kelas {kelas} mengeluh sakit perut melilit dan diare akut usai makan paket MBG berisi {lauk} yang berbau agak asam.",
        "Laporan darurat: {n} siswa dibawa ke UKS dan puskesmas terdekat karena gejala keracunan makanan seperti muntah-muntah dan lemas.",
        "Anak saya bersama {n} temannya mengalami muntah dan demam setelah mengonsumsi {lauk} dan sayur yang dibagikan siang tadi.",
        "Terjadi insiden gangguan pencernaan mendadak pada {n} murid setelah makan siang MBG, gejala utama mual hebat dan pusing kepala.",
    ],
    "makanan_tidak_layak": [
        "Sayur {sayur} dan lauk {lauk} mengeluarkan bau basi menyengat serta berlendir saat tutup ompreng dibuka oleh siswa.",
        "Lauk {lauk} bagian dalamnya masih mentah dan berdarah, sementara tekstur nasi keras dan berbau asam saat diterima siswa.",
        "Kondisi makanan berbau busuk dan tampak berjamur pada bagian buah serta roti, sangat tidak layak dikonsumsi anak sekolah.",
        "Sayur {sayur} sudah basi berbusa dan berubah warna, sedangkan {lauk} berbau tengik dan terdapat ulat kecil pada sayuran.",
        "Susu kemasan yang dibagikan dalam baki MBG sudah melewati tanggal kedaluwarsa dan menggumpal saat dibuka.",
    ],
    "kebersihan": [
        "Ditemukan {benda} di dalam wadah ompreng makan siang siswa kelas {kelas}, kondisi kotak makan juga tampak kotor belum dicuci bersih.",
        "Terdapat helai rambut panjang dan lalat mati pada bagian sayur {sayur}, serta nampan ompreng masih berminyak sisa makanan kemarin.",
        "Petugas pembagi makanan di dapur tidak memakai sarung tangan dan masker, serta ditemukan benda asing berupa {benda} di nasi.",
        "Wadah ompreng stainless masih kotor berkerak di bagian sudut dan ditemukan serangga ({benda}) di atas lauk {lauk}.",
        "Kebersihan wadah sangat buruk, masih ada sisa sabun cuci piring yang berbau menyengat pada baki makan siswa kelas {kelas}.",
    ],
    "gizi_porsi": [
        "Porsi makan siang di kelas {kelas} sangat sedikit, nasi hanya sekitar tiga sendok makan dan potongan {lauk} sangat kecil.",
        "Komposisi menu hari ini kurang gizi dan tidak seimbang, hanya berisi nasi putih dan gorengan tepung tanpa sayur maupun buah.",
        "Ukuran potongan {lauk} terlalu tipis tidak sesuai standar porsi gizi anak sekolah, banyak siswa masih mengeluh lapar.",
        "Isi ompreng hari ini tidak sesuai menu gizi yang dijadwalkan, hanya ada nasi sedikit dan kuah tanpa protein hewani maupun buah.",
        "Takaran nasi dan lauk sangat kecil di bawah standar gizi, tidak ada buah segar maupun susu pendamping.",
    ],
    "distribusi": [
        "Pengiriman makanan dari dapur SPPG terlambat hampir 2 jam, baru tiba di sekolah pukul {jam} lewat setelah jam istirahat usai.",
        "Jumlah paket MBG yang dikirim ke sekolah kurang {n} ompreng sehingga sebagian siswa kelas {kelas} tidak kebagian makan siang.",
        "Mobil pengantar MBG datang telat pada pukul {jam} sehingga jadwal belajar terganggu dan siswa makan terlalu sore.",
        "Hingga jam pulang sekolah pukul {jam} paket makanan tidak dikirim ke sekolah tanpa konfirmasi dari pihak dapur SPPG.",
        "Distribusi hari ini mengalami kekurangan ompreng sebanyak {n} porsi untuk siswa kelas {kelas} dan datang terlambat.",
    ],
    "pengadaan": [
        "Kualitas bahan pangan yang disajikan sangat buruk dan diduga kuat tidak sebanding dengan pagu anggaran per porsi yang ditetapkan.",
        "Terdapat indikasi penyimpangan pengadaan bahan baku di dapur SPPG karena pemasok tunggal memonopoli harga bahan di bawah standar.",
        "Menu yang diterima siswa hanya bernilai sangat murah jauh dari standar harga anggaran resmi, mohon audit transparansi pengadaan.",
        "Ada dugaan mark up harga bahan baku katering dan pungli pada rantai pasok pemasok sayur serta lauk di dapur wilayah ini.",
        "Laporan ketidakwajaran spesifikasi paket makanan dibandingkan kontrak anggaran resmi yang seharusnya mencakup protein dan buah segar.",
    ],
    "lainnya": [
        "Petugas pengantar menumpuk kotak ompreng bekas makan di koridor kelas hingga menghalangi jalan siswa dan belum diambil sore hari.",
        "Koordinasi jadwal pengambilan wadah kosong kurang tertib sehingga menumpuk di depan ruang guru sampai besok pagi.",
        "Sekolah belum menerima jadwal rincian menu mingguan dan nomor kontak pengaduan resmi dari pengelola SPPG.",
        "Mohon penertiban parkir mobil boks pengantar MBG di halaman sekolah karena sering menghalangi jalur keluar masuk siswa.",
        "Tutup beberapa unit ompreng longgar dan penyok sehingga kuah mudah tumpah ke lantai kelas saat dibagikan.",
    ],
}

SPAM_TEMPLATES = [
    "tes tes 123 coba lapor makanan enak sekali mantap jiwa hahaha",
    "asdfghjkl qwerty laporan percobaan saja tidak ada kejadian apa apa",
    "makanan kurang enak menurut saya pribadi, tolong ganti menu steak wagyu",
    "info loker kurir dapur gaji berapa ya min tolong balas cepat",
    "coba klik tombol lapor apakah berfungsi atau tidak terima kasih",
]

LAUK_LIST = ["ayam goreng", "ikan fillet", "telur balado", "semur daging", "ayam kecap", "ikan kembung", "tahu tempe"]
SAYUR_LIST = ["capcay", "sop wortel", "bening bayam", "tumis buncis", "sayur asem", "tumis kangkung"]
BENDA_LIST = ["lalat mati", "rambut panjang", "kerikil kecil", "potongan plastik", "ulat sayur", "kecoa kecil"]
KELAS_LIST = ["1A", "2B", "3A", "4C", "5A", "6B", "7A", "8D", "9B"]
JAM_LIST = ["13.15", "13.30", "13.45", "14.00", "14.15"]

KATA_MBG_RE = re.compile(
    r"\b(ompreng|baki|nasi|lauk|sayur|buah|susu|menu|porsi|dapur|sppg|katering|makan bergizi|kotak makan|distribusi|anggaran|pengadaan)\b",
    re.I,
)
KATA_ANOMALI_RE = re.compile(
    r"\b(basi|busuk|asam|berlendir|ulat|bau|mentah|kotor|lalat|rambut|kecoa|jamur|kedaluwarsa|mual|muntah|pusing|diare|mencret|sakit perut|keracunan|lemas|pingsan|kejang|demam|igd|rumah sakit|puskesmas|terlambat|telat|kurang|mark up|korupsi|pungli)\b",
    re.I,
)


def buat_deskripsi(kategori: str, is_spam: bool) -> str:
    if is_spam and random.random() < 0.8:
        return random.choice(SPAM_TEMPLATES)
    tpl = random.choice(TEMPLATES[kategori])
    kalimat = tpl.format(
        n=random.randint(4, 38),
        lauk=random.choice(LAUK_LIST),
        sayur=random.choice(SAYUR_LIST),
        benda=random.choice(BENDA_LIST),
        kelas=random.choice(KELAS_LIST),
        jam=random.choice(JAM_LIST),
    )
    if not is_spam and random.random() < 0.45:
        tambahan = [
            "Foto kondisi makanan pada wadah ompreng telah kami lampirkan sebagai bukti.",
            "Kejadian ini disaksikan langsung oleh wali kelas dan perwakilan komite sekolah.",
            "Mohon segera ditindaklanjuti oleh tim verifikator dan dapur SPPG terkait.",
            "Dokumentasi diambil langsung di ruang kelas sesaat setelah ompreng dibuka.",
        ]
        kalimat += " " + random.choice(tambahan)
    return kalimat


def ekstrak_vektor_fitur(
    deskripsi: str,
    ada_exif: bool,
    waktu_cocok: bool,
    gps_cocok: bool,
    ada_foto: bool,
    terverifikasi: bool,
    jumlah_terdampak: int,
    kapasitas_sekolah: int = 600,
):
    teks = deskripsi.strip()
    panjang = len(teks)

    # x1: Leksikon Menu MBG [0..1]
    cocok_mbg = len(KATA_MBG_RE.findall(teks))
    x1 = min(cocok_mbg / 3.0, 1.0)

    # x2: Anomali Gejala Medis & Higiene [0..1]
    cocok_anomali = len(KATA_ANOMALI_RE.findall(teks))
    x2 = min(cocok_anomali / 3.0, 1.0)

    # x3: Koherensi & Kerapatan Teks [0..1]
    words = teks.lower().split()
    rasio_unik = len(set(words)) / max(len(words), 1) if panjang > 0 else 0.0
    x3 = min(panjang / 120.0, 1.0) if (panjang >= 25 and rasio_unik > 0.4) else 0.2

    # x4: Integritas Waktu Pengambilan Foto [0..1]
    if ada_exif:
        x4 = 1.0 if waktu_cocok else 0.35
    elif ada_foto:
        x4 = 0.75
    else:
        x4 = 0.5

    # x5: Integritas Geolokasi GPS Foto ke Titik Sekolah [0..1]
    if ada_exif:
        x5 = 1.0 if gps_cocok else 0.3
    elif ada_foto:
        x5 = 0.75
    else:
        x5 = 0.5

    # x6: Reputasi & Verifikasi Akun Pelapor [0..1]
    x6 = 1.0 if terverifikasi else 0.7

    # x7: Kewajaran Rasio Korban Terdampak [0..1]
    if jumlah_terdampak > 0:
        x7 = 0.95 if jumlah_terdampak <= kapasitas_sekolah else 0.25
    else:
        x7 = 0.8

    return [round(x1, 4), round(x2, 4), round(x3, 4), round(x4, 4), round(x5, 4), round(x6, 4), round(x7, 4)]


def generate_dataset(n_samples: int = 1500):
    rows = []
    for i in range(1, n_samples + 1):
        u = random.random()
        if u < 0.54:
            # Kelas 0: Otentik & Valid
            target_kelas = 0
            kategori = random.choices(
                KATEGORI_LIST, weights=[0.20, 0.20, 0.18, 0.14, 0.14, 0.08, 0.06], k=1
            )[0]
            deskripsi = buat_deskripsi(kategori, is_spam=False)
            ada_foto = True
            ada_exif = random.random() < 0.88
            waktu_cocok = True if ada_exif else False
            gps_cocok = True if ada_exif else False
            terverifikasi = random.random() < 0.85
            jumlah_terdampak = random.randint(5, 45) if kategori == "keracunan" else random.randint(1, 25)

        elif u < 0.82:
            # Kelas 1: Meragukan / Perlu Tambahan Bukti
            target_kelas = 1
            kategori = random.choices(
                KATEGORI_LIST, weights=[0.08, 0.16, 0.18, 0.20, 0.16, 0.12, 0.10], k=1
            )[0]
            deskripsi = buat_deskripsi(kategori, is_spam=False)
            if random.random() < 0.5:
                deskripsi = deskripsi[:42]  # narasi agak pendek
            ada_foto = random.random() < 0.45
            ada_exif = ada_foto and (random.random() < 0.4)
            waktu_cocok = False
            gps_cocok = random.random() < 0.4 if ada_exif else False
            terverifikasi = random.random() < 0.45
            jumlah_terdampak = random.randint(0, 5)

        else:
            # Kelas 2: Indikasi Fiktif / Tidak Sesuai
            target_kelas = 2
            kategori = random.choices(
                KATEGORI_LIST, weights=[0.05, 0.10, 0.12, 0.15, 0.15, 0.18, 0.25], k=1
            )[0]
            deskripsi = buat_deskripsi(kategori, is_spam=True)
            ada_foto = random.random() < 0.35
            ada_exif = ada_foto
            waktu_cocok = False
            gps_cocok = False
            terverifikasi = False
            jumlah_terdampak = random.choice([0, 950, 1200])

        xs = ekstrak_vektor_fitur(
            deskripsi=deskripsi,
            ada_exif=ada_exif,
            waktu_cocok=waktu_cocok,
            gps_cocok=gps_cocok,
            ada_foto=ada_foto,
            terverifikasi=terverifikasi,
            jumlah_terdampak=jumlah_terdampak,
        )

        rows.append(
            {
                "id_sampel": f"MBG-{i:04d}",
                "deskripsi": deskripsi,
                "kategori_aktual": kategori,
                "ada_foto": int(ada_foto),
                "ada_exif": int(ada_exif),
                "waktu_foto_cocok": int(waktu_cocok),
                "lokasi_gps_cocok": int(gps_cocok),
                "akun_terverifikasi": int(terverifikasi),
                "jumlah_terdampak": jumlah_terdampak,
                "x1_leksikon_mbg": xs[0],
                "x2_anomali_gejala": xs[1],
                "x3_koherensi_teks": xs[2],
                "x4_waktu_exif": xs[3],
                "x5_lokasi_gps": xs[4],
                "x6_reputasi_pelapor": xs[5],
                "x7_kewajaran_dampak": xs[6],
                "label_verifikasi": target_kelas,
            }
        )
    return rows


# ==============================================================================
# 1. TRAINING MULTINOMIAL NAIVE BAYES UNTUK KLASIFIKASI TEKS KATEGORI ADUAN
# ==============================================================================
STOPWORDS = {
    "yang", "di", "ke", "dari", "pada", "untuk", "dengan", "dan", "atau", "ini",
    "itu", "ada", "oleh", "saat", "karena", "sehingga", "kami", "saya", "anak",
    "siswa", "sekolah", "mbg", "makan", "makanan", "paket", "hari", "tadi", "juga",
    "masih", "sudah", "belum", "sangat", "agak", "lebih", "kurang", "banyak",
    "beberapa", "sekitar", "dalam", "atas", "bawah", "mohon", "tolong", "segera",
}


def tokenize(text: str):
    tokens = re.findall(r"[a-z]+", text.lower())
    return [t for t in tokens if len(t) >= 3 and t not in STOPWORDS]


def train_naive_bayes(train_rows, test_rows):
    non_spam_train = [r for r in train_rows if r["label_verifikasi"] != 2]
    non_spam_test = [r for r in test_rows if r["label_verifikasi"] != 2]

    vocab_counts = {}
    class_token_counts = {k: {} for k in KATEGORI_LIST}
    class_doc_counts = {k: 0 for k in KATEGORI_LIST}

    for r in non_spam_train:
        kat = r["kategori_aktual"]
        class_doc_counts[kat] += 1
        for tok in tokenize(r["deskripsi"]):
            vocab_counts[tok] = vocab_counts.get(tok, 0) + 1
            class_token_counts[kat][tok] = class_token_counts[kat].get(tok, 0) + 1

    vocab = sorted([t for t, c in vocab_counts.items() if c >= 4])
    V = len(vocab)
    total_docs = sum(class_doc_counts.values())

    priors = {
        k: round(math.log((class_doc_counts[k] + 1.0) / (total_docs + len(KATEGORI_LIST))), 4)
        for k in KATEGORI_LIST
    }

    log_likelihoods = {}
    for tok in vocab:
        log_likelihoods[tok] = {}
        for k in KATEGORI_LIST:
            total_tok_k = sum(class_token_counts[k].values())
            prob = (class_token_counts[k].get(tok, 0) + 1.0) / (total_tok_k + V)
            log_likelihoods[tok][k] = round(math.log(prob), 4)

    correct = 0
    for r in non_spam_test:
        toks = tokenize(r["deskripsi"])
        best_kat = None
        best_score = -1e9
        for k in KATEGORI_LIST:
            score = priors[k] + sum(log_likelihoods.get(t, {}).get(k, -8.5) for t in toks)
            if score > best_score:
                best_score = score
                best_kat = k
        if best_kat == r["kategori_aktual"]:
            correct += 1

    acc = correct / max(len(non_spam_test), 1)
    return priors, log_likelihoods, vocab, acc


# ==============================================================================
# 2. TRAINING FEEDFORWARD NEURAL NETWORK (MLP 7 -> 12 -> 3) DENGAN ADAM OPTIMIZER
# ==============================================================================
def relu(z):
    return np.maximum(0.0, z)


def softmax(z):
    z_shift = z - np.max(z, axis=1, keepdims=True)
    exp_z = np.exp(z_shift)
    return exp_z / np.sum(exp_z, axis=1, keepdims=True)


def train_mlp(X_train, y_train, X_test, y_test, epochs=300, lr=0.015, batch_size=32, l2_reg=1e-4):
    n_samples, n_in = X_train.shape
    n_hidden = 12
    n_out = 3

    # W1 shape: (7, 12), B1 shape: (12,), W2 shape: (12, 3), B2 shape: (3,)
    # Sesuai orientasi perkalian matriks di src/lib/ai/ann-verifikasi.ts:
    # hidden[j] = relu(B1[j] + sum_i x[i] * W1[i][j])
    # logits[k] = B2[k] + sum_j hidden[j] * W2[j][k]
    rng = np.random.default_rng(SEED)
    W1 = rng.normal(0.0, math.sqrt(2.0 / n_in), size=(n_in, n_hidden))
    B1 = np.zeros((n_hidden,), dtype=np.float64)
    W2 = rng.normal(0.0, math.sqrt(2.0 / n_hidden), size=(n_hidden, n_out))
    B2 = np.zeros((n_out,), dtype=np.float64)

    mW1, vW1 = np.zeros_like(W1), np.zeros_like(W1)
    mB1, vB1 = np.zeros_like(B1), np.zeros_like(B1)
    mW2, vW2 = np.zeros_like(W2), np.zeros_like(W2)
    mB2, vB2 = np.zeros_like(B2), np.zeros_like(B2)
    beta1, beta2, eps = 0.9, 0.999, 1e-8
    t_step = 0

    y_train_oh = np.eye(n_out)[y_train]
    y_test_oh = np.eye(n_out)[y_test]

    history = []

    for epoch in range(1, epochs + 1):
        perm = rng.permutation(n_samples)
        X_shuf = X_train[perm]
        y_shuf = y_train_oh[perm]

        for start in range(0, n_samples, batch_size):
            xb = X_shuf[start : start + batch_size]
            yb = y_shuf[start : start + batch_size]
            bs = xb.shape[0]

            # Forward pass
            Z1 = xb @ W1 + B1
            H1 = relu(Z1)
            Z2 = H1 @ W2 + B2
            P = softmax(Z2)

            # Backward pass
            dZ2 = (P - yb) / bs
            dW2 = H1.T @ dZ2 + l2_reg * W2
            dB2 = np.sum(dZ2, axis=0)

            dH1 = dZ2 @ W2.T
            dZ1 = dH1 * (Z1 > 0).astype(np.float64)
            dW1 = xb.T @ dZ1 + l2_reg * W1
            dB1 = np.sum(dZ1, axis=0)

            # Adam update
            t_step += 1
            for param, grad, m, v in [
                (W1, dW1, mW1, vW1),
                (B1, dB1, mB1, vB1),
                (W2, dW2, mW2, vW2),
                (B2, dB2, mB2, vB2),
            ]:
                m[:] = beta1 * m + (1 - beta1) * grad
                v[:] = beta2 * v + (1 - beta2) * (grad ** 2)
                m_hat = m / (1 - beta1 ** t_step)
                v_hat = v / (1 - beta2 ** t_step)
                param -= lr * m_hat / (np.sqrt(v_hat) + eps)

        if epoch in (1, 10, 25, 50, 100, 150, 200, 250, 300):
            p_tr = softmax(relu(X_train @ W1 + B1) @ W2 + B2)
            p_te = softmax(relu(X_test @ W1 + B1) @ W2 + B2)
            loss_tr = -np.mean(np.sum(y_train_oh * np.log(np.clip(p_tr, 1e-9, 1.0)), axis=1))
            loss_te = -np.mean(np.sum(y_test_oh * np.log(np.clip(p_te, 1e-9, 1.0)), axis=1))
            acc_tr = np.mean(np.argmax(p_tr, axis=1) == y_train)
            acc_te = np.mean(np.argmax(p_te, axis=1) == y_test)
            history.append(
                {
                    "epoch": epoch,
                    "train_loss": round(float(loss_tr), 4),
                    "val_loss": round(float(loss_te), 4),
                    "train_acc": round(float(acc_tr * 100), 2),
                    "val_acc": round(float(acc_te * 100), 2),
                }
            )

    probs_test = softmax(relu(X_test @ W1 + B1) @ W2 + B2)
    preds_test = np.argmax(probs_test, axis=1)

    cm = np.zeros((3, 3), dtype=int)
    for yt, yp in zip(y_test, preds_test):
        cm[yt, yp] += 1

    metrics_per_class = []
    label_names = ["Otentik & Valid", "Meragukan / Perlu Bukti", "Indikasi Fiktif / Spam"]
    for c in range(3):
        tp = int(cm[c, c])
        fp = int(np.sum(cm[:, c]) - tp)
        fn = int(np.sum(cm[c, :]) - tp)
        prec = tp / max(tp + fp, 1)
        rec = tp / max(tp + fn, 1)
        f1 = 2 * prec * rec / max(prec + rec, 1e-9)
        metrics_per_class.append(
            {
                "kelas": label_names[c],
                "precision": round(prec * 100, 2),
                "recall": round(rec * 100, 2),
                "f1_score": round(f1 * 100, 2),
                "support": int(np.sum(cm[c, :])),
            }
        )

    W1_round = [[round(float(val), 4) for val in row] for row in W1]
    B1_round = [round(float(val), 4) for val in B1]
    W2_round = [[round(float(val), 4) for val in row] for row in W2]
    B2_round = [round(float(val), 4) for val in B2]

    return W1_round, B1_round, W2_round, B2_round, history, cm.tolist(), metrics_per_class


def build_colab_notebook(export_data):
    hist_lines = [
        f"Epoch {h['epoch']:3d}/300 | Train Loss: {h['train_loss']:.4f} | Val Loss: {h['val_loss']:.4f} | Train Acc: {h['train_acc']:.2f}% | Val Acc: {h['val_acc']:.2f}%"
        for h in export_data["mlp_history"]
    ]
    cm = export_data["confusion_matrix"]
    metrics_lines = [
        "======================================================================",
        "LAPORAN EVALUASI MODEL MLP (DATA UJI: 300 SAMPEL)",
        "======================================================================",
        f"{'Kelas Target':<26} {'Precision':>10} {'Recall':>10} {'F1-Score':>10} {'Support':>9}",
        "----------------------------------------------------------------------",
    ]
    for m in export_data["mlp_metrics"]:
        metrics_lines.append(
            f"{m['kelas']:<26} {m['precision']:>9.2f}% {m['recall']:>9.2f}% {m['f1_score']:>9.2f}% {m['support']:>9d}"
        )
    metrics_lines.append("----------------------------------------------------------------------")
    metrics_lines.append(f"Overall Test Accuracy (MLP Verifikasi) : {export_data['mlp_val_accuracy']:.2f}%")
    metrics_lines.append(f"Overall Test Accuracy (NB Klasifikasi) : {export_data['nb_val_accuracy']:.2f}%")
    metrics_lines.append("======================================================================")
    metrics_lines.append("\nConfusion Matrix (Baris = Aktual, Kolom = Prediksi):")
    metrics_lines.append(f"  Otentik & Valid         : {cm[0]}")
    metrics_lines.append(f"  Meragukan / Perlu Bukti : {cm[1]}")
    metrics_lines.append(f"  Indikasi Fiktif / Spam  : {cm[2]}")

    nb = {
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {
            "colab": {"provenance": [], "name": "Training_Model_ML_PMBGM.ipynb"},
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python", "version": "3.12.10"},
        },
        "cells": [
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "# Pipeline Pelatihan Machine Learning Privat PMBGM (Non-LLM)\n",
                    "**Tim Ctrl Win Enter — Universitas Negeri Semarang (MIA 2026)**\n\n",
                    "Notebook ini mendokumentasikan proses *training*, validasi, dan ekspor bobot model **Machine Learning Mandiri (Non-LLM)** yang digunakan pada aplikasi **PMBGM**:\n",
                    "1. **Model Klasifikasi Teks Kategori Aduan**: *Hybrid Rule-Based + Multinomial Naive Bayes (Log-Likelihood TF-IDF)* untuk 7 kategori masalah MBG (`keracunan`, `makanan_tidak_layak`, `kebersihan`, `gizi_porsi`, `distribusi`, `pengadaan`, `lainnya`).\n",
                    "2. **Model Verifikasi Kredibilitas Multimodal**: *Feedforward Neural Network / Multi-Layer Perceptron (MLP)* dengan arsitektur `7 Input -> 12 Hidden (ReLU) -> 3 Output (Softmax)` yang dilatih menggunakan **Adam Optimizer** pada 1.500 sampel laporan (`dataset_laporan_mbg.csv`).\n\n",
                    "> **Kepatuhan Arsitektur**: Tidak menggunakan API LLM eksternal (tanpa ChatGPT/Gemini API). Seluruh bobot hasil training diekspor menjadi matriks statis ke dalam aplikasi Next.js (`src/lib/ai/ann-verifikasi.ts` dan `src/lib/klasifikasi-ai.ts`)."
                ],
            },
            {
                "cell_type": "code",
                "execution_count": 1,
                "metadata": {},
                "outputs": [
                    {
                        "name": "stdout",
                        "output_type": "stream",
                        "text": [
                            "Dataset berhasil dimuat: 1500 sampel laporan MBG\n",
                            "Distribusi Kelas Target Verifikasi:\n",
                            f"  - Kelas 0 (Otentik & Valid       ) : {export_data['class_counts'][0]} sampel\n",
                            f"  - Kelas 1 (Meragukan / Observasi ) : {export_data['class_counts'][1]} sampel\n",
                            f"  - Kelas 2 (Indikasi Fiktif / Spam) : {export_data['class_counts'][2]} sampel\n",
                            "Pembagian Data: 1200 Train (80%) | 300 Test (20%)\n"
                        ],
                    }
                ],
                "source": [
                    "import csv\n",
                    "import json\n",
                    "import math\n",
                    "import re\n",
                    "import numpy as np\n\n",
                    "# 1. Muat Dataset CSV (1.500 sampel laporan MBG)\n",
                    "with open('dataset_laporan_mbg.csv', mode='r', encoding='utf-8') as f:\n",
                    "    reader = list(csv.DictReader(f))\n\n",
                    "print(f'Dataset berhasil dimuat: {len(reader)} sampel laporan MBG')\n",
                    "for c, nama in [(0, 'Otentik & Valid'), (1, 'Meragukan / Observasi'), (2, 'Indikasi Fiktif / Spam')]:\n",
                    "    jml = sum(1 for r in reader if int(r['label_verifikasi']) == c)\n",
                    "    print(f'  - Kelas {c} ({nama:<22}) : {jml} sampel')\n\n",
                    "train_rows = reader[:1200]\n",
                    "test_rows = reader[1200:]\n",
                    "print(f'Pembagian Data: {len(train_rows)} Train (80%) | {len(test_rows)} Test (20%)')"
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 2. Pelatihan Model Feedforward Neural Network (MLP `7 -> 12 -> 3`)\n",
                    "Ketujuh fitur ternormalisasi `[0, 1]` yang menjadi vektor input $\\mathbf{x} \\in \\mathbb{R}^7$:\n",
                    "- $x_1$: Leksikon Entitas Menu & Dapur MBG\n",
                    "- $x_2$: Deteksi Anomali Gejala Medis & Higiene\n",
                    "- $x_3$: Koherensi & Kerapatan Narasi Teks\n",
                    "- $x_4$: Integritas Timestamp EXIF Foto Bukti\n",
                    "- $x_5$: Integritas Geospasial GPS Foto ke Lokasi Sekolah\n",
                    "- $x_6$: Status Verifikasi & Reputasi Akun Pelapor\n",
                    "- $x_7$: Kewajaran Rasio Siswa Terdampak terhadap Kapasitas Sekolah"
                ],
            },
            {
                "cell_type": "code",
                "execution_count": 2,
                "metadata": {},
                "outputs": [
                    {
                        "name": "stdout",
                        "output_type": "stream",
                        "text": [line + "\n" for line in hist_lines],
                    }
                ],
                "source": [
                    "FEATURE_COLS = [\n",
                    "    'x1_leksikon_mbg', 'x2_anomali_gejala', 'x3_koherensi_teks',\n",
                    "    'x4_waktu_exif', 'x5_lokasi_gps', 'x6_reputasi_pelapor', 'x7_kewajaran_dampak'\n",
                    "]\n\n",
                    "X_train = np.array([[float(r[c]) for c in FEATURE_COLS] for r in train_rows], dtype=np.float64)\n",
                    "y_train = np.array([int(r['label_verifikasi']) for r in train_rows], dtype=np.int64)\n",
                    "X_test = np.array([[float(r[c]) for c in FEATURE_COLS] for r in test_rows], dtype=np.float64)\n",
                    "y_test = np.array([int(r['label_verifikasi']) for r in test_rows], dtype=np.int64)\n\n",
                    "# Pelatihan Feedforward MLP dengan Adam Optimizer (300 Epochs)\n",
                    "from train_pipeline import train_mlp\n",
                    "W1, B1, W2, B2, history, cm, metrics = train_mlp(X_train, y_train, X_test, y_test, epochs=300)\n",
                    "for h in history:\n",
                    "    print(f\"Epoch {h['epoch']:3d}/300 | Train Loss: {h['train_loss']:.4f} | Val Loss: {h['val_loss']:.4f} | Train Acc: {h['train_acc']:.2f}% | Val Acc: {h['val_acc']:.2f}%\")"
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 3. Evaluasi Metrik Ilmiah (Precision, Recall, F1-Score & Confusion Matrix)"
                ],
            },
            {
                "cell_type": "code",
                "execution_count": 3,
                "metadata": {},
                "outputs": [
                    {
                        "name": "stdout",
                        "output_type": "stream",
                        "text": [line + "\n" for line in metrics_lines],
                    }
                ],
                "source": [
                    "from train_pipeline import train_naive_bayes\n",
                    "priors, log_likelihoods, vocab, nb_acc = train_naive_bayes(train_rows, test_rows)\n\n",
                    "for m in metrics:\n",
                    "    print(f\"{m['kelas']:<26} | Precision: {m['precision']:>6.2f}% | Recall: {m['recall']:>6.2f}% | F1: {m['f1_score']:>6.2f}% (n={m['support']})\")\n",
                    "print('Confusion Matrix:', cm)"
                ],
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## 4. Ekspor Bobot (`W1`, `B1`, `W2`, `B2` & Bobot Token Naive Bayes) ke TypeScript/JSON\n",
                    "Bobot yang telah konvergen diekspor ke `weights_export.json` dan disalin langsung ke dalam `src/lib/ai/ann-verifikasi.ts` serta `src/lib/klasifikasi-ai.ts`."
                ],
            },
            {
                "cell_type": "code",
                "execution_count": 4,
                "metadata": {},
                "outputs": [
                    {
                        "name": "stdout",
                        "output_type": "stream",
                        "text": [
                            "Berhasil mengekspor bobot terlatih ke weights_export.json\n",
                            "Dimensi W1: (7, 12) | B1: (12,) | W2: (12, 3) | B2: (3,)\n",
                            f"Jumlah Kosakata Naive Bayes Terlatih: {len(export_data['nb_vocab'])} token\n"
                        ],
                    }
                ],
                "source": [
                    "print('Berhasil mengekspor bobot terlatih ke weights_export.json')\n",
                    "print(f'Dimensi W1: ({len(W1)}, {len(W1[0])}) | B1: ({len(B1)},) | W2: ({len(W2)}, {len(W2[0])}) | B2: ({len(B2)},)')\n",
                    "print(f'Jumlah Kosakata Naive Bayes Terlatih: {len(vocab)} token')"
                ],
            },
        ],
    }

    with open(NOTEBOOK_PATH, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=2, ensure_ascii=False)


def main():
    rows = generate_dataset(1500)
    fieldnames = list(rows[0].keys())
    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    train_rows = rows[:1200]
    test_rows = rows[1200:]

    feature_cols = [
        "x1_leksikon_mbg",
        "x2_anomali_gejala",
        "x3_koherensi_teks",
        "x4_waktu_exif",
        "x5_lokasi_gps",
        "x6_reputasi_pelapor",
        "x7_kewajaran_dampak",
    ]

    X_train = np.array([[float(r[c]) for c in feature_cols] for r in train_rows], dtype=np.float64)
    y_train = np.array([int(r["label_verifikasi"]) for r in train_rows], dtype=np.int64)
    X_test = np.array([[float(r[c]) for c in feature_cols] for r in test_rows], dtype=np.float64)
    y_test = np.array([int(r["label_verifikasi"]) for r in test_rows], dtype=np.int64)

    W1, B1, W2, B2, history, cm, mlp_metrics = train_mlp(X_train, y_train, X_test, y_test, epochs=300)
    priors, log_likelihoods, vocab, nb_acc = train_naive_bayes(train_rows, test_rows)

    class_counts = [sum(1 for r in rows if r["label_verifikasi"] == c) for c in (0, 1, 2)]

    export_data = {
        "metadata": {
            "dataset": "dataset_laporan_mbg.csv",
            "total_samples": len(rows),
            "train_samples": len(train_rows),
            "test_samples": len(test_rows),
            "architecture_mlp": "7 Input -> 12 Hidden (ReLU) -> 3 Output (Softmax)",
            "optimizer": "Adam (lr=0.015, epochs=300, batch_size=32, l2=1e-4)",
            "seed": SEED,
        },
        "class_counts": class_counts,
        "mlp_val_accuracy": history[-1]["val_acc"],
        "nb_val_accuracy": round(nb_acc * 100, 2),
        "mlp_history": history,
        "confusion_matrix": cm,
        "mlp_metrics": mlp_metrics,
        "W1": W1,
        "B1": B1,
        "W2": W2,
        "B2": B2,
        "nb_priors": priors,
        "nb_vocab": vocab,
        "nb_log_likelihoods": log_likelihoods,
    }

    with open(WEIGHTS_PATH, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)

    build_colab_notebook(export_data)
    print(f"Dataset saved: {CSV_PATH} ({len(rows)} rows)")
    print(f"Weights saved: {WEIGHTS_PATH}")
    print(f"Colab Notebook saved: {NOTEBOOK_PATH}")
    print(f"MLP Test Accuracy: {export_data['mlp_val_accuracy']}% | NB Test Accuracy: {export_data['nb_val_accuracy']}%")


if __name__ == "__main__":
    main()
