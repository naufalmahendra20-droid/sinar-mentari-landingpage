// ====== CONFIG (GANTI SESUAI KEBUTUHAN) ======
const CONFIG = {
  waNumber: "6281234567890", // ganti: format internasional tanpa + (contoh 62812xxxx)
  waDefaultText: "Halo PT Sinar Mentari Properti, saya ingin konsultasi tentang unit rumah.",
  instagramUrl: "https://instagram.com/", // ganti
  email: "info@sinartmentariproperti.com"  // ganti
};

// ====== Helpers ======
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];

function buildWaLink(message){
  const text = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.waNumber}?text=${text}`;
}

// ====== Year ======
$("#year").textContent = new Date().getFullYear();

// ====== Nav mobile ======
const hamburger = $("#hamburger");
const menu = $("#menu");

hamburger.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  hamburger.setAttribute("aria-expanded", String(open));
});

$$(".menu a").forEach(a => {
  a.addEventListener("click", () => {
    menu.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

// ====== Contact links ======
$("#waLink").href = buildWaLink(CONFIG.waDefaultText);
$("#igLink").href = CONFIG.instagramUrl;
$("#mailLink").href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Konsultasi Unit Rumah")}&body=${encodeURIComponent("Halo PT Sinar Mentari Properti, saya ingin bertanya tentang unit rumah.")}`;
$("#fabWa").href = buildWaLink("Halo, saya ingin konsultasi unit rumah (promo Free AJB & DP cicil 3x).");

// ====== Lead form -> WhatsApp ======
$("#leadForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#name").value.trim();
  const phone = $("#phone").value.trim();
  const type = $("#type").value;
  const message = $("#message").value.trim();

  const text =
`Halo PT Sinar Mentari Properti,
Saya ingin konsultasi unit rumah.

Nama: ${name}
No WA: ${phone}
Minat Tipe: ${type}
Pesan: ${message || "-"}

Mohon info detail harga, lokasi, dan promo yang tersedia. Terima kasih.`;

  window.open(buildWaLink(text), "_blank");
});

// ====== Reveal on scroll (IntersectionObserver) ======
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ====== Testimonials slider (auto slide + controls + pause on hover) ======
const track = $("#sliderTrack");
const slides = $$(".slide", track);
const dotsWrap = $("#dots");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

let index = 0;
let autoTimer = null;
let isPaused = false;

function slideWidth(){
  // slide width + gap (12px)
  const slide = slides[0];
  const gap = 12;
  return slide.getBoundingClientRect().width + gap;
}

function renderDots(){
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dot" + (i === index ? " is-active" : "");
    b.type = "button";
    b.setAttribute("aria-label", `Ke testimoni ${i+1}`);
    b.addEventListener("click", () => {
      index = i;
      updateSlider();
      restartAuto();
    });
    dotsWrap.appendChild(b);
  });
}

function updateDots(){
  $$(".dot", dotsWrap).forEach((d,i) => {
    d.classList.toggle("is-active", i === index);
  });
}

function updateSlider(){
  const x = -(index * slideWidth());
  track.style.transform = `translateX(${x}px)`;
  updateDots();
}

function next(){
  index = (index + 1) % slides.length;
  updateSlider();
}

function prev(){
  index = (index - 1 + slides.length) % slides.length;
  updateSlider();
}

function startAuto(){
  if(autoTimer) return;
  autoTimer = setInterval(() => {
    if(!isPaused) next();
  }, 3500);
}

function stopAuto(){
  clearInterval(autoTimer);
  autoTimer = null;
}

function restartAuto(){
  stopAuto();
  startAuto();
}

prevBtn.addEventListener("click", () => { prev(); restartAuto(); });
nextBtn.addEventListener("click", () => { next(); restartAuto(); });

track.addEventListener("mouseenter", () => { isPaused = true; });
track.addEventListener("mouseleave", () => { isPaused = false; });

window.addEventListener("resize", () => updateSlider());

renderDots();
updateSlider();
startAuto();

// ====== Modal Foto + Denah saat klik tipe rumah ======
const modal = $("#houseModal");
const modalImg = $("#modalImg");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const planCanvas = $("#planCanvas");
const downloadPlan = $("#downloadPlan");
const modalClose = $("#modalClose");

function openModal(){
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  if(e.target && e.target.dataset.close === "true") closeModal();
});
modalClose.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

// ====== Generate denah SVG (placeholder rapi) ======
function planSVG(type){
  // denah ilustrasi sederhana per tipe (bukan denah teknis)
  // Ukuran svg responsif: viewBox 0 0 520 320
  if(type === "36"){
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" width="100%" height="auto">
  <defs>
    <style>
      .box{fill:#ffffff;stroke:#0f172a;stroke-opacity:.35;stroke-width:2}
      .room{fill:#1F6B3A;fill-opacity:.08;stroke:#1F6B3A;stroke-opacity:.35;stroke-width:2}
      .t{font: 700 14px Inter, Arial; fill:#0f172a}
      .s{font: 600 12px Inter, Arial; fill: rgba(15,23,42,.75)}
    </style>
  </defs>
  <rect class="box" x="18" y="18" width="484" height="284" rx="14"/>
  <rect class="room" x="36" y="36" width="220" height="120" rx="12"/>
  <text class="t" x="50" y="70">Ruang Tamu</text>
  <text class="s" x="50" y="94">+ Ruang Keluarga</text>

  <rect class="room" x="272" y="36" width="210" height="120" rx="12"/>
  <text class="t" x="286" y="70">Kamar Tidur</text>
  <text class="s" x="286" y="94">Utama</text>

  <rect class="room" x="36" y="170" width="170" height="114" rx="12"/>
  <text class="t" x="50" y="204">Dapur</text>
  <text class="s" x="50" y="228">+ Makan</text>

  <rect class="room" x="220" y="170" width="120" height="114" rx="12"/>
  <text class="t" x="234" y="204">KM/WC</text>

  <rect class="room" x="354" y="170" width="128" height="114" rx="12"/>
  <text class="t" x="368" y="204">Teras</text>
  <text class="s" x="368" y="228">Carport</text>
</svg>`;
  }

  if(type === "45"){
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" width="100%" height="auto">
  <defs>
    <style>
      .box{fill:#ffffff;stroke:#0f172a;stroke-opacity:.35;stroke-width:2}
      .room{fill:#1F6B3A;fill-opacity:.08;stroke:#1F6B3A;stroke-opacity:.35;stroke-width:2}
      .t{font: 700 14px Inter, Arial; fill:#0f172a}
      .s{font: 600 12px Inter, Arial; fill: rgba(15,23,42,.75)}
      .label{font: 800 12px Inter, Arial; fill:#1F6B3A}
    </style>
  </defs>

  <rect class="box" x="18" y="18" width="484" height="284" rx="14"/>
  <text class="label" x="34" y="40">LANTAI 1</text>

  <rect class="room" x="36" y="54" width="250" height="120" rx="12"/>
  <text class="t" x="50" y="88">Ruang Tamu</text>
  <text class="s" x="50" y="112">+ Keluarga</text>

  <rect class="room" x="300" y="54" width="182" height="120" rx="12"/>
  <text class="t" x="314" y="88">Dapur</text>
  <text class="s" x="314" y="112">+ Makan</text>

  <rect class="room" x="36" y="188" width="170" height="96" rx="12"/>
  <text class="t" x="50" y="220">KM/WC</text>

  <rect class="room" x="220" y="188" width="262" height="96" rx="12"/>
  <text class="t" x="234" y="220">Carport</text>
  <text class="s" x="234" y="244">+ Teras</text>
</svg>`;
  }

  if(type === "60"){
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" width="100%" height="auto">
  <defs>
    <style>
      .box{fill:#ffffff;stroke:#0f172a;stroke-opacity:.35;stroke-width:2}
      .room{fill:#1F6B3A;fill-opacity:.08;stroke:#1F6B3A;stroke-opacity:.35;stroke-width:2}
      .t{font: 700 14px Inter, Arial; fill:#0f172a}
      .s{font: 600 12px Inter, Arial; fill: rgba(15,23,42,.75)}
      .label{font: 800 12px Inter, Arial; fill:#1F6B3A}
    </style>
  </defs>

  <rect class="box" x="18" y="18" width="484" height="284" rx="14"/>
  <text class="label" x="34" y="40">LANTAI 1 (ILUSTRASI)</text>

  <rect class="room" x="36" y="54" width="220" height="110" rx="12"/>
  <text class="t" x="50" y="88">Ruang Tamu</text>
  <text class="s" x="50" y="112">+ Keluarga</text>

  <rect class="room" x="270" y="54" width="212" height="110" rx="12"/>
  <text class="t" x="284" y="88">Kamar</text>
  <text class="s" x="284" y="112">Tamu / Anak</text>

  <rect class="room" x="36" y="176" width="230" height="108" rx="12"/>
  <text class="t" x="50" y="210">Dapur</text>
  <text class="s" x="50" y="234">+ Makan</text>

  <rect class="room" x="280" y="176" width="92" height="108" rx="12"/>
  <text class="t" x="292" y="210">KM</text>
  <text class="s" x="292" y="234">/WC</text>

  <rect class="room" x="384" y="176" width="98" height="108" rx="12"/>
  <text class="t" x="396" y="210">Carport</text>
</svg>`;
  }

  // 70
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" width="100%" height="auto">
  <defs>
    <style>
      .box{fill:#ffffff;stroke:#0f172a;stroke-opacity:.35;stroke-width:2}
      .room{fill:#1F6B3A;fill-opacity:.08;stroke:#1F6B3A;stroke-opacity:.35;stroke-width:2}
      .t{font: 700 14px Inter, Arial; fill:#0f172a}
      .s{font: 600 12px Inter, Arial; fill: rgba(15,23,42,.75)}
      .label{font: 800 12px Inter, Arial; fill:#1F6B3A}
    </style>
  </defs>

  <rect class="box" x="18" y="18" width="484" height="284" rx="14"/>
  <text class="label" x="34" y="40">LANTAI 1 (ILUSTRASI)</text>

  <rect class="room" x="36" y="54" width="250" height="110" rx="12"/>
  <text class="t" x="50" y="88">Ruang Tamu</text>
  <text class="s" x="50" y="112">+ Keluarga</text>

  <rect class="room" x="300" y="54" width="182" height="110" rx="12"/>
  <text class="t" x="314" y="88">Ruang Kerja</text>
  <text class="s" x="314" y="112">/ Serbaguna</text>

  <rect class="room" x="36" y="176" width="210" height="108" rx="12"/>
  <text class="t" x="50" y="210">Dapur</text>
  <text class="s" x="50" y="234">+ Makan</text>

  <rect class="room" x="260" y="176" width="110" height="108" rx="12"/>
  <text class="t" x="274" y="210">KM/WC</text>

  <rect class="room" x="384" y="176" width="98" height="108" rx="12"/>
  <text class="t" x="396" y="210">Carport</text>
  <text class="s" x="396" y="234">+ Teras</text>
</svg>`;
}

function setDownload(svgString){
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  downloadPlan.href = url;
}

// click tipe rumah => open modal + denah
$$(".houseCard").forEach(card => {
  card.addEventListener("click", () => {
    const title = card.dataset.title || "Tipe Rumah";
    const desc = card.dataset.desc || "";
    const img = card.dataset.img || "";
    const plan = card.dataset.plan || "36";

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalImg.src = img;
    modalImg.alt = `Foto rumah ${title}`;

    const svg = planSVG(plan);
    planCanvas.innerHTML = svg;
    setDownload(svg);

    openModal();
  });
});
