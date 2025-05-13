// Fungsi untuk menghasilkan laporan
function generateReport() {
  const reportType = document.getElementById("reportType").value
  const dateRange = document.getElementById("dateRange").value

  // Dapatkan data lelang
  // Gunakan getDummyAuctions() untuk data dummy atau getAuctions() untuk data dari localStorage
  const useDummyData = document.getElementById("useDummyData")?.checked || false
  let auctions = useDummyData ? getDummyAuctions() : getAuctions()

  // Filter berdasarkan jenis laporan
  if (reportType === "open") {
    auctions = auctions.filter((auction) => auction.status === "dibuka")
  } else if (reportType === "closed") {
    auctions = auctions.filter((auction) => auction.status === "ditutup")
  }

  // Filter berdasarkan rentang waktu
  if (dateRange !== "all") {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (dateRange === "today") {
      auctions = auctions.filter((auction) => {
        const auctionDate = new Date(auction.tanggal)
        return auctionDate >= today && auctionDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      })
    } else if (dateRange === "week") {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())

      auctions = auctions.filter((auction) => {
        const auctionDate = new Date(auction.tanggal)
        return auctionDate >= weekStart
      })
    } else if (dateRange === "month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

      auctions = auctions.filter((auction) => {
        const auctionDate = new Date(auction.tanggal)
        return auctionDate >= monthStart
      })
    }
  }

  // Tampilkan laporan
  displayReport(auctions, reportType, dateRange)
}

// Fungsi untuk menampilkan laporan
function displayReport(auctions, reportType, dateRange) {
  const reportContainer = document.getElementById("reportContainer")
  const reportTitle = document.getElementById("reportTitle")
  const reportInfo = document.getElementById("reportInfo")
  const reportData = document.getElementById("reportData")

  // Set judul laporan
  let title = "Laporan "
  if (reportType === "open") {
    title += "Lelang Dibuka"
  } else if (reportType === "closed") {
    title += "Lelang Ditutup"
  } else {
    title += "Semua Lelang"
  }

  // Set info laporan
  let info = "Periode: "
  if (dateRange === "today") {
    info += "Hari Ini"
  } else if (dateRange === "week") {
    info += "Minggu Ini"
  } else if (dateRange === "month") {
    info += "Bulan Ini"
  } else {
    info += "Semua Waktu"
  }

  info += ` | Total Data: ${auctions.length} | Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`

  reportTitle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    ${title}
  `
  reportInfo.textContent = info

  // Tampilkan data laporan
  reportData.innerHTML = ""

  if (auctions.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
        Tidak ada data yang sesuai dengan filter
      </td>
    `
    reportData.appendChild(row)
  } else {
    auctions.forEach((auction) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img class="h-10 w-10 rounded-md object-cover" src="${auction.gambar || "assets/img/no-image.png"}" alt="${auction.namaBarang}">
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${auction.namaBarang}</div>
              <div class="text-sm text-gray-500">${auction.deskripsi.substring(0, 50)}${auction.deskripsi.length > 50 ? "..." : ""}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(auction.tanggal).toLocaleDateString("id-ID")}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp ${auction.hargaAwal.toLocaleString("id-ID")}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${auction.penawaranTertinggi > 0 ? "Rp " + auction.penawaranTertinggi.toLocaleString("id-ID") : "-"}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${auction.penawar || "-"}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${auction.status === "dibuka" ? "bg-green-100 text-green-800" : auction.status === "ditutup" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}">
            ${auction.status === "dibuka" ? "Dibuka" : auction.status === "ditutup" ? "Ditutup" : "Pending"}
          </span>
        </td>
      `
      reportData.appendChild(row)
    })
  }

  // Tampilkan container laporan
  reportContainer.classList.remove("hidden")
}

// Fungsi untuk mencetak laporan
function printReport() {
  window.print()
}

// Fungsi untuk mendapatkan data dummy
function getDummyAuctions() {
  return [
    {
      id: 1,
      namaBarang: "Laptop Bekas",
      deskripsi:
        "Laptop bekas kondisi baik, cocok untuk pemakaian sehari-hari. Spesifikasi: Intel Core i5, RAM 8GB, SSD 256GB.",
      tanggal: "2024-01-20",
      hargaAwal: 2000000,
      penawaranTertinggi: 2500000,
      penawar: "Budi",
      status: "ditutup",
      gambar: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 2,
      namaBarang: "Kamera DSLR",
      deskripsi: "Kamera DSLR Canon EOS 70D dengan lensa kit 18-55mm. Kondisi mulus, jarang dipakai.",
      tanggal: "2024-01-22",
      hargaAwal: 4500000,
      penawaranTertinggi: 5000000,
      penawar: "Siti",
      status: "ditutup",
      gambar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 3,
      namaBarang: "Smartphone Android",
      deskripsi: "Smartphone Android Samsung Galaxy A51, RAM 6GB, ROM 128GB. Kondisi 90%, masih garansi resmi.",
      tanggal: "2024-01-25",
      hargaAwal: 2800000,
      penawaranTertinggi: 3200000,
      penawar: "Andi",
      status: "dibuka",
      gambar: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 4,
      namaBarang: "Meja Kerja",
      deskripsi: "Meja kerja minimalis dengan ukuran 120x60 cm. Bahan kayu jati solid, kokoh dan tahan lama.",
      tanggal: "2024-01-28",
      hargaAwal: 500000,
      penawaranTertinggi: 600000,
      penawar: "Rina",
      status: "dibuka",
      gambar: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 5,
      namaBarang: "Sepeda Gunung",
      deskripsi: "Sepeda gunung Polygon Premier 5.0 dengan frame alloy. Kondisi terawat, jarang dipakai.",
      tanggal: "2024-01-30",
      hargaAwal: 3500000,
      penawaranTertinggi: 0,
      penawar: null,
      status: "dibuka",
      gambar: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 6,
      namaBarang: "Jam Tangan Mewah",
      deskripsi: "Jam tangan mewah merek Rolex, model Submariner. Original dengan box dan sertifikat.",
      tanggal: "2024-02-05",
      hargaAwal: 15000000,
      penawaranTertinggi: 16500000,
      penawar: "Doni",
      status: "dibuka",
      gambar: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 7,
      namaBarang: "Lukisan Abstrak",
      deskripsi: "Lukisan abstrak karya seniman lokal, ukuran 80x120 cm. Cocok untuk dekorasi ruang tamu.",
      tanggal: "2024-02-10",
      hargaAwal: 1200000,
      penawaranTertinggi: 1500000,
      penawar: "Maya",
      status: "dibuka",
      gambar: "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 8,
      namaBarang: "Gitar Akustik",
      deskripsi: "Gitar akustik Yamaha F310, kondisi 95%. Suara jernih dan nyaring, cocok untuk pemula.",
      tanggal: "2024-02-15",
      hargaAwal: 800000,
      penawaranTertinggi: 950000,
      penawar: "Rudi",
      status: "dibuka",
      gambar: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 9,
      namaBarang: "Lemari Pakaian",
      deskripsi: "Lemari pakaian 3 pintu, bahan particle board berkualitas. Dimensi: 150x60x200 cm.",
      tanggal: "2024-02-20",
      hargaAwal: 1800000,
      penawaranTertinggi: 0,
      penawar: null,
      status: "pending",
      gambar: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: 10,
      namaBarang: "Drone DJI Mini",
      deskripsi: "Drone DJI Mini 2, baru dipakai 3 kali. Lengkap dengan 3 baterai dan tas.",
      tanggal: "2024-02-25",
      hargaAwal: 5500000,
      penawaranTertinggi: 6000000,
      penawar: "Tono",
      status: "dibuka",
      gambar: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=500&auto=format&fit=crop",
    },
  ]
}

// Fungsi untuk mendapatkan data lelang dari localStorage
function getAuctions() {
  const auctions = localStorage.getItem("auctions")
  return auctions ? JSON.parse(auctions) : []
}

// Fungsi untuk mengisi localStorage dengan data dummy
function populateDummyData() {
  const dummyData = getDummyAuctions()
  localStorage.setItem("auctions", JSON.stringify(dummyData))
  alert("Data dummy berhasil ditambahkan ke localStorage!")

  // Refresh halaman untuk menampilkan data
  window.location.reload()
}
