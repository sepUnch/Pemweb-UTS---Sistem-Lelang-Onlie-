// Fungsi untuk inisialisasi data awal jika belum ada
function initializeData() {
  // Inisialisasi data pengguna jika belum ada
  if (!localStorage.getItem("users")) {
    const defaultUsers = [
      {
        id: "1",
        username: "admin",
        password: "admin123",
        nama: "Administrator",
        telp: "08123456789",
        role: "admin",
      },
      {
        id: "2",
        username: "petugas",
        password: "petugas123",
        nama: "Petugas Lelang",
        telp: "08234567890",
        role: "petugas",
      },
      {
        id: "3",
        username: "user",
        password: "user123",
        nama: "Pengguna Biasa",
        telp: "08345678901",
        role: "masyarakat",
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }

  // Inisialisasi data lelang jika belum ada
  if (!localStorage.getItem("auctions")) {
    localStorage.setItem("auctions", JSON.stringify([]))
  }

  // Inisialisasi data penawaran jika belum ada
  if (!localStorage.getItem("bids")) {
    localStorage.setItem("bids", JSON.stringify([]))
  }
}

// Panggil fungsi inisialisasi saat halaman dimuat
initializeData()

// Fungsi untuk mendapatkan semua pengguna
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]")
}

// Fungsi untuk login
function login(username, password) {
  const users = getUsers()
  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    // Simpan info login ke session storage
    sessionStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }

  return null
}

// Fungsi untuk logout
function logout() {
  sessionStorage.removeItem("currentUser")
}

// Fungsi untuk cek status login
function checkLoginStatus() {
  const userJson = sessionStorage.getItem("currentUser")
  if (!userJson) {
    return null
  }

  return JSON.parse(userJson)
}

// Fungsi untuk registrasi pengguna baru
function registerUser(user) {
  const users = getUsers()
  users.push(user)
  localStorage.setItem("users", JSON.stringify(users))
  return user
}

// Fungsi untuk menghapus pengguna
function removeUser(userId) {
  let users = getUsers()
  users = users.filter((user) => user.id !== userId)
  localStorage.setItem("users", JSON.stringify(users))
}

// Event listener untuk form login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (loginForm) {
    const loginBtn = document.getElementById("loginBtn")
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value

        if (!username || !password) {
          alert("Username dan password harus diisi!")
          return
        }

        const user = login(username, password)
        if (user) {
          window.location.href = "dashboard.html"
        } else {
          alert("Username atau password salah!")
        }
      })
    }

    const showRegisterForm = document.getElementById("showRegisterForm")
    if (showRegisterForm) {
      showRegisterForm.addEventListener("click", (e) => {
        e.preventDefault()
        loginForm.classList.add("hidden")
        registerForm.classList.remove("hidden")
      })
    }
  }

  if (registerForm) {
    const registerBtn = document.getElementById("registerBtn")
    if (registerBtn) {
      registerBtn.addEventListener("click", () => {
        const username = document.getElementById("regUsername").value
        const password = document.getElementById("regPassword").value
        const nama = document.getElementById("regNama").value
        const telp = document.getElementById("regTelp").value
        const role = document.getElementById("regRole").value

        if (!username || !password || !nama || !telp) {
          alert("Semua field harus diisi!")
          return
        }

        // Cek apakah username sudah ada
        const users = getUsers()
        if (users.some((user) => user.username === username)) {
          alert("Username sudah digunakan!")
          return
        }

        const user = {
          id: Date.now().toString(),
          username,
          password,
          nama,
          telp,
          role,
        }

        registerUser(user)
        alert("Registrasi berhasil! Silakan login.")

        // Kembali ke form login
        registerForm.classList.add("hidden")
        loginForm.classList.remove("hidden")
      })
    }

    const showLoginForm = document.getElementById("showLoginForm")
    if (showLoginForm) {
      showLoginForm.addEventListener("click", (e) => {
        e.preventDefault()
        registerForm.classList.add("hidden")
        loginForm.classList.remove("hidden")
      })
    }
  }
})
