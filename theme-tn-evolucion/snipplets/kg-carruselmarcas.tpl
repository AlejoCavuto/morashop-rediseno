<section class="container py-4">
  <div class="marcas-wrapper">
    <div class="titulo-marcas">Nuestras marcas</div>

    <div class="carrusel-container">
      <button class="carrusel-btn izquierda" style="display: none;">‹</button>

      <div class="logos-carrusel-wrapper">
        <div class="logos-carrusel">
          {% for item in marcas %}
            <a href="{{ item.link }}" target="_blank">
              <img src="{{ item.img }}" alt="Marca" class="marca-logo" />
            </a>
          {% endfor %}
        </div>
      </div>

      <button class="carrusel-btn derecha" style="display: none;">›</button>
    </div>
  </div>
</section>

<style>
.marcas-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}
.titulo-marcas {
  font-size: 18px;
  flex-shrink: 0;
  font-weight: bold;
  color: #000e35;
  min-width: 140px;
}
.carrusel-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.logos-carrusel-wrapper {
  overflow-x: auto;
  width: 100%; /* antes calc(100% - 72px) */
  max-width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  z-index: 1;
}
.logos-carrusel-wrapper::-webkit-scrollbar {
  display: none;
}

.logos-carrusel {
  display: flex;
  align-items: center;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 0 16px;
  box-sizing: border-box;
}

/* Cada logo */
.logos-carrusel a {
  scroll-snap-align: center;
  flex: 0 0 auto;
  width: 80px;
  margin-right: 12px;
}

.marca-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid #ccc;
  object-fit: cover;
  flex-shrink: 0;
}

.carrusel-btn {
  background:#fff;
  border:1px solid #000e35;
  font-size:28px;
  font-weight:700;
  color:#000e35;
  cursor:pointer;
  position:absolute;
  top:50%;
  transform:translateY(-50%);
  z-index:3; /* encima de logos */
  width:36px;
  height:36px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:50%;
}
.carrusel-btn.izquierda { left: 4px; }
.carrusel-btn.derecha   { right: 4px; }

/* Mobile */
@media (max-width: 768px) {
  .marcas-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .titulo-marcas {
    margin-bottom: 12px;
  }

  .logos-carrusel {
    gap: 0px; /* separación mínima */
    padding: 0 3px;
  }

  .logos-carrusel a {
    flex: 0 0 auto;
    width: 25%;
    max-width: 30%;
    margin-right: 0;
    display: flex;
    justify-content: center;
  }

  .marca-logo {
    width: 90px;
    height: 90px;
  }

  .carrusel-container {
    width: 100%;
  }

  .logos-carrusel-wrapper {
    width: 100%; /* ahora ocupa todo */
  }
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".logos-carrusel-wrapper");
  const flechaIzq = document.querySelector(".carrusel-btn.izquierda");
  const flechaDer = document.querySelector(".carrusel-btn.derecha");

  if (!wrapper || !flechaIzq || !flechaDer) return;

  const checkOverflow = () => {
    const hasOverflow = wrapper.scrollWidth > wrapper.clientWidth + 1;
    flechaIzq.style.display = hasOverflow ? 'flex' : 'none';
    flechaDer.style.display = hasOverflow ? 'flex' : 'none';
  };

  flechaIzq.addEventListener("click", () => {
    wrapper.scrollBy({ left: -140, behavior: "smooth" });
  });
  flechaDer.addEventListener("click", () => {
    wrapper.scrollBy({ left: 140, behavior: "smooth" });
  });

  window.addEventListener("resize", checkOverflow);
  checkOverflow();
});
</script>
