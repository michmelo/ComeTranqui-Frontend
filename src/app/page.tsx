"use client";

import { useState, useEffect } from "react";

// ────────────────────────────────────────────
//  Tipos
// ────────────────────────────────────────────
type Restriccion =
  | ""
  | "Sin Gluten"
  | "Sin Lactosa"
  | "APLV"
  | "Vegano"
  | "Vegetariano";

// ────────────────────────────────────────────
//  Header / Nav
// ────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#ofertas", label: "Ofertas" },
    { href: "#mapa", label: "Mapa" },
    { href: "#sobre-nosotros", label: "Sobre Nosotros" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#D1C9C5]/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" id="logo-link" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#A46C54] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl leading-none">☺</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Montserrat', sans-serif", color: "#563B2D" }}
            >
              COME
            </span>
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "'Dancing Script', cursive", color: "#A46C54" }}
            >
              tranqui
            </span>
          </div>
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#563B2D]/70 hover:text-[#A46C54] transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A46C54] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="btn-login"
            className="px-5 py-2 text-sm font-semibold text-[#563B2D] border border-[#C3A69A] rounded-full hover:bg-[#C3A69A]/20 transition-all duration-200"
          >
            Iniciar Sesión
          </button>
          <button
            id="btn-registro"
            className="px-5 py-2 text-sm font-semibold text-white bg-[#A46C54] rounded-full hover:bg-[#563B2D] shadow-md hover:shadow-lg transition-all duration-200"
          >
            Registrarse
          </button>
        </div>

        {/* Hamburger mobile */}
        <button
          id="btn-menu-mobile"
          className="md:hidden p-2 text-[#563B2D]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FAF8F5]/98 backdrop-blur-md border-t border-[#D1C9C5]/50 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-[#563B2D] hover:text-[#A46C54] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-[#D1C9C5]/50">
            <button className="flex-1 py-2 text-sm font-semibold text-[#563B2D] border border-[#C3A69A] rounded-full">
              Iniciar Sesión
            </button>
            <button className="flex-1 py-2 text-sm font-semibold text-white bg-[#A46C54] rounded-full">
              Registrarse
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ────────────────────────────────────────────
//  Hero
// ────────────────────────────────────────────
function HeroSection() {
  const [restriccion, setRestriccion] = useState<Restriccion>("");
  const [comuna, setComuna] = useState("");

  const restricciones: Restriccion[] = [
    "Sin Gluten",
    "Sin Lactosa",
    "APLV",
    "Vegano",
    "Vegetariano",
  ];

  const foodEmojis = [
    { emoji: "🍕", delay: "0s", top: "10%", left: "5%", size: "text-4xl" },
    { emoji: "☕", delay: "0.5s", top: "20%", right: "8%", size: "text-3xl" },
    { emoji: "🥐", delay: "1s", top: "65%", left: "3%", size: "text-3xl" },
    { emoji: "🫐", delay: "1.5s", top: "15%", right: "20%", size: "text-2xl" },
    { emoji: "🥗", delay: "2s", top: "70%", right: "5%", size: "text-3xl" },
    { emoji: "🍞", delay: "0.8s", top: "50%", left: "8%", size: "text-2xl" },
  ];

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C3A69A]/20 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#A46C54]/10 blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-[#D1C9C5]/20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Emojis flotantes */}
      {foodEmojis.map((item, i) => (
        <div
          key={i}
          className={`absolute ${item.size} animate-float opacity-30 hidden md:block`}
          style={{
            top: item.top,
            left: "left" in item ? item.left : undefined,
            right: "right" in item ? item.right : undefined,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </div>
      ))}

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A46C54]/10 border border-[#A46C54]/20 mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-[#A46C54] animate-pulse" />
          <span className="text-xs font-semibold text-[#A46C54] tracking-widest uppercase">
            Comida segura para todos
          </span>
        </div>

        {/* Título principal */}
        <h1
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up animate-delay-100"
          style={{ color: "#563B2D" }}
        >
          Come lo que amas,
          <br />
          <span
            style={{ fontFamily: "'Dancing Script', cursive", color: "#A46C54" }}
            className="text-6xl md:text-8xl"
          >
            sin preocuparte
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-[#563B2D]/60 max-w-2xl mx-auto mb-10 font-light animate-fade-in-up animate-delay-200">
          Encuentra restaurantes y cafeterías <strong className="font-semibold text-[#563B2D]/80">certificados y seguros</strong> para
          tu restricción alimentaria. Sin gluten, sin lactosa, APLV, vegano y más.
        </p>

        {/* Buscador */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[#D1C9C5]/60 p-4 md:p-6 max-w-3xl mx-auto animate-fade-in-up animate-delay-300">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Restricción */}
            <div className="flex-1">
              <label
                htmlFor="select-restriccion"
                className="block text-xs font-semibold text-[#563B2D]/60 uppercase tracking-wider mb-1.5 text-left"
              >
                Mi restricción
              </label>
              <select
                id="select-restriccion"
                value={restriccion}
                onChange={(e) => setRestriccion(e.target.value as Restriccion)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D1C9C5] text-[#563B2D] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A46C54]/30 focus:border-[#A46C54] transition-all"
              >
                <option value="">Selecciona tu restricción</option>
                {restricciones.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Comuna */}
            <div className="flex-1">
              <label
                htmlFor="input-comuna"
                className="block text-xs font-semibold text-[#563B2D]/60 uppercase tracking-wider mb-1.5 text-left"
              >
                Mi comuna
              </label>
              <input
                id="input-comuna"
                type="text"
                placeholder="Ej: Las Condes, Providencia..."
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D1C9C5] text-[#563B2D] text-sm placeholder-[#D1C9C5] focus:outline-none focus:ring-2 focus:ring-[#A46C54]/30 focus:border-[#A46C54] transition-all"
              />
            </div>

            {/* Botón buscar */}
            <div className="flex items-end">
              <button
                id="btn-buscar-hero"
                className="w-full md:w-auto px-8 py-3 bg-[#A46C54] text-white font-bold rounded-xl hover:bg-[#563B2D] shadow-lg hover:shadow-xl transition-all duration-300 text-sm whitespace-nowrap active:scale-95"
              >
                🔍 Buscar
              </button>
            </div>
          </div>

          {/* Tags rápidos */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#D1C9C5]/40">
            <span className="text-xs text-[#563B2D]/40 font-medium self-center">
              Búsquedas populares:
            </span>
            {["Sin Gluten", "Sin Lactosa", "Vegano", "APLV"].map((tag) => (
              <button
                key={tag}
                id={`tag-${tag.replace(" ", "-").toLowerCase()}`}
                onClick={() => setRestriccion(tag as Restriccion)}
                className="px-3 py-1 text-xs font-semibold rounded-full bg-[#C3A69A]/20 text-[#563B2D] hover:bg-[#A46C54] hover:text-white transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up animate-delay-400">
          {[
            { valor: "+200", label: "Locales seguros" },
            { valor: "+500", label: "Ofertas activas" },
            { valor: "4", label: "Tipos de restricción" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-[#A46C54]">
                {stat.valor}
              </div>
              <div className="text-xs font-medium text-[#563B2D]/50 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-[#563B2D]/30 font-medium tracking-widest uppercase">
          Descubre más
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-[#C3A69A] flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-[#A46C54] animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
//  Features
// ────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      id: "feature-mapa",
      icon: "🗺️",
      title: "Mapa de Locales Seguros",
      description:
        "Localiza cafeterías y restaurantes verificados según su nivel de seguridad alimentaria. Filtra por restricción y encuentra el lugar ideal cerca tuyo.",
      color: "#A46C54",
      bg: "#A46C54/10",
      items: [
        "Clasificación de contaminación cruzada",
        "Filtros por restricción alimentaria",
        "Reseñas de la comunidad",
      ],
      cta: "Ver el mapa",
      href: "#mapa",
    },
    {
      id: "feature-ofertas",
      icon: "🏷️",
      title: "Buscador de Ofertas",
      description:
        "Encuentra alimentos específicos aptos para tu restricción con los mejores descuentos del día. Ahorra mientras comes seguro.",
      color: "#563B2D",
      bg: "#563B2D/10",
      items: [
        "Ofertas actualizadas en tiempo real",
        "Filtrado por tipo de restricción",
        "Alertas de descuentos personalizadas",
      ],
      cta: "Ver ofertas",
      href: "#ofertas",
    },
  ];

  return (
    <section id="ofertas" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#C3A69A]/20 text-xs font-bold text-[#A46C54] uppercase tracking-widest mb-4">
            Funcionalidades
          </span>
          <h2
            className="text-4xl md:text-5xl font-extrabold"
            style={{ color: "#563B2D" }}
          >
            Todo lo que necesitas
            <br />
            <span style={{ color: "#A46C54" }}>en un solo lugar</span>
          </h2>
          <p className="text-[#563B2D]/55 mt-4 max-w-xl mx-auto">
            Dos herramientas poderosas diseñadas para que puedas comer fuera de
            casa con total tranquilidad y confianza.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((f) => (
            <div
              key={f.id}
              id={f.id}
              className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-[#D1C9C5]/60 hover:shadow-2xl hover:border-[#C3A69A] transition-all duration-500 overflow-hidden"
            >
              {/* Fondo decorativo hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                style={{
                  background: `radial-gradient(circle at top right, ${f.color}08 0%, transparent 60%)`,
                }}
              />

              <div className="relative">
                {/* Ícono */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${f.color}18` }}
                >
                  {f.icon}
                </div>

                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: "#563B2D" }}
                >
                  {f.title}
                </h3>
                <p className="text-[#563B2D]/60 mb-6 leading-relaxed">
                  {f.description}
                </p>

                {/* Lista de beneficios */}
                <ul className="space-y-2 mb-8">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: f.color }}
                      >
                        ✓
                      </span>
                      <span className="text-[#563B2D]/70">{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={f.href}
                  id={`cta-${f.id}`}
                  className="inline-flex items-center gap-2 font-bold text-sm group/btn"
                  style={{ color: f.color }}
                >
                  {f.cta}
                  <span className="group-hover/btn:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
//  Clasificación de Seguridad
// ────────────────────────────────────────────
function SafetySection() {
  const niveles = [
    {
      id: "nivel-1",
      nivel: "Nivel 1",
      nombre: "Exclusivo / Certificado",
      descripcion:
        "Locales 100% dedicados a tu restricción. Sin trazas, cocinas separadas y personal capacitado. La opción más segura.",
      emoji: "🏆",
      badge: "Sin trazas garantizadas",
      badgeColor: "#2D7A4A",
      badgeBg: "#2D7A4A18",
      borderColor: "#2D7A4A",
      accentBg: "#2D7A4A0D",
    },
    {
      id: "nivel-2",
      nivel: "Nivel 2",
      nombre: "Opción Segura",
      descripcion:
        "Cocinas separadas para preparar tu plato. Alto estándar de higiene y protocolos anti contaminación cruzada.",
      emoji: "✅",
      badge: "Cocinas separadas",
      badgeColor: "#A46C54",
      badgeBg: "#A46C5418",
      borderColor: "#A46C54",
      accentBg: "#A46C540D",
    },
    {
      id: "nivel-3",
      nivel: "Nivel 3",
      nombre: "Opción Básica",
      descripcion:
        "Ofrecen platos alternativos sin garantía total de trazas. Recomendado para personas con intolerancia leve.",
      emoji: "⚠️",
      badge: "Sin garantía de trazas",
      badgeColor: "#8B6914",
      badgeBg: "#8B691418",
      borderColor: "#C3A69A",
      accentBg: "#C3A69A0D",
    },
  ];

  return (
    <section
      id="sobre-nosotros"
      className="py-24 px-6 bg-gradient-to-b from-transparent to-[#C3A69A]/10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[#A46C54]/10 text-xs font-bold text-[#A46C54] uppercase tracking-widest mb-4">
            Transparencia
          </span>
          <h2
            className="text-4xl md:text-5xl font-extrabold"
            style={{ color: "#563B2D" }}
          >
            Entiende nuestros
            <br />
            <span style={{ color: "#A46C54" }}>niveles de seguridad</span>
          </h2>
          <p className="text-[#563B2D]/55 mt-4 max-w-xl mx-auto">
            Clasificamos cada local según criterios estrictos de seguridad
            alimentaria para que puedas tomar decisiones informadas.
          </p>
        </div>

        {/* Niveles */}
        <div className="grid md:grid-cols-3 gap-6">
          {niveles.map((n, i) => (
            <div
              key={n.id}
              id={n.id}
              className="relative rounded-3xl p-7 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{
                backgroundColor: n.accentBg,
                borderColor: n.borderColor + "40",
              }}
            >
              {/* Número */}
              <div
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                style={{
                  backgroundColor: n.badgeBg,
                  color: n.badgeColor,
                }}
              >
                {i + 1}
              </div>

              {/* Emoji */}
              <div className="text-4xl mb-4">{n.emoji}</div>

              {/* Nivel */}
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: n.badgeColor }}
              >
                {n.nivel}
              </p>

              {/* Nombre */}
              <h3
                className="text-xl font-extrabold mb-3"
                style={{ color: "#563B2D" }}
              >
                {n.nombre}
              </h3>

              {/* Descripción */}
              <p className="text-sm text-[#563B2D]/60 leading-relaxed mb-5">
                {n.descripcion}
              </p>

              {/* Badge */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: n.badgeBg,
                  color: n.badgeColor,
                }}
              >
                {n.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#563B2D] to-[#A46C54] p-8 md:p-10 text-center text-white shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3">
            ¿Quieres sumarte?
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4">
            Registra tu local en Come Tranqui
          </h3>
          <p className="text-white/70 max-w-lg mx-auto mb-6 text-sm">
            Certifica tu establecimiento y llega a miles de personas con
            restricciones alimentarias que buscan un lugar seguro donde comer.
          </p>
          <button
            id="btn-registrar-local"
            className="px-8 py-3 bg-white text-[#563B2D] font-bold rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Registrar mi local →
          </button>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────
//  Footer
// ────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Plataforma: ["Inicio", "Mapa de Locales", "Buscador de Ofertas", "Registrar Local"],
    Restricciones: ["Sin Gluten", "Sin Lactosa", "APLV", "Vegano", "Vegetariano"],
    Nosotros: ["Sobre Come Tranqui", "Equipo", "Contacto", "Términos y Condiciones"],
  };

  const team = [
    "Melanie Ríos",
    "Sebastián Torres",
    "Valentina García",
    "Nicolás López",
  ];

  return (
    <footer className="bg-[#563B2D] text-white/80 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top */}
        <div className="grid md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#A46C54] flex items-center justify-center">
                <span className="text-white text-lg">☺</span>
              </div>
              <div>
                <span
                  className="text-xl font-extrabold text-white tracking-tight"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  COME
                </span>
                <span
                  className="text-xl font-bold text-[#C3A69A]"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {" "}
                  tranqui
                </span>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              La plataforma para comer fuera de casa con total seguridad y
              confianza, sin importar tu restricción alimentaria.
            </p>
            <div className="flex gap-3">
              {["𝕏", "IG", "FB"].map((social) => (
                <button
                  key={social}
                  id={`social-${social.toLowerCase().replace("𝕏", "x")}`}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#A46C54] flex items-center justify-center text-xs font-bold transition-all duration-200"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {year} Come Tranqui. Todos los derechos reservados.</p>
          <p className="text-center">
            Desarrollado con ❤️ por{" "}
            <span className="text-[#C3A69A]">{team.join(", ")}</span>
          </p>
          <p>Hecho en Chile 🇨🇱</p>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────
//  Page principal
// ────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SafetySection />
      </main>
      <Footer />
    </div>
  );
}
