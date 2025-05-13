// Fungsi untuk mendapatkan semua lelang
function getAuctions() {
  return JSON.parse(localStorage.getItem("auctions") || "[]")
}

// Fungsi untuk mendapatkan lelang berdasarkan ID
function getAuctionById(id) {
  const auctions = getAuctions()
  return auctions.find((auction) => auction.id === id)
}

// Fungsi untuk menambahkan lelang baru
function addAuction(auction) {
  const auctions = getAuctions()
  auctions.push(auction)
  localStorage.setItem("auctions", JSON.stringify(auctions))
  return auction
}

// Fungsi untuk mengupdate status lelang
function updateAuctionStatus(id, status) {
  const auctions = getAuctions()
  const index = auctions.findIndex((auction) => auction.id === id)

  if (index !== -1) {
    auctions[index].status = status
    localStorage.setItem("auctions", JSON.stringify(auctions))
    return auctions[index]
  }

  return null
}

// Fungsi untuk mengupdate penawaran tertinggi
function updateAuctionHighestBid(id, amount, penawar) {
  const auctions = getAuctions()
  const index = auctions.findIndex((auction) => auction.id === id)

  if (index !== -1) {
    auctions[index].penawaranTertinggi = amount
    auctions[index].penawar = penawar
    localStorage.setItem("auctions", JSON.stringify(auctions))
    return auctions[index]
  }

  return null
}

// Fungsi untuk menghapus lelang
function removeAuction(id) {
  let auctions = getAuctions()
  auctions = auctions.filter((auction) => auction.id !== id)
  localStorage.setItem("auctions", JSON.stringify(auctions))

  // Hapus juga penawaran terkait
  let bids = getBids()
  bids = bids.filter((bid) => bid.auctionId !== id)
  localStorage.setItem("bids", JSON.stringify(bids))
}

// Fungsi untuk mendapatkan semua penawaran
function getBids() {
  return JSON.parse(localStorage.getItem("bids") || "[]")
}

// Fungsi untuk menambahkan penawaran baru
function addBid(bid) {
  const bids = getBids()
  bids.push(bid)
  localStorage.setItem("bids", JSON.stringify(bids))
  return bid
}

// Fungsi untuk mendapatkan penawaran berdasarkan ID lelang
function getBidsByAuctionId(auctionId) {
  const bids = getBids()
  return bids.filter((bid) => bid.auctionId === auctionId)
}

// Fungsi untuk mendapatkan penawaran berdasarkan ID pengguna
function getBidsByUserId(userId) {
  const bids = getBids()
  return bids.filter((bid) => bid.userId === userId)
}

// Fungsi untuk mendapatkan penawaran tertinggi dari lelang
function getHighestBid(auctionId) {
  const bids = getBidsByAuctionId(auctionId)
  if (bids.length === 0) return null

  return bids.reduce((highest, current) => {
    return current.amount > highest.amount ? current : highest
  }, bids[0])
}

// Fungsi untuk mengisi data contoh jika belum ada data
function initializeExampleData() {
  // Cek apakah sudah ada data lelang
  const auctions = getAuctions()
  if (auctions.length === 0) {
    // Jika belum ada data, isi dengan data contoh
    const exampleAuctions = [
      {
        id: "1",
        namaBarang: "Smartphone Android",
        deskripsi: "Smartphone Android Samsung Galaxy A51, RAM 6GB, ROM 128GB. Kondisi 90%, masih garansi resmi.",
        hargaAwal: 2800000,
        tanggal: new Date().toISOString().split("T")[0],
        status: "dibuka",
        penawaranTertinggi: 3200000,
        penawar: "Andi",
        gambar: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "2",
        namaBarang: "Meja Kerja",
        deskripsi: "Meja kerja minimalis dengan ukuran 120x60 cm. Bahan kayu jati solid, kokoh dan tahan lama.",
        hargaAwal: 500000,
        tanggal: new Date().toISOString().split("T")[0],
        status: "dibuka",
        penawaranTertinggi: 600000,
        penawar: "Rina",
        gambar: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "3",
        namaBarang: "Sepeda Gunung",
        deskripsi: "Sepeda gunung Polygon Premier 5.0 dengan frame alloy. Kondisi terawat, jarang dipakai.",
        hargaAwal: 3500000,
        tanggal: new Date().toISOString().split("T")[0],
        status: "dibuka",
        penawaranTertinggi: 0,
        penawar: null,
        gambar: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=500&auto=format&fit=crop",
      },
    ]

    // Simpan data contoh ke localStorage
    localStorage.setItem("auctions", JSON.stringify(exampleAuctions))

    // Buat beberapa penawaran contoh
    const exampleBids = [
      {
        id: "1",
        auctionId: "1",
        userId: "3", // ID user masyarakat
        username: "Pengguna Biasa",
        amount: 3000000,
        date: new Date(Date.now() - 86400000).toISOString(), // 1 hari yang lalu
      },
      {
        id: "2",
        auctionId: "1",
        userId: "3", // ID user masyarakat
        username: "Pengguna Biasa",
        amount: 3200000,
        date: new Date().toISOString(),
      },
      {
        id: "3",
        auctionId: "2",
        userId: "3", // ID user masyarakat
        username: "Pengguna Biasa",
        amount: 600000,
        date: new Date().toISOString(),
      },
    ]

    localStorage.setItem("bids", JSON.stringify(exampleBids))
  }
}

// Fungsi untuk reset data lelang
function resetAuctionData() {
  // Hapus data lelang dan bid dari localStorage
  localStorage.removeItem("auctions")
  localStorage.removeItem("bids")

  // Inisialisasi ulang dengan data contoh
  initializeExampleData()

  return true
}

// Panggil fungsi inisialisasi data contoh
initializeExampleData()
