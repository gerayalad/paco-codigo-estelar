import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, Compass, Brain, Heart, Zap, Target, Sparkles, Eye, Star, Home, MapPin, Hash, Gift, Calendar, Lock } from 'lucide-react'
import './index.css'

// ==================== CAROUSEL COMPONENT ====================

const Carousel = ({ children }) => {
  const carouselRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const childCount = Array.isArray(children) ? children.length : 1

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft
      const cardWidth = carousel.firstElementChild?.offsetWidth || 0
      const gap = 20 // 1.25rem gap
      const index = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(index, childCount - 1))
    }

    carousel.addEventListener('scroll', handleScroll, { passive: true })
    return () => carousel.removeEventListener('scroll', handleScroll)
  }, [childCount])

  return (
    <>
      <div ref={carouselRef} className="carousel">
        {children}
      </div>
      <div className="carousel-indicators">
        {Array.from({ length: childCount }).map((_, i) => (
          <div
            key={i}
            className={`carousel-dot ${activeIndex === i ? 'active' : ''}`}
          />
        ))}
      </div>
    </>
  )
}

// ==================== PIN DIALOG ====================

const PinDialog = ({ onSuccess }) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const correctPin = '7235'

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit
      setPin(newPin)
      setError(false)

      if (newPin.length === 4) {
        if (newPin === correctPin) {
          setTimeout(() => onSuccess(), 300)
        } else {
          setError(true)
          setTimeout(() => setPin(''), 500)
        }
      }
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
    setError(false)
  }

  return (
    <div className="pin-overlay">
      <div className="pin-dialog">
        <div className="pin-icon">
          <Lock />
        </div>
        <h2 className="pin-title">Ingresa tu PIN</h2>
        <p className="pin-subtitle">Para acceder a tu código estelar</p>

        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pin-dot ${pin.length > i ? 'filled' : ''} ${error ? 'error' : ''}`}
            />
          ))}
        </div>

        <div className="pin-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, i) => (
            <button
              key={i}
              className={`pin-key ${key === null ? 'invisible' : ''} ${key === 'del' ? 'pin-key-del' : ''}`}
              onClick={() => key === 'del' ? handleDelete() : key !== null && handleDigit(String(key))}
              disabled={key === null}
            >
              {key === 'del' ? '⌫' : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ==================== NAVIGATION ====================

const Navigation = ({ activeSection }) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'carta', label: 'Carta', icon: MapPin },
    { id: 'numeros', label: 'Números', icon: Hash },
    { id: '2026', label: '2026', icon: Calendar },
    { id: 'regalos', label: 'Regalos', icon: Gift },
  ]

  return (
    <>
      {/* Bottom Tab Bar (Mobile) */}
      <nav className="nav-bottom">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-tab ${activeSection === item.id ? 'active' : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
            </a>
          )
        })}
      </nav>
    </>
  )
}

// ==================== COSMIC BACKGROUND ====================

const CosmicBackground = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Different parallax speeds for each layer
  const nebulaY = scrollY * 0.1
  const stars1Y = scrollY * 0.15
  const stars2Y = scrollY * 0.25
  const stars3Y = scrollY * 0.35

  return (
    <div className="cosmic-bg">
      {/* Nebula layer - slowest */}
      <div
        className="cosmic-nebula"
        style={{ transform: `translateY(-${nebulaY}px)` }}
      />

      {/* Star layers - progressively faster */}
      <div
        className="cosmic-stars cosmic-stars-1"
        style={{ transform: `translateY(-${stars1Y}px)` }}
      />
      <div
        className="cosmic-stars cosmic-stars-2"
        style={{ transform: `translateY(-${stars2Y}px)` }}
      />
      <div
        className="cosmic-stars cosmic-stars-3"
        style={{ transform: `translateY(-${stars3Y}px)` }}
      />

      {/* Shooting stars */}
      <div className="cosmic-shooting-star" />
      <div className="cosmic-shooting-star" />
      <div className="cosmic-shooting-star" />

      {/* Twinkling stars */}
      <div className="cosmic-twinkle" style={{ top: '10%', left: '15%', animationDelay: '0s' }} />
      <div className="cosmic-twinkle" style={{ top: '25%', left: '85%', animationDelay: '0.5s' }} />
      <div className="cosmic-twinkle" style={{ top: '40%', left: '45%', animationDelay: '1s' }} />
      <div className="cosmic-twinkle" style={{ top: '60%', left: '25%', animationDelay: '1.5s' }} />
      <div className="cosmic-twinkle" style={{ top: '75%', left: '70%', animationDelay: '2s' }} />
      <div className="cosmic-twinkle" style={{ top: '85%', left: '10%', animationDelay: '2.5s' }} />
    </div>
  )
}

// ==================== SVG COMPONENTS ====================

const LapisLazuliSVG = () => (
  <svg viewBox="0 0 60 75" className="w-12 h-15 mx-auto">
    <defs>
      <linearGradient id="lapisG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e40af" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <polygon points="30,8 12,62 30,55 48,62" fill="url(#lapisG)" stroke="#60a5fa" strokeWidth="1" opacity="0.9" />
    <circle cx="22" cy="38" r="1" fill="#e4b85c" opacity="0.8" />
    <circle cx="38" cy="30" r="0.8" fill="#e4b85c" opacity="0.7" />
  </svg>
)

const RodonitaSVG = () => (
  <svg viewBox="0 0 60 60" className="w-12 h-12 mx-auto">
    <defs>
      <linearGradient id="rodoG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
    </defs>
    <path d="M30,52 C12,38 8,22 18,14 C26,8 30,17 30,17 C30,17 34,8 42,14 C52,22 48,38 30,52 Z" fill="url(#rodoG)" stroke="#f472b6" strokeWidth="1" opacity="0.9" />
  </svg>
)

const OjoTigreSVG = () => (
  <svg viewBox="0 0 50 65" className="w-10 h-13 mx-auto">
    <defs>
      <linearGradient id="tigerG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    <path d="M25,60 C15,60 9,46 9,32 L9,18 C9,13 14,11 17,14 L17,28 C17,28 14,13 20,9 C24,6 27,6 27,11 L27,28 C27,28 31,13 37,14 C41,11 41,18 41,18 L41,32 C41,46 35,60 25,60 Z" fill="url(#tigerG)" stroke="#d97706" strokeWidth="1" opacity="0.9" />
    <ellipse cx="25" cy="40" rx="7" ry="10" fill="rgba(255,255,255,0.9)" />
    <ellipse cx="25" cy="40" rx="4" ry="6" fill="#1e3a8a" />
    <circle cx="25" cy="40" r="2" fill="#000" />
  </svg>
)

// ==================== SECTIONS ====================

const HeroSection = () => (
  <section id="inicio" className="section bg-gradient section-glow">
    <div className="container">
      <div className="section-header">
        <p className="label accent-cyan mb-3">Tu Código Estelar</p>
        <h1 className="title-main">Resumen Estelar:<br />Tu Siguiente Capítulo</h1>
      </div>

      <div className="glass-card-highlight stack-md fade-in">
        <p className="body-text">
          Paco, tu carta natal muestra a un hombre con un corazón inmenso, que ha sido el pilar firme y amoroso para los suyos <span className="inline-accent">(Luna en Tauro)</span>. Eso es un don: tener raíces fuertes es lo que permite a los grandes árboles crecer alto.
        </p>

        <p className="body-text accent-gold" style={{ fontWeight: 500 }}>
Tus astros te invitan hoy a soltar el refugio de tus raíces y tener la valentía de extender tus ramas hacia el cielo.        </p>

        <p className="body-text">
          Ya dominas el arte de cuidar y sostener a los demás; lo haces con maestría. Ahora, el universo te invita a que uses esa misma fuerza para construir tus propios sueños y tu propio legado <span className="inline-accent">(Sol en Escorpio/Casa 10)</span>. No se trata de elegir entre ellos o tú; se trata de entender que tú también mereces ese cuidado y esa dedicación que le das a todos.
        </p>
      </div>
    </div>
  </section>
)

const CartaNatalSection = () => (
  <section id="carta" className="section">
    <div className="container">
      <div className="section-header">
        <p className="label mb-2">Carta Natal</p>
        <h2 className="title-section">El Código del Alma</h2>
        <p className="subtitle">Paco Guadalupe • El Constructor de Legado</p>
      </div>

      {/* Intro */}
      <div className="glass-card stack-sm mb-6">
        <p className="body-text">
          Tu carta natal revela una geometría fascinante de tensiones y potencias. Eres un <strong>"Guerrero de la Paz"</strong> en proceso de transformación.
        </p>
      </div>

      {/* 1. TRÍADA */}
      <div className="mb-6">
        <img
          src="/sol_luna_ascendente.png"
          alt="Sol, Luna y Ascendente"
          className="w-full max-w-md mx-auto rounded-2xl"
          style={{ filter: 'drop-shadow(0 0 30px rgba(78, 205, 230, 0.2))' }}
        />
      </div>
      <div className="mb-8">
        <h3 className="title-section text-center mb-4">1. La Tríada de Personalidad</h3>

        <Carousel>
          {/* Sol */}
          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-4">
              <div className="icon-box" style={{ background: 'rgba(228, 184, 92, 0.15)' }}>
                <Sun className="accent-gold" />
              </div>
              <div>
                <p className="title-card accent-gold">Tu Esencia</p>
                <p className="subtitle">Sol en Escorpio (Casa 10)</p>
              </div>
            </div>
            <p className="title-item accent-gold">La Autoridad Natural</p>
            <div className="stack-xs">
              <p className="body-secondary">Tu identidad no está diseñada para la vida doméstica o anónima. Posees una ambición latente y capacidad de liderazgo.</p>
              <p className="body-secondary"><span className="accent-gold font-medium">El Arquetipo:</span> Eres el estratega. Tu energía es intensa, controlada y magnética. Tu alma pide respeto y reconocimiento profesional.</p>
            </div>
          </div>

          {/* Luna */}
          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-4">
              <div className="icon-box" style={{ background: 'rgba(167, 139, 250, 0.15)' }}>
                <Moon className="accent-purple" />
              </div>
              <div>
                <p className="title-card accent-purple">Tu Refugio</p>
                <p className="subtitle">Luna en Tauro (Casa 4)</p>
              </div>
            </div>
            <p className="title-item accent-purple">El Guardián de las Raíces</p>
            <div className="stack-xs">
              <p className="body-secondary">Aquí reside tu corazón. Tienes una necesidad instintiva de proteger el "nido". Eres el ancla de los tuyos.</p>
              <p className="body-secondary"><span className="accent-purple font-medium">El reto:</span> Esta Luna puede volverse inamovible, haciendo que te resistas a cambios necesarios.</p>
            </div>
          </div>

          {/* Ascendente */}
          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-4">
              <div className="icon-box" style={{ background: 'rgba(78, 205, 230, 0.15)' }}>
                <Compass className="accent-cyan" />
              </div>
              <div>
                <p className="title-card accent-cyan">Tu Destino</p>
                <p className="subtitle">Ascendente en Acuario</p>
              </div>
            </div>
            <p className="title-item accent-cyan">El Visionario Independiente</p>
            <div className="stack-xs">
              <p className="body-secondary">El mundo te percibe como alguien mental, original y con perspectiva única.</p>
              <p className="body-secondary"><span className="accent-cyan font-medium">La Misión:</span> Tu Ascendente te pide libertad. Vienes a romper moldes preestablecidos.</p>
            </div>
          </div>
        </Carousel>
      </div>

      <div className="divider" />

      {/* 2. PLANETAS */}
      <div className="mb-8">
        <h3 className="title-section text-center mb-4">2. Los Planetas Personales</h3>

        <Carousel>
          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Brain className="accent-purple" /></div>
              <div>
                <p className="title-card">☿ Tu Mente</p>
                <p className="subtitle">Mercurio en Escorpio</p>
              </div>
            </div>
            <p className="body-secondary">Posees una inteligencia penetrante. Tu mente funciona como un escáner que detecta lo que no se dice. Eres un investigador nato de la psique humana.</p>
          </div>

          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Heart className="accent-pink" /></div>
              <div>
                <p className="title-card">♀ Tu Deseo</p>
                <p className="subtitle">Venus en Libra (Casa 9)</p>
              </div>
            </div>
            <p className="title-item accent-pink">El Idealista del Amor</p>
            <p className="body-secondary">No buscas una relación convencional, buscas una conexión que expanda tu mente. Prefieres la soledad digna antes que una compañía que traiga conflicto.</p>
          </div>

          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Zap className="accent-red" /></div>
              <div>
                <p className="title-card">♂ Tu Acción</p>
                <p className="subtitle">Marte en Virgo (Casa 8)</p>
              </div>
            </div>
            <p className="title-item accent-red">El Guerrero Eficiente</p>
            <p className="body-secondary">Tu energía no es explosiva, es quirúrgica. Eres excelente resolviendo problemas complejos. Tu fuerza radica en el detalle y el análisis.</p>
          </div>
        </Carousel>
      </div>

      <div className="divider" />

      {/* 3. KÁRMICOS */}
      <div className="mb-8">
        <h3 className="title-section text-center mb-4">3. Los Puntos Kármicos</h3>

        <Carousel>
          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Target className="accent-emerald" /></div>
              <div>
                <p className="title-card accent-emerald">☊ Eje del Destino</p>
                <p className="subtitle">Nodos en Escorpio/Tauro</p>
              </div>
            </div>
            <div className="stack-xs">
              <p className="body-secondary"><strong>Zona de Confort:</strong> Vienes de vidas marcadas por protección del hogar y seguridad material.</p>
              <p className="body-secondary"><span className="accent-emerald font-medium">Misión Evolutiva:</span> El universo te empuja a salir del nido. Tienes un legado que construir fuera del hogar.</p>
            </div>
          </div>

          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Eye className="accent-purple" /></div>
              <div>
                <p className="title-card accent-purple">⚸ Tu Sombra</p>
                <p className="subtitle">Lilith en Aries (Casa 2)</p>
              </div>
            </div>
            <p className="body-secondary">Hay una lucha oculta con tu sentido de merecimiento. Sanar esto implica reconocer tu valor sin necesitar validación externa.</p>
          </div>

          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Star style={{ color: '#94a3b8' }} /></div>
              <div>
                <p className="title-card" style={{ color: '#94a3b8' }}>♄ Tu Maestro</p>
                <p className="subtitle">Saturno en Escorpio</p>
              </div>
            </div>
            <p className="body-secondary">La madurez llega a través de la profundidad filosófica. Estás construyendo una sabiduría sólida, forjada por experiencia e introspección.</p>
          </div>
        </Carousel>
      </div>

      <div className="divider" />

      {/* 4 & 5 */}
      <div className="grid-2">
        <div className="glass-card">
          <p className="title-card accent-cyan mb-2">♃ Tu Expansión</p>
          <p className="subtitle mb-3">Júpiter en Acuario (Casa 1)</p>
          <p className="body-secondary">Eres tu propio amuleto de la suerte. La abundancia llega cuando te atreves a ser auténtico. El universo premia tu individualidad.</p>
        </div>

        <div className="glass-card">
          <p className="title-card accent-gold mb-2">Resumen Estelar</p>
          <p className="body-text accent-gold">Tienes las raíces de un roble (Tauro) pero la visión de un águila (Escorpio/Acuario). Tienes el permiso cósmico para reclamar tu lugar en el mundo.</p>
        </div>
      </div>
    </div>
  </section>
)

const NumerologiaSection = () => (
  <section id="numeros" className="section bg-alt">
    <div className="container">
      <div className="section-header">
        <p className="label mb-2">Numerología</p>
        <h2 className="title-section">El Mapa del Destino</h2>
        <p className="subtitle">Basado en Fecha de Nacimiento y Nombre</p>
      </div>

      <div className="bento">
        {/* Camino 7 */}
        <div className="glass-card-highlight bento-span-2">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <div className="text-center sm:text-left flex-shrink-0">
              <div className="number-big">7</div>
              <p className="accent-cyan font-semibold mt-2">Camino de Vida</p>
            </div>
            <div className="stack-sm flex-1">
              <p className="body-text">Tu Camino de Vida 7 es el del buscador de verdad. Tu misión es desarrollar sabiduría a través de la observación, análisis e intuición.</p>
              <p className="body-secondary"><span className="accent-cyan font-medium">Talentos:</span> mente profunda, intuición fina, capacidad de investigar, detectar lo oculto.</p>
              <p className="body-secondary"><span className="accent-gold font-medium">Desafíos:</span> el 7 puede aislarse o volverse demasiado mental.</p>
            </div>
          </div>
        </div>

        {/* Día 9 */}
        <div className="glass-card text-center">
          <div className="number-medium mb-3">9</div>
          <p className="accent-purple font-semibold mb-2">Día de Nacimiento</p>
          <p className="body-secondary text-left">Visión amplia, empatía y sentido humano. Tu talento: cerrar ciclos, acompañar procesos, ver el "para qué" del dolor y del cambio.</p>
        </div>

        {/* Expresión 1 */}
        <div className="glass-card text-center">
          <div className="number-medium mb-3">1</div>
          <p className="accent-gold font-semibold mb-2">Expresión (Destino)</p>
          <p className="body-secondary text-left">Liderazgo, iniciativa, independencia. Vienes a abrir camino. Tú creces cuando decides, cuando te atreves, cuando empiezas.</p>
        </div>

        {/* Combinación */}
        <div className="glass-card" style={{ borderLeft: '3px solid var(--color-accent-cyan)' }}>
          <p className="title-item accent-cyan mb-2">Camino 7 + Expresión 1</p>
          <p className="body-text">Tu alma busca profundidad y tu expresión busca acción. Cuando alineas ambas fuerzas, eres imparable: piensas profundo, decides claro.</p>
        </div>

        {/* Alma 7 */}
        <div className="glass-card text-center">
          <div className="number-medium mb-3">7</div>
          <p className="accent-pink font-semibold mb-2">Número del Alma</p>
          <p className="body-secondary text-left">Tu alma busca silencio, verdad y significado. Anhelas paz mental, espacio personal y relaciones profundas.</p>
        </div>

        {/* Personalidad 3 */}
        <div className="glass-card text-center">
          <div className="number-medium mb-3">3</div>
          <p className="accent-emerald font-semibold mb-2">Personalidad</p>
          <p className="body-secondary text-left">La "máscara" que el mundo ve: carisma, comunicación, agilidad social. Aunque por dentro eres intenso, hacia afuera pareces más relajado.</p>
        </div>

      </div>
    </div>
  </section>
)

const AnoPersonalSection = () => (
  <section id="2026" className="section">
    <div className="container">
      <div className="section-header">
        <p className="label mb-2">El Ciclo Actual</p>
        <h2 className="title-section">Año Personal 2025: 11</h2>
        <p className="subtitle">Número Maestro</p>
      </div>

      {/* Cálculo */}
      <div className="glass-card mb-6">
        <p className="title-item accent-cyan mb-3">Cálculo</p>
        <p className="body-secondary">
          Mes 11 + Día 9 + Año universal 2025 (2+0+2+5=9) → 11 + 9 + 9 = 29 → 2+9 = <span className="accent-purple font-semibold">11</span> (NO se reduce).
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-card-highlight mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <div className="text-center sm:text-left flex-shrink-0">
            <div className="number-big">11</div>
            <p className="accent-purple font-semibold mt-2">Número Maestro</p>
          </div>
          <div className="stack-sm flex-1">
            <p className="body-text">
              Tu Año Personal 11 es un año de <span className="accent-purple font-medium">despertar, intuición, señales y expansión de conciencia</span>. No es el año más "lineal" o "fácil" para controlar, pero sí puede ser uno de los más poderosos para alinearte con tu propósito.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de energías */}
      <div className="grid-cards mb-6">
        <div className="glass-card">
          <p className="title-item accent-emerald mb-3">Energía Disponible</p>
          <ul className="stack-xs body-secondary">
            <li>• Claridad interna</li>
            <li>• Inspiración</li>
            <li>• Ideas grandes</li>
            <li>• Encuentros significativos</li>
            <li>• Intuición aumentada</li>
            <li>• "Sincronicidades"</li>
          </ul>
        </div>

        <div className="glass-card">
          <p className="title-item accent-cyan mb-3">Lo Que Debes Aprovechar</p>
          <ul className="stack-xs body-secondary">
            <li>• Estudiar</li>
            <li>• Afinar tu visión</li>
            <li>• Elevar estándares</li>
            <li>• Elegir con más conciencia</li>
            <li>• Escuchar tu intuición (pero con pies en la tierra)</li>
          </ul>
        </div>

        <div className="glass-card">
          <p className="title-item accent-red mb-3">Lo Que Debes Evitar</p>
          <ul className="stack-xs body-secondary">
            <li>• Ansiedad por exceso mental</li>
            <li>• Exigirte perfección</li>
            <li>• Querer forzar resultados inmediatos</li>
          </ul>
          <p className="body-secondary mt-3">
            <span className="accent-gold font-medium">El 11 pide confianza y sensibilidad, no rigidez.</span>
          </p>
        </div>
      </div>

      {/* Timing */}
      <div className="glass-card-highlight">
        <p className="title-item accent-gold mb-4">Nota Importante del Timing</p>
        <p className="body-text mb-4">
          En numerología, muchas personas sienten el Año Personal con más fuerza <span className="accent-gold font-medium">de cumpleaños a cumpleaños</span>.
        </p>

        <div className="grid-2">
          <div className="glass p-5">
            <p className="accent-purple font-semibold mb-2">9-nov-2024 → 8-nov-2025</p>
            <p className="body-secondary">
              Vienes cerrando un <span className="font-medium">Año 1</span> (arranques, decisiones, identidad).
            </p>
          </div>

          <div className="glass p-5" style={{ borderLeft: '3px solid var(--color-accent-cyan)' }}>
            <p className="accent-cyan font-semibold mb-2">9-nov-2025 → 8-nov-2026</p>
            <p className="body-secondary">
              Entras de lleno en tu <span className="font-medium">Año Maestro 11</span> (visión, intuición, expansión interna).
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const RegalosSection = () => (
  <section id="regalos" className="section">
    <div className="container">
      <div className="section-header">
        <p className="label mb-2">Regalos</p>
        <h2 className="title-section">Tu Arsenal Mineral</h2>
        <p className="subtitle">Herramientas de Apoyo Energético</p>
      </div>

      <div className="grid-cards mb-8">
        {/* Lapislázuli */}
        <div className="glass-card text-center">
          <div className="flex justify-center mb-4 py-2">
            <LapisLazuliSVG />
          </div>
          <p className="title-item accent-cyan">Pirámide de Lapislázuli</p>
          <p className="subtitle mb-3">(Visión y Futuro)</p>
          <div className="text-left stack-xs">
            <p className="body-secondary"><span className="accent-cyan font-medium">Significado:</span> Conecta tu mente profunda con tu visión de futuro.</p>
            <p className="body-secondary"><span className="accent-cyan font-medium">Para qué sirve:</span> Recordarte que tienes permiso de tener ambiciones altas. Te ayuda a ver con claridad tu siguiente paso.</p>
          </div>
        </div>

        {/* Rodonita */}
        <div className="glass-card text-center">
          <div className="flex justify-center mb-4 py-2">
            <RodonitaSVG />
          </div>
          <p className="title-item accent-pink">Corazón de Rodonita</p>
          <p className="subtitle mb-3">(Corazón y Relaciones)</p>
          <div className="text-left stack-xs">
            <p className="body-secondary"><span className="accent-pink font-medium">Significado:</span> La piedra de la compasión madura.</p>
            <p className="body-secondary"><span className="accent-pink font-medium">Para qué sirve:</span> Mantener tu corazón abierto y noble. Atraer vínculos donde recibas tanto como das.</p>
          </div>
        </div>

        {/* Ojo de Tigre */}
        <div className="glass-card text-center">
          <div className="flex justify-center mb-4 py-2">
            <OjoTigreSVG />
          </div>
          <p className="title-item accent-gold">Mano de Fátima</p>
          <p className="subtitle mb-3">en Ojo de Tigre (Fuerza)</p>
          <div className="text-left stack-xs">
            <p className="body-secondary"><span className="accent-gold font-medium">Significado:</span> Escudo ancestral de protección + piedra de la voluntad.</p>
            <p className="body-secondary"><span className="accent-gold font-medium">Para qué sirve:</span> Proteger tu empatía para ayudar sin agotarte. Empuje para pasar de planes a acción.</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card-highlight text-center">
        <p className="title-item mb-4">Estos tres elementos son un equipo:</p>
        <div className="grid-cards">
          <div>
            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: '#4ecde6' }} />
            <p className="accent-cyan font-medium">Lapislázuli</p>
            <p className="subtitle">para que veas tu grandeza</p>
          </div>
          <div>
            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: '#f472b6' }} />
            <p className="accent-pink font-medium">Rodonita</p>
            <p className="subtitle">para que merezcas amor</p>
          </div>
          <div>
            <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: '#e4b85c' }} />
            <p className="accent-gold font-medium">Ojo de Tigre</p>
            <p className="subtitle">para avanzar protegido</p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="py-8 text-center">
    <div className="container">
      <Sparkles className="w-6 h-6 mx-auto accent-gold mb-3" style={{ opacity: 0.6 }} />
      <p className="subtitle">Creado con intención para <span className="accent-gold">Paco</span></p>
      <p className="label mt-1" style={{ opacity: 0.4 }}>Tu código estelar, tu camino único</p>
    </div>
  </footer>
)

// ==================== MAIN APP ====================

function App() {
  const [unlocked, setUnlocked] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')

  useEffect(() => {
    if (!unlocked) return

    const handleScroll = () => {
      const sections = ['inicio', 'carta', 'numeros', '2026', 'regalos']
      const scrollPosition = window.scrollY + 100

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [unlocked])

  if (!unlocked) {
    return (
      <>
        <CosmicBackground />
        <PinDialog onSuccess={() => setUnlocked(true)} />
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <CosmicBackground />
      <Navigation activeSection={activeSection} />

      <main className="main-content">
        <HeroSection />
        <CartaNatalSection />
        <NumerologiaSection />
        <AnoPersonalSection />
        <RegalosSection />
        <Footer />
      </main>
    </div>
  )
}

export default App
