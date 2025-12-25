import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, Compass, Brain, Heart, Zap, Target, Sparkles, Eye, Star, Home, MapPin, Hash, Gift, Calendar, Lock, Users, ArrowLeft, ChevronDown } from 'lucide-react'
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

// ==================== COVER SCREEN ====================

const CoverScreen = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const videoRef = useRef(null)

  const handleEnter = () => {
    setIsExiting(true)
    setTimeout(() => {
      onEnter()
    }, 800)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        if (duration > 0) {
          const percent = Math.round((bufferedEnd / duration) * 100)
          setLoadProgress(percent)
        }
      }
    }

    const handleCanPlay = () => {
      setLoadProgress(100)
      setTimeout(() => setVideoLoaded(true), 300)
    }

    video.addEventListener('progress', handleProgress)
    video.addEventListener('canplaythrough', handleCanPlay)

    return () => {
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('canplaythrough', handleCanPlay)
    }
  }, [])

  return (
    <div className={`cover-screen ${isExiting ? 'cover-exit' : ''}`}>
      {/* Imagen de fondo mientras carga */}
      <div className={`cover-poster ${videoLoaded ? 'hidden' : ''}`}>
        <img src="/front_2.png" alt="Portada" className="cover-poster-img" />
        <div className="cover-loading">
          <div className="cover-loading-bar">
            <div className="cover-loading-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <span className="cover-loading-text">{loadProgress}%</span>
        </div>
      </div>

      {/* Video */}
      <div className={`cover-video-wrapper ${videoLoaded ? 'visible' : ''}`}>
        <video
          ref={videoRef}
          className="cover-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video_front_2.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="cover-overlay" />
      <button className={`cover-scroll-indicator ${videoLoaded ? 'visible' : ''}`} onClick={handleEnter}>
        <span>Toca para explorar</span>
        <ChevronDown className="cover-chevron" />
      </button>
    </div>
  )
}

// ==================== NAVIGATION ====================

const Navigation = ({ activeSection, onFamiliaClick, currentScreen }) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'carta', label: 'Carta', icon: MapPin },
    { id: 'numeros', label: 'Números', icon: Hash },
    { id: '2026', label: '2026', icon: Calendar },
    { id: 'regalos', label: 'Regalos', icon: Gift },
    { id: 'familia', label: 'Familia', icon: Users },
  ]

  return (
    <>
      {/* Bottom Tab Bar (Mobile) */}
      <nav className="nav-bottom">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = item.id === 'familia' ? currentScreen === 'familia' : activeSection === item.id

          if (item.id === 'familia') {
            return (
              <button
                key={item.id}
                onClick={onFamiliaClick}
                className={`nav-tab ${isActive ? 'active' : ''}`}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          }

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => currentScreen === 'familia' && onFamiliaClick()}
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
        <p className="body-secondary mt-4" style={{ maxWidth: '540px', margin: '1rem auto 0' }}>
          Este es tu mapa personal basado en astrología y numerología. Explora tu <span className="accent-cyan">Carta Natal</span>, descubre tus <span className="accent-purple">Números del Destino</span>, conoce la energía de tu <span className="accent-gold">2026</span>, y encuentra tus <span className="accent-pink">Regalos Energéticos</span>.
        </p>
      </div>

      <div className="glass-card-highlight stack-md fade-in">
        <p className="body-text">
          Paco, tu carta natal muestra a un hombre con un corazón inmenso, que ha sido el sostén emocional de su entorno <span className="inline-accent">(Luna en Libra/Casa 8)</span>. Eso es un don: tu capacidad de mediar y armonizar es lo que mantiene unidos a los tuyos.
        </p>

        <p className="body-text accent-gold" style={{ fontWeight: 500 }}>
Tus astros te invitan hoy a dejar de cargar las emociones del mundo y construir tu propia paz.        </p>

        <p className="body-text">
          Ya dominas el arte de cuidar y sostener a los demás; lo haces con maestría. Ahora, el universo te invita a que uses esa misma fuerza para construir tus propios sueños y tu propio legado <span className="inline-accent">(Sol en Escorpio/Casa 9)</span>. No se trata de elegir entre ellos o tú; se trata de entender que tú también mereces ese cuidado y esa dedicación que le das a todos.
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
        <p className="subtitle">Paco Guadalupe • El Guardián Diplomático</p>
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
                <p className="subtitle">Sol en Escorpio (Casa 9)</p>
              </div>
            </div>
            <p className="title-item accent-gold">El Buscador de la Verdad</p>
            <div className="stack-xs">
              <p className="body-secondary">Tu identidad central es magnética, reservada y leal hasta la médula. Al estar en la Casa 9, tu naturaleza Escorpio se eleva: no eres alguien que se queda en el rencor, sino alguien que busca el "porqué" de las cosas.</p>
              <p className="body-secondary"><span className="accent-gold font-medium">Tu Energía:</span> Eres un detector natural de autenticidad. Sabes instintivamente quién es real y quién finge.</p>
              <p className="body-secondary"><span className="accent-gold font-medium">Tu Rol:</span> Tienes la capacidad de sostener situaciones de crisis con una calma inusual. Eres el consejero silencioso y sabio.</p>
            </div>
          </div>

          {/* Luna */}
          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-4">
              <div className="icon-box" style={{ background: 'rgba(167, 139, 250, 0.15)' }}>
                <Moon className="accent-purple" />
              </div>
              <div>
                <p className="title-card accent-purple">Tu Mundo Emocional</p>
                <p className="subtitle">Luna en Libra (Casa 8)</p>
              </div>
            </div>
            <p className="title-item accent-purple">El Mediador del Alma</p>
            <div className="stack-xs">
              <p className="body-secondary">Aquí reside tu corazón y tu instinto. La Luna en Libra necesita paz, belleza y justicia para sentirse segura. Al ubicarse en la Casa 8, tu empatía no tiene barreras.</p>
              <p className="body-secondary"><span className="accent-purple font-medium">El Don:</span> Sientes las emociones de tu entorno como si fueran tuyas. Tienes un talento innato para la diplomacia y para suavizar conflictos.</p>
              <p className="body-secondary"><span className="accent-purple font-medium">El Desafío:</span> Tu bienestar emocional depende del equilibrio de tus relaciones cercanas. Te cuesta poner límites firmes porque temes romper la armonía.</p>
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
              <p className="body-secondary">Esta es la energía hacia la cual evoluciona tu alma. Aunque por dentro eres intenso y emotivo, el mundo te percibe como alguien mental, original y con una perspectiva única.</p>
              <p className="body-secondary"><span className="accent-cyan font-medium">La Misión:</span> Tu Ascendente te pide Independencia y Libertad Mental. Vienes a aprender a desapegarte un poco del drama emocional para mirar el futuro con visión objetiva. Tu camino es romper moldes y atreverte a ser diferente.</p>
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
                <p className="subtitle">Mercurio en Sagitario</p>
              </div>
            </div>
            <p className="body-secondary">Tu pensamiento es libre, optimista y directo. Tienes sed de conocimiento y una mente que siempre busca el sentido mayor de la vida.</p>
            <p className="body-secondary"><span className="accent-purple font-medium">Cómo te comunicas:</span> Te aburre lo trivial. Necesitas conversaciones que expandan tu mente. Eres un eterno estudiante y un filósofo natural.</p>
          </div>

          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Heart className="accent-pink" /></div>
              <div>
                <p className="title-card">❤️ Tu Deseo</p>
                <p className="subtitle">Venus en Escorpio</p>
              </div>
            </div>
            <p className="title-item accent-pink">El Amor Absoluto</p>
            <p className="body-secondary">Venus en Escorpio no entiende de tibiezas; para ti, el amor es una fusión total de almas o no es nada.</p>
            <p className="body-secondary"><span className="accent-pink font-medium">Tu Estándar:</span> Tienes una necesidad de lealtad inquebrantable. Eres extremadamente selectivo porque entregas todo. Prefieres la soledad digna antes que una compañía superficial.</p>
          </div>

          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Zap className="accent-red" /></div>
              <div>
                <p className="title-card">⚔️ Tu Acción</p>
                <p className="subtitle">Marte en Libra</p>
              </div>
            </div>
            <p className="title-item accent-red">El Estratega Pacífico</p>
            <p className="body-secondary">Tu motor de acción funciona a través del intelecto y la cooperación. Te cuesta tomar decisiones de forma impulsiva o egoísta.</p>
            <p className="body-secondary"><span className="accent-red font-medium">El Freno:</span> Antes de dar un paso, analizas cómo afectará a los demás. Tu gran lección es aprender a afirmar tu voluntad y decir "esto es lo que yo quiero".</p>
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
                <p className="title-card accent-emerald">☊ Tu Evolución</p>
                <p className="subtitle">Nodo Norte en Tauro / Nodo Sur en Escorpio</p>
              </div>
            </div>
            <div className="stack-xs">
              <p className="body-secondary"><strong>Tu Zona de Confort (Nodo Sur):</strong> Tu alma ya conoce la intensidad, el manejo de crisis y la fusión emocional con otros. Tienes una tendencia inconsciente a complicarte la vida o a cargar con pesos psicológicos ajenos.</p>
              <p className="body-secondary"><span className="accent-emerald font-medium">Tu Misión (Nodo Norte):</span> El universo te empuja hacia la SIMPLICIDAD. Vienes a aprender a disfrutar de la calma, a conectar con la tierra y a cultivar una paz inamovible.</p>
            </div>
          </div>

          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Eye className="accent-purple" /></div>
              <div>
                <p className="title-card accent-purple">⚸ Tu Sombra</p>
                <p className="subtitle">Lilith en Tauro</p>
              </div>
            </div>
            <p className="body-secondary">Existe un bloqueo sutil relacionado con el merecimiento y el disfrute. Puede haber una voz interna que te hace sentir culpa por disfrutar de los placeres materiales o por ponerte a ti primero.</p>
            <p className="body-secondary"><span className="accent-purple font-medium">La Sanación:</span> Reconocer que tu gozo y tu abundancia son derechos de nacimiento.</p>
          </div>

          <div className="carousel-card glass-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="icon-box"><Star style={{ color: '#94a3b8' }} /></div>
              <div>
                <p className="title-card" style={{ color: '#94a3b8' }}>♄ Tu Maestro</p>
                <p className="subtitle">Saturno en Escorpio</p>
              </div>
            </div>
            <p className="body-secondary">La madurez en tu vida llega a través de la transformación profunda. Saturno te ha enseñado a ser responsable y resistente ante las pruebas emocionales. Ahora, te pide que uses esa fortaleza para estructurar tu propio poder personal.</p>
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
          <p className="body-text accent-gold">Tu carta describe el viaje de un alma que ha sido el sostén emocional de su entorno (Luna en Libra), hacia un destino de paz personal (Nodo Norte en Tauro). Tienes permiso cósmico para estar bien y disfrutar de lo simple.</p>
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
        <p className="label mb-2">Tu Energía para 2026</p>
        <h2 className="title-section">Año Personal: 11</h2>
        <p className="subtitle">Número Maestro</p>
      </div>

      {/* Explicación */}
      <div className="glass-card mb-6">
        
        <p className="body-secondary mb-3">
          En numerología, el Año Personal se calcula con el <span className="accent-gold font-medium">año universal</span> (2025), pero se vive principalmente <span className="accent-cyan font-medium">de cumpleaños a cumpleaños</span>. Como tu cumpleaños es en noviembre, esta energía 11 te acompañará desde <span className="font-medium">noviembre 2025 hasta noviembre 2026</span>.
        </p>
        <p className="body-secondary" style={{ opacity: 0.7 }}>
          <span className="accent-purple font-medium">Cálculo:</span> Mes 11 + Día 9 + Año 2025 (2+0+2+5=9) → 11 + 9 + 9 = 29 → 2+9 = <span className="accent-purple font-semibold">11</span> (número maestro, no se reduce).
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-card-highlight mb-6">
        <div className="text-center mb-4">
          <div className="number-big">11</div>
          <p className="accent-purple font-semibold mt-2">Número Maestro</p>
        </div>
        <p className="body-text">
          Tu Año Personal 11 es un año de <span className="accent-purple font-medium">despertar, intuición, señales y expansión de conciencia</span>. No es el año más "lineal" o "fácil" para controlar, pero sí puede ser uno de los más poderosos para alinearte con tu propósito.
        </p>
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

const FamiliaScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('mama')

  const tabs = [
    { id: 'mama', label: 'Mamá' },
    { id: 'papa', label: 'Papá' },
    { id: 'oly', label: 'Oly' },
    { id: 'robert', label: 'Robert' },
    { id: 'isa', label: 'Isa' },
    { id: 'gera', label: 'Gera' },
  ]

  const familyContent = {
    robert: {
      title: 'Roberto',
      relation: 'Hermano',
      content: `1. La "Tríada de Personalidad" (Quién eres)
Este es el núcleo de tu ser. La combinación de estas tres energías define tu "yo" primordial.

El Sol en Cáncer (Casa 5/6): La Esencia Nutricia. Roberto, tu núcleo es agua cardinal. Eres una persona profundamente sensible, empática y protectora. Tu energía vital se recarga cuando estás en entornos seguros, con "tu gente" o tu familia (de sangre o elegida). Al estar el Sol en una posición nocturna y cerca de la Casa 6 (la rutina y el servicio) o la 5 (creatividad), brillas cuando cuidas de otros o cuando creas algo que tiene un impacto emocional. Eres el "cangrejo": duro por fuera para proteger la inmensa ternura que llevas dentro.

La Luna en Géminis (Casa 4): El Refugio Intelectual. Aquí hay un contraste interesante con tu Sol. Mientras tu esencia (Cáncer) siente, tu mecanismo emocional (Géminis) piensa y habla. Para sentirte seguro, necesitas entender, racionalizar y comunicar lo que te pasa. Es probable que tu madre fuera una figura muy comunicativa, inteligente o quizás un poco nerviosa/cambiante. Tú procesas las emociones a través de la mente; a veces, en lugar de llorar, necesitas explicar por qué tienes ganas de llorar. Tu seguridad radica en la información y la variedad.

El Ascendente en Acuario: La Máscara Visionaria. Esta es la energía que proyectas al mundo y tu camino de integración. Aunque por dentro eres emocional y familiar (Cáncer), el mundo te ve como alguien original, independiente, un poco distante y muy mental. Tu destino te empuja a ser diferente, a romper moldes. La gente se acerca a ti esperando a alguien "cool" y desapegado, y se sorprenden al encontrar luego tu corazón sensible de Cáncer. Vienes a aprender a ser libre y a trabajar por el colectivo, usando la tecnología o ideas innovadoras.

2. Los Planetas Personales (Tus Herramientas)
Cómo interactúas, amas y luchas en tu vida diaria.

Mercurio en Géminis (Casa 4/5): Tu Mente. ¡Tienes a Mercurio en su propio signo! (Nota: Aunque en algunas efemérides podría estar entrando en Cáncer, por la hora y fecha está en el límite, pero actuando con mucha fuerza comunicativa). Tienes una mente rapidísima, curiosa y versátil. Eres un "multitasking" natural. Tu forma de comunicar es ágil, juvenil y a veces dispersa. Aprendes rápido, pero puedes aburrirte igual de rápido si algo no estimula tu intelecto.

Venus en Leo (Casa 6/7): Tu Deseo. En el amor y el dinero, no te gustan las medias tintas. Venus en Leo es teatral, generosa y leal. Buscas una pareja de la que puedas sentirte orgulloso/a y que te trate como a un rey. Te atrae el brillo, el lujo y la calidez. En el amor, necesitas ser admirado y validado. Eres muy generoso con tu dinero cuando se trata de hacer sentir bien a los que amas.

Marte en Géminis (Casa 4/5): Tu Motor. Tu forma de luchar es verbal. No eres de ir al choque físico o agresivo directo, sino que usas la palabra como espada. Tu energía es nerviosa; te cuesta estar quieto. Te motivan los retos intelectuales. Lo difícil para ti es la constancia: empiezas proyectos con mucho entusiasmo (Marte), pero si pierdes el interés mental, puedes dejarlos a medias. Tu fuerza de voluntad depende de tu curiosidad.

3. Los Puntos Kármicos y Evolutivos (El Alma)
Aquí entramos en lo profundo: el viaje de tu alma.

Los Nodos Lunares:

Nodo Sur en Tauro (Lo que ya sabes): En vidas pasadas (o en tu infancia), te aferraste a lo material, a la estabilidad inamovible y a la terquedad. Vienes con una tendencia innata a querer que las cosas "no cambien" y a buscar seguridad en las posesiones o en la zona de confort.

Nodo Norte en Escorpio (Tu misión): Tu alma viene a experimentar la transformación radical. Debes soltar el apego a lo material para fusionarte profundamente con otros. Tu misión es aceptar el cambio, la crisis y el renacimiento. Vienes a entender que la verdadera seguridad no está en lo que tienes (Tauro), sino en tu capacidad de sobrevivir a cualquier pérdida y regenerarte (Escorpio).

Quirón en Virgo (Casa 7/8): La Herida de la Imperfección. Tu herida tiene que ver con el orden, la salud o el sentir que "algo está mal en ti". Quizás sientes que por mucho que hagas, nunca es suficientemente perfecto o útil. Sanas a otros ayudándoles a organizar sus vidas o su salud, pero eres muy crítico contigo mismo. Tu medicina está en aceptar el caos como parte de la vida y servir sin esclavizarte.

Lilith en Tauro: Tu sombra tiene que ver con el placer y la posesión. Puede haber un miedo inconsciente a la carencia económica que te hace acumular, o una rebeldía total contra el materialismo. En la intimidad, tienes un deseo profundo y terrenal que a veces reprimes por intentar ser "correcto".

Saturno en Piscis (Casa 1/2): El Maestro. Saturno aquí te pide estructurar lo intangible. Es una posición difícil porque Piscis no tiene límites y Saturno es el límite. Tu lección kármica es materializar tus sueños. Puedes sentir miedos irracionales o una sensación de que el mundo es un lugar confuso. Tu madurez llega cuando aprendes a poner límites sanos y a tener disciplina espiritual o artística.

4. Los Planetas Sociales y Transpersonales (El Contexto)
Júpiter en Escorpio: Tu suerte y expansión vienen cuando profundizas. No eres superficial. Tienes un talento natural para la investigación, la psicología o las finanzas compartidas. Creces cuando te atreves a mirar en la sombra y descubrir secretos. Eres un "detective" del alma.

Urano y Neptuno en Capricornio / Plutón en Escorpio: Eres parte de la generación "Millennial" constructora. Tienes a Plutón en su domicilio (Escorpio), lo que te da una intensidad generacional tremenda para transformar la sociedad y destruir lo que ya no sirve. Urano y Neptuno en Capricornio te dan la capacidad de soñar, pero con los pies en la tierra; buscas traer cambios espirituales o innovadores a través de estructuras reales y tangibles.

5. Las Casas Astrológicas (El Escenario)
Roberto, al tener un Ascendente Acuario, tu regente moderno es Urano y el antiguo Saturno.

Eje Casa 1 (Acuario) - Casa 7 (Leo): El "Yo" vs. el "Nosotros". Este es un eje fundamental para ti. Te presentas como libre e independiente (Acuario), pero proyectas en la pareja la necesidad de ser el centro de atención o el líder (Leo). Tu gran aprendizaje es equilibrar tu necesidad de libertad con el compromiso leal y cálido que exige tu Venus y tu Casa 7.

Casa 4 (Géminis) y Casa 5 (Cáncer): Hay mucha energía en tu zona privada. La familia, el hogar y tus raíces son temas centrales donde inviertes mucha energía mental y emocional. Es probable que tu hogar sea un lugar de mucho movimiento, libros, visitas y comunicación (Géminis en casa 4).

Casa 8 y 9 (Escorpio): Con Júpiter y el Nodo Norte aquí, tu evolución máxima ocurre a través de crisis, herencias, sexualidad profunda o estudios superiores/filosóficos. No tengas miedo a los cambios drásticos; son tu puerta al éxito.

Conclusión para ti, Roberto
Eres un visionario sensible. Tu Ascendente Acuario te invita a mirar al futuro y conectar con la humanidad, pero tu Sol en Cáncer te pide no olvidar tus raíces y tu corazón. Tu gran reto es mental (Luna/Marte en Géminis): calmar la mente para poder escuchar la intuición de tu Sol en Cáncer. Tu alma te pide dejar de buscar seguridad en "lo que tienes" (Nodo Sur Tauro) y atreverte a fusionarte, transformarte y confiar en tu poder de resiliencia (Nodo Norte Escorpio). Tienes la capacidad de estructurar sueños (Saturno en Piscis) y comunicarlos al mundo.`
    },
    oly: {
      title: 'Olivia',
      relation: 'Hermana',
      content: `1. La "Tríada de Personalidad" (Quién eres)
El Sol en Capricornio (Casa 6/7): La Gerente del Universo. Tu esencia consciente es de tierra cardinal. Eres una mujer con una ambición natural y una capacidad innata para soportar responsabilidades que aplastarían a otros. Tu identidad se fortalece cuando logras cosas tangibles, cuando hay orden y cuando sientes que eres útil y productiva. No viniste a "ver qué pasa", viniste a hacer que las cosas pasen con disciplina y estrategia. Eres la roca en la que otros se apoyan.

La Luna en Aries (Casa 9/10): La Guerrera Emocional. Aquí está tu secreto: aunque por fuera pareces controlada y seria (Sol Capricornio), tu mundo emocional es fuego puro. Tienes reacciones instintivas, rápidas y a veces impacientes. Necesitas acción para sentir seguridad; si te sientes triste o vulnerable, tu mecanismo de defensa es hacer algo o enojarte, antes que llorar pasivamente. Tu madre pudo haber sido percibida como una figura fuerte, activa o quizás un poco invasiva, enseñándote a pelear por lo tuyo. En tu intimidad, eres independiente y apasionada.

El Ascendente en Cáncer: La Máscara de la Cuidadora. Esta es la energía que "vistes" ante el mundo. A pesar de tu dureza interna, la gente te percibe inicialmente como alguien dulce, empática, maternal y protectora. Tienes una intuición casi psíquica para leer el ambiente. Tu destino kármico te pide integrar la sensibilidad; tu reto es que esa "cáscara de cangrejo" no se convierta en una muralla defensiva, sino en un refugio para ti y para los que amas. Nota curiosa: Con Cáncer ascendiendo, la Luna (en Aries) es la regente de tu carta, lo que hace que tu estado de ánimo dirija gran parte de tu vida.

2. Los Planetas Personales (Tus Herramientas)
Mercurio en Capricornio: El Arquitecto Mental. Tu mente no divaga; planifica. Tu forma de comunicarte es concreta, realista y a veces un poco seca o reservada. Tienes un don para la logística y la administración. No te gustan las palabras vacías; para ti, lo que se dice se cumple. Eres excelente resolviendo problemas complejos porque quitas la "paja" emocional y vas al grano.

Venus en Sagitario: La Amante Aventurera. Aquí hay un contraste interesante. Mientras eres seria en la vida (Capricornio), en el amor y el deseo buscas libertad, expansión y verdad. Te aburren las relaciones demasiado convencionales o pegajosas. Valoras a una pareja que sea tu maestro, tu compañero de viaje y que te haga reír. Tu relación con el dinero es optimista; confías en que siempre llegará si te mueves con fe.

Marte en Capricornio: La Voluntad de Acero. Esta es una de las posiciones más poderosas del zodiaco (Marte está "exaltado" aquí). Cuando quieres algo, no necesitas gritar; simplemente diseñas un plan y trabajas incansablemente hasta conseguirlo. Tienes una resistencia envidiable. Tu forma de conquistar no es impulsiva (aunque tu Luna lo quiera), es estratégica. Eres como una maratonista: ganas por resistencia, no solo por velocidad.

3. Los Puntos Kármicos y Evolutivos (El Alma)
Nodos Lunares (Eje Cáncer-Capricornio):

Nodo Sur (Cáncer): Vienes de vidas pasadas (o de una infancia) donde el tema principal fue la dependencia emocional, la familia, el clan y el "cuidar a otros" sacrificando tu propia estructura. Tienes una tendencia innata a quedarte en la zona de confort emocional o a hacer "berrinche" cuando la vida se pone dura.

Nodo Norte (Capricornio): Tu gran misión de vida es madurar. Tu alma te pide convertirte en tu propia autoridad, salir del nido y construir un legado profesional o público. Debes dejar de ser la "niña" o la "madre sufrida" para convertirte en la "Jefa" de tu propia existencia. El éxito público y la autosuficiencia son tu camino al dharma.

Quirón en Leo: La Herida de la Visibilidad. Tu dolor profundo reside en el reconocimiento. Quizás en algún momento sentiste que no podías brillar, que tu creatividad no era válida o que si te mostrabas demasiado eras rechazada. Tu sanación llega cuando te permites jugar y crear sin buscar aplausos, y curiosamente, cuando ayudas a otros a descubrir su propio talento y brillo, sanas el tuyo.

Lilith en Acuario: La Rebelde Social. Tu sombra reside en los grupos. Puedes sentirte una "outsider" o que no encajas en las normas de tus círculos de amigos o sociedad. Tienes un deseo reprimido de romper las reglas y ser radicalmente libre, pero a veces te da miedo ser excluida "de la manada". Tu poder está en aceptar tu rareza y tu visión futurista sin pedir permiso.

Saturno en Acuario: El Maestro de la Innovación. Saturno es tu regente (por ser Capricornio), así que es muy importante. En Acuario, te exige responsabilidad social. Tus lecciones más duras vendrán a través de amigos o grupos, enseñándote a poner límites y a entender que para construir un futuro mejor, se requiere disciplina mental y colaboración, no solo esfuerzo individual.

4. Los Planetas Sociales y Transpersonales (El Contexto)
Júpiter en Virgo: Tú no encuentras la suerte en los grandes golpes de azar, sino en el orden, el servicio y el detalle. Tu expansión se da cuando perfeccionas tus habilidades, cuidas tu salud y organizas tu rutina. Eres una "suertuda" cuando trabajas duro y mejoras los procesos.

Urano, Neptuno y Plutón: Perteneces a la generación que tiene la conjunción Urano-Neptuno en Capricornio. Esto te hace una "revolucionaria del sistema". Tu generación vino a disolver (Neptuno) las viejas estructuras (Capricornio) para reinventarlas (Urano). Con Plutón en Escorpio, posees una intensidad psicológica profunda; sabes que la única forma de cambiar es muriendo y renaciendo. No le temes a la oscuridad del alma humana.

5. Las Casas Astrológicas (El Escenario)
Observo una gran concentración de energía (Stellium) en las zonas de Tierra y Fuego y específicamente en el cuadrante de "El Otro" y "Lo Público".

Casa 6 y 7 (El Trabajo y la Pareja): Gran parte de tu energía vital (Sol, Mercurio, Marte, Nodo Norte) se vuelca hacia el servicio, la rutina diaria, la salud y las relaciones formales. Tu identidad se define mucho por lo que haces día a día y con quién te asocias. Eres una compañera leal pero exigente.

Casa 10 (Medio Cielo - Profesión): Con tu Luna en Aries cerca de la cúspide de la casa 9/10, necesitas una carrera que te apasione, donde tengas autonomía y puedas liderar. No sirves para estar estática o subordinada sin voz.

Resumen para Olivia
Eres una mujer con una estructura de acero (Capricornio) recubierta de terciopelo (Cáncer), impulsada por un motor de combustión interna (Aries).

Tu gran reto en esta vida es equilibrar tu inmensa necesidad de logro profesional y éxito externo (Tu Sol y Nodo Norte) con tu profunda sensibilidad y necesidad de refugio emocional (Tu Ascendente y Nodo Sur). No endurezcas tanto tu corazón en el proceso de llegar a la cima; recuerda que tu intuición es tan poderosa como tu lógica. Viniste a ser una líder que cuida, una jefa con corazón.`
    },
    isa: {
      title: 'Isamar',
      relation: 'Cuñada',
      content: `1. La "Tríada de Personalidad" (Quién eres)
El Sol: Virgo (Tu esencia e identidad consciente) Tú eres una alquimista de la realidad. Tu energía vital se enciende cuando puedes poner orden en el caos. Eres observadora, analítica y tienes un don natural para ver los detalles que otros ignoran. Tu propósito consciente es el servicio y la mejora continua. No te conformas con lo "bueno"; buscas lo óptimo. Tu luz brilla cuando te sientes útil y eficiente. Sin embargo, tu gran reto es silenciar a tu crítica interna; a veces eres demasiado dura contigo misma buscando una perfección que no existe. Vienes a aprender que tú ya eres suficiente tal como eres, no por lo que haces.

La Luna: Aries (Tu mundo emocional) (Nota: La Luna entró en Aries en la madrugada de tu nacimiento. Salvo que hayas nacido muy temprano en la madrugada —antes de la 1:40 AM—, tu Luna es Aries. Si naciste antes, sería Piscis. Asumiremos Aries por ser la mayor probabilidad). Aunque tu Sol en Virgo es reservado y prudente, tu corazón es guerrero. Emocionalmente, necesitas acción, inmediatez y honestidad brutal. Cuando te sientes herida o insegura, tu reacción instintiva es defenderte o atacar; no te gusta mostrarte vulnerable. Necesitas independencia emocional; nada te asfixia más que sentir que dependen demasiado de ti o que te controlan. Tu madre pudo haber sido percibida como una figura fuerte, enérgica o quizás hubo situaciones de conflicto que te obligaron a ser valiente desde niña. Tu seguridad radica en sentir: "Yo puedo sola".

El Ascendente: Desconocido Al no tener la hora, este punto es el gran misterio de tu mapa. El Ascendente dictaría tu destino externo y tu apariencia física. Sin él, nos enfocaremos en tu psicología interna, que es igual de potente.

2. Los Planetas Personales (Tus Herramientas)
Mercurio: Libra (Tu intelecto y comunicación) Tu mente busca, ante todo, el equilibrio. Tienes el don de la diplomacia; sabes ver las dos caras de la moneda antes de emitir un juicio. Tu forma de hablar es encantadora, justa y conciliadora. Detestas el conflicto verbal y a veces puedes caer en la indecisión por miedo a romper la armonía o a ser "injusta". Tu inteligencia es estética y relacional; piensas mejor cuando puedes rebotar ideas con otra persona.

Venus: Leo (Tu deseo, valores y forma de amar) Aquí hay fuego. Aunque seas una Virgo modesta, en el amor necesitas ser la reina. Amas con generosidad, lealtad y dramatismo. Quieres que te admiren, que te presuman y sentirte única para tu pareja. Tienes un corazón noble y cálido. En cuanto al dinero, te gusta gastarlo en cosas que te den estatus o que te hagan brillar; no te gusta la tacañería. Tu lenguaje del amor es el reconocimiento y los gestos grandiosos.

Marte: Libra (Tu motor de acción) Esta es una posición compleja. Marte es el dios de la guerra, pero en Libra está en territorio de paz. Te cuesta luchar por lo que quieres de forma directa o agresiva. Tu estrategia es el encanto o la negociación. A veces, puedes acumular frustración y volverte pasivo-agresiva porque no quieres "caer mal". Tu gran aprendizaje aquí es entender que el conflicto es necesario a veces y que defender tu postura no te hace "mala persona". Te mueves mejor cuando trabajas en equipo que sola.

3. Los Puntos Kármicos y Evolutivos (El Alma)
Los Nodos Lunares: El eje del Conocimiento

Nodo Sur (Tu pasado kármico): Géminis. Vienes de vidas (o de una infancia) donde fuiste la eterna estudiante, la comunicadora, quizás algo dispersa o superficial. Tienes un talento innato para adaptarte y saber "un poco de todo", pero corres el riesgo de quedarte en la duda eterna o en el chisme mental.

Nodo Norte (Tu misión de vida): Sagitario. Tu alma clama por verdad, expansión y fe. Tu misión es dejar de dudar y empezar a creer. Debes convertirte en maestra, guía o filósofa de tu propia vida. Se te pide que viajes (física o mentalmente), que busques un sentido superior y que confíes en tu intuición más que en la lógica fría.

Quirón: Virgo (Tu herida sanadora) Esta posición es muy fuerte porque está en el mismo signo que tu Sol. Tienes una herida de imperfección. Es probable que sientas, muy en el fondo, que hay algo "roto" o "desordenado" en ti que necesitas arreglar obsesivamente (ya sea en tu cuerpo, tu rutina o tu trabajo). Tu don sanador se activa cuando entiendes que el caos es parte de la vida y ayudas a otros a organizarse o sanar, no desde la crítica, sino desde la compasión de saber lo difícil que es ser humano. Eres una sanadora nata.

Lilith (Luna Negra): Aries (Tu sombra y rebeldía) Aquí reside tu furia reprimida. Hay una parte de ti salvaje que no tolera que le digan qué hacer. Lilith en Aries te da un instinto sexual y vital muy potente, pero también puede traerte conflictos si sientes que alguien intenta domar tu voluntad. Tu sombra es el estallido de ira cuando sientes que te han faltado al respeto.

Saturno: Acuario (Tu maestro severo) Tu karma y responsabilidad están ligados a los grupos, las amistades y el futuro. Quizás sientas miedo a no encajar o a ser excluida de la "tribu". Saturno aquí te pide que estructures tus ideales: no basta con tener sueños humanitarios o rebeldes, debes trabajar duro para materializarlos en sociedad. La disciplina mental y el desapego son tus lecciones.

4. Los Planetas Sociales y Transpersonales (El Contexto)
Júpiter: Libra Tu gran benefactor está en el signo de las relaciones. Tu suerte llega a través de los otros. Las asociaciones, el matrimonio y los contratos son fuentes de expansión para ti. Tienes una protección natural en temas legales y un sentido innato de justicia divina.

Urano, Neptuno y Plutón (La Generación) Perteneces a la generación de los "constructores de nuevas realidades". Con Urano y Neptuno en Capricornio, eres parte del grupo que vino a disolver las viejas estructuras corporativas y políticas para soñar con otras más espirituales pero prácticas. Con Plutón en Escorpio, posees una intensidad emocional generacional; tienes la capacidad de transformarte y renacer de tus cenizas, con una psique naturalmente inclinada a investigar lo oculto y tabú.

5. Las Casas Astrológicas (El Escenario)
Debido a la falta de hora de nacimiento, no podemos definir las casas (áreas de la vida) con exactitud. Sin embargo, podemos ver dónde se concentra tu energía por signos:

El Stellium en Libra (Mercurio, Marte y Júpiter) Independientemente de la casa donde caiga, esta es la zona más cargada de tu vida. Tienes tres planetas importantes en el signo del "Tú". Esto significa que tu vida gira en torno a las relaciones. Aprendes quién eres a través del espejo del otro.

El Reto: Puedes tender a la codependencia o a perder tu identidad (Sol en Virgo) por complacer a la pareja o socios (Energía Libra).

La Solución: Usar tu Luna y Lilith en Aries. Ellas son tu ancla de individualidad. Debes aprender a relacionarte desde la autonomía ("Te elijo, no te necesito"), equilibrando tu inmenso deseo de armonía con tu fuego interior que pide ser libre.

Resumen para Isamar: Eres una mujer con una mente brillante y detallista (Virgo) y un corazón de fuego impaciente (Aries). Tu alma vino a trabajar el equilibrio entre el servicio a los demás y la afirmación de tu propio deseo. Tienes una herida relacionada con la exigencia, pero vienes a sanarla expandiendo tu mente hacia verdades más espirituales (Sagitario). Tu gran maestría está en las relaciones humanas: aprender a ser justa sin dejar de ser tú misma.`
    },
    papa: {
      title: 'Francisco',
      relation: 'Papá',
      content: `1. La "Tríada de Personalidad" (Quién eres)
Esta sección define tu estructura básica. Al no tener la hora, nos centraremos en las dos luminarias (Sol y Luna), que en tu caso, presentan una configuración fascinante y poco común.

El Sol en PISCIS (Tu esencia e identidad consciente) Francisco, eres un alma vieja. Al nacer bajo el signo de Piscis, el último del zodiaco, tu esencia es la de la disolución de los límites. Eres una persona naturalmente empática, intuitiva y con una sensibilidad que a veces puede resultarte abrumadora. Tu identidad no se basa en el ego o en el "yo quiero", sino en el "yo siento". Tienes una capacidad innata para comprender el dolor ajeno y una conexión espiritual profunda, aunque no seas religioso de forma tradicional. Eres el soñador, el artista o el sanador oculto.

La Luna en PISCIS (Tu mundo emocional) Aquí reside una intensidad tremenda. Tienes lo que llamamos una "Doble Firma de Agua" (Sol y Luna en el mismo signo). Tu mundo emocional es un océano vasto y profundo. Necesitas momentos de soledad y aislamiento para recargar energías, ya que funcionas como una "esponja psíquica", absorbiendo las emociones del ambiente que te rodea. Tu madre pudo haber sido percibida por ti como una figura sacrificada, muy sensible o quizás emocionalmente invasiva. Tu seguridad radica en sentirte conectado con el todo; la lógica fría no te consuela, solo el entendimiento silencioso y la compasión te dan paz.

El Ascendente (La fachada y el destino) Dato no disponible por falta de hora de nacimiento. (Nota: El Ascendente es la máscara que usas. Sin él, vemos tu alma desnuda (Sol/Luna) pero no sabemos exactamente qué "traje" te pones para salir al mundo).

2. Los Planetas Personales (Tus Herramientas)
Aquí analizamos cómo procesas la información, cómo amas y cómo actúas.

Mercurio en ACUARIO (Tu intelecto y comunicación) Aquí hay un contraste brillante. Mientras tu corazón es agua pura (Piscis), tu mente es eléctrica y aireada. Piensas de manera futurista, progresista y, a veces, radical. Tienes una inteligencia rápida e intuitiva. Aunque eres muy emocional, cuando se trata de analizar datos o ideas, puedes ser sorprendentemente desapegado y objetivo. Tienes ideas originales y probablemente siempre te has sentido mentalmente diferente a las personas de tu generación o entorno en Galeana.

Venus en CAPRICORNIO (Tu deseo y valores) En el amor y las finanzas, no juegas. Venus en Capricornio busca estructura, compromiso y longevidad. Aunque eres un romántico pisciano, en la práctica valoras a las parejas que te aportan estabilidad, estatus o seguridad. Eres cauto con el dinero y expresas tu afecto a través del deber cumplido, la responsabilidad y el cuidado práctico más que con palabras dulces. Buscas relaciones maduras que resistan el paso del tiempo.

Marte en ARIES (Tu motor de acción) Este es uno de los puntos más fuertes de tu carta. Marte está en su domicilio (su casa). Esto te da un motor de arranque potente. A pesar de tu naturaleza sensible (Piscis), cuando decides actuar, eres directo, valiente y tienes mucha iniciativa. Tienes un "guerrero" dentro que sale a la luz cuando es necesario defenderte o iniciar un proyecto. Esta posición compensa la pasividad de Piscis; eres un soñador, sí, pero un soñador con la espada en la mano para abrirse camino.

3. Los Puntos Kármicos y Evolutivos (El Alma)
Esta es la parte más densa de tu lectura, donde vemos qué vienes a aprender en esta encarnación.

Los Nodos Lunares (Eje Cáncer - Capricornio)

Nodo Sur en Cáncer (Tu equipaje kármico): En vidas pasadas (o en la primera parte de esta vida), tu alma se refugió en la dependencia familiar, el clan y el rol de "niño" o de protector emocional excesivo. Tiendes a quedarte en lo conocido por miedo a salir al mundo frío. El karma aquí es el apego excesivo al pasado y a la familia.

Nodo Norte en Capricornio (Tu misión de vida): Tu alma clama por madurez. Vienes a convertirte en tu propio padre, a estructurarte, a lograr objetivos profesionales y a asumir autoridad en el mundo exterior sin depender emocionalmente de otros. Tu misión es construir algo sólido y tangible, dejando atrás la hipersensibilidad infantil para convertirte en un pilar de sostén para la sociedad.

Quirón en ACUARIO (La herida sanadora) Tu herida profunda tiene que ver con la pertenencia. Es probable que en algún momento de tu vida te hayas sentido como un "bicho raro", desconectado de los grupos o incomprendido por tus ideales. Tu don sanador surge cuando ayudas a otros a aceptar su individualidad y cuando usas tu visión diferente para contribuir al colectivo. Sanas al conectar con la humanidad sin perder tu esencia única.

Lilith en CÁNCER (La sombra) Hay una rebeldía oculta respecto a las tradiciones familiares o la figura materna. Puede haber un miedo inconsciente a ser "devorado" emocionalmente por la familia, o por el contrario, un deseo reprimido de ser cuidado totalmente. Tu lado salvaje surge cuando sientes que invaden tu nido o tu privacidad íntima.

Saturno en ESCORPIO (El maestro severo) Saturno aquí es intenso. Las lecciones de vida te llegan a través de crisis profundas, pérdidas o temas compartidos (dinero de otros, herencias, sexualidad). Saturno te pide maestría emocional: no dejarte arrastrar por los celos, el control o el miedo a la traición. Vienes a aprender a soltar y a confiar en que puedes renacer después de cualquier crisis. Es la posición del "Ave Fénix".

4. Los Planetas Sociales y Transpersonales (El Contexto)
Júpiter en CÁNCER (La expansión) Júpiter está "exaltado" aquí, lo cual es una bendición magnífica. Tienes una protección natural relacionada con la familia, el hogar y las raíces. Tu suerte viene cuando nutres a otros o cuando conectas con tu intuición. Es una posición que suele prometer una vejez rodeada de afecto o un hogar que se siente como un templo.

La Generación de los 50 (Urano en Cáncer, Neptuno en Libra, Plutón en Leo) Perteneces a una generación que vino a transformar la estructura familiar (Urano en Cáncer) y a buscar la armonía en las relaciones (Neptuno en Libra). Sin embargo, lo más potente es la conjunción de Júpiter y Urano en Cáncer en tu carta. Esto te hace un "liberador del clan". Tienes la capacidad de romper patrones familiares tóxicos de manera repentina y liberar a tu linaje de viejas ataduras emocionales. Plutón en Leo te da una fuerza de voluntad tremenda y un deseo de dejar una huella personal única en el mundo.

5. Las Casas Astrológicas (El Escenario)
Debido a la ausencia de la hora de nacimiento, no podemos determinar qué áreas de la vida (Casas) activan estos planetas.

Sin embargo, podemos observar una gran concentración de energía en el Elemento Agua (Piscis, Cáncer, Escorpio) y en el Elemento Cardinal (Capricornio, Aries, Cáncer).

Interpretación Sintética del Escenario: Aunque no sabemos "dónde" ocurre la acción (Casas), sabemos que tu vida se mueve por impulsos emocionales profundos (Agua) dirigidos hacia la acción y la construcción (Cardinal). No eres alguien que se quede quieto; sientes profundamente y eso te motiva a iniciar cosas. Tu escenario principal es interno: la gestión de tus emociones y la construcción de una estructura sólida (familia, patrimonio o legado profesional) es donde se juega la mayor parte de tu energía vital.

Resumen para Francisco: Eres un guerrero espiritual. Tienes la sensibilidad de un místico (Sol/Luna en Piscis) pero el motor de un conquistador (Marte en Aries) y la ambición de un constructor (Nodo Norte y Venus en Capricornio). Tu gran desafío en esta vida es dejar de ser el "niño sensible" que depende emocionalmente del clan, para convertirte en la "autoridad sabia" que sostiene y estructura, integrando tu gran intuición en el mundo real y práctico.`
    },
    mama: {
      title: 'Olivia',
      relation: 'Mamá',
      content: `1. La "Tríada de Personalidad" (Quién eres)
Esta tríada define tu estructura psicológica base.

El Sol en Capricornio (Tu Esencia): Tú eres la arquitecta de tu propia vida. La energía de Capricornio te dota de una resistencia formidable, ambición y un sentido innato de la responsabilidad. No te interesan los caminos fáciles; tu alma se nutre del ascenso a la montaña, de la gratificación que viene del esfuerzo sostenido. Eres una autoridad natural, alguien que transmite seriedad, competencia y madurez, incluso desde joven. Tu propósito es dejar un legado tangible y estructurado en este mundo.

La Luna en Tauro (Tu Mundo Emocional): Esta es una posición de "exaltación", lo que significa que la Luna está muy cómoda aquí. Necesitas estabilidad, paz y confort material para sentirte segura. Emocionalmente, eres una roca: constante, leal y paciente, aunque puedes caer en la terquedad si te sientes presionada. Tu refugio es lo sensorial: la buena comida, la naturaleza, el tacto y la belleza simple. Para sanar, necesitas conectar con la tierra y asegurar tus recursos materiales; la escasez te genera una ansiedad profunda que debes evitar.

El Ascendente (La Máscara y Destino): Nota: Sin la hora exacta, este punto es incalculable. Sin embargo, dada tu fuerte carga de Tierra (Sol Capricornio, Luna Tauro), es muy probable que el mundo te perciba como una persona sólida, confiable y quizás un poco reservada al principio.

2. Los Planetas Personales (Tus Herramientas)
Aquí vemos cómo procesas la información, amas y actúas.

Mercurio en Capricornio (Tu Intelecto): Tu mente es ejecutiva, lógica y realista. No te pierdes en fantasías; tú quieres hechos y resultados. Tienes una gran capacidad para la concentración y la planificación a largo plazo. Al comunicarte, eres prudente y eliges tus palabras con cuidado. Tu desafío aquí es no volverte demasiado pesimista o rígida en tus juicios; recuerda que a veces la lógica no puede explicarlo todo.

Venus en Sagitario (Tu Deseo y Valores): Aquí hay un contraste interesante con tu naturaleza seria de Capricornio. En el amor y el dinero, buscas aventura, libertad y verdad. Te atraen las personas que pueden enseñarte algo, que tienen una filosofía de vida o que son extranjeras/de otra cultura. No soportas los celos ni las ataduras claustrofóbicas. Valoras la honestidad brutal por encima de la diplomacia "bonita". Gastas dinero en experiencias y conocimientos más que en objetos decorativos.

Marte en Sagitario (Tu Motor de Acción): Actúas movida por ideales y convicciones. Tienes una energía expansiva y entusiasta. Cuando crees en algo, luchas por ello como una cruzada personal. Sin embargo, Marte aquí puede ser un poco disperso; empiezas con mucho fuego pero puedes perder interés si el proyecto se vuelve demasiado rutinario. Tu forma de conquistar es directa, franca y a veces un poco brusca, pero siempre sin malicia.

3. Los Puntos Kármicos y Evolutivos (El Alma)
Esta es la sección más importante para tu crecimiento espiritual.

Nodos Lunares: De Piscis (Sur) a Virgo (Norte):

Nodo Sur (Tu pasado kármico - Piscis): Vienes de vidas donde fuiste muy espiritual, quizás una mística, artista o alguien que se sacrificó demasiado, disolviendo su ego en el de los demás. Traes una tendencia inconsciente al escapismo, a sentirte víctima de las circunstancias o a vivir en el caos/desorden.

Nodo Norte (Tu misión actual - Virgo): Tu alma eligió esta vida para aprender el orden, el servicio práctico, la discriminación y la salud. Tu misión es "bajar el cielo a la tierra". Debes dejar de soñar o evadirte y empezar a organizar tu rutina, cuidar tu cuerpo físico y servir a otros a través de habilidades técnicas o detalladas. Dios está en los detalles para ti en esta encarnación.

Quirón en Acuario (Tu Herida Sanadora): Tu herida profunda tiene que ver con la pertenencia. Es probable que en algún momento de tu vida te hayas sentido como una "extraterrestre", desconectada de los grupos o incomprendida por tus amigos/sociedad. Sientes que no encajas.

El don: Tu sanación llega cuando aceptas tu individualidad radical y usas tu visión única para ayudar a la humanidad o a grupos, sin necesidad de diluirte en ellos. Tienes el don de la innovación social.

Lilith en Cáncer (Tu Sombra): Aquí reside una rebeldía oculta vinculada a la familia, el hogar o la figura materna. Puede haber una herida relacionada con el "nido": quizás sentiste que el rol tradicional de mujer/madre te asfixiaba o viviste dinámicas familiares donde se reprimían las emociones reales. Tu poder salvaje se libera cuando estableces tus propias reglas en el hogar y no permites chantajes emocionales de la familia.

Saturno en Capricornio (Tu Maestro): Saturno está en su propio signo (Domicilio), lo cual es muy poderoso. Eres una "Saturnina" honoraria. El karma aquí es estricto: vienes a aprender sobre autoridad, integridad y tiempo. La vida te pondrá obstáculos y retrasos, no para castigarte, sino para asegurarse de que lo que construyas sea sólido como una roca. Eres la columna vertebral de tu entorno. Tu éxito llega, pero suele llegar en la madurez, después de los 30 o 40 años, y es duradero.

4. Los Planetas Sociales y Transpersonales (El Contexto)
Júpiter en Sagitario (Expansión): ¡Otra posición de Domicilio! Tienes una protección natural increíble. Júpiter es tu ángel de la guarda. Encuentras suerte y expansión a través de la fe, los viajes largos, la educación superior y el optimismo. A pesar de tu seriedad capricorniana, en el fondo tienes una fe inquebrantable en que "todo saldrá bien".

Influencia Generacional (Urano en Leo, Neptuno en Escorpio, Plutón en Virgo): Perteneces a una generación transformadora.

Plutón en Virgo: Tienes una capacidad regenerativa vinculada al trabajo y la salud. Eres parte de la generación que transformó la medicina, la ecología y las condiciones laborales. Tienes un poder obsesivo por perfeccionar las cosas.

Urano en Leo: Tu generación rompió estructuras para expresar su creatividad individual y su "yo" de forma dramática y libre.

5. Las Casas Astrológicas (El Escenario)
Nota: Al no tener la hora, analizamos la concentración de energía por signos (Stelliums) para ver dónde está el foco de tu vida.

Observo dos grandes concentraciones de energía que dominan tu vida:

El Bloque de Tierra (Realidad): Con el Sol, Mercurio, Saturno y Plutón (más la Luna en Tauro) en signos de Tierra, más del 50% de tu energía está enfocada en el mundo material. Tu vida gira en torno a construir seguridad, gestionar recursos, trabajar y estructurar. Eres una realizadora nata.

El Bloque de Fuego (Ideales): Con Venus, Marte y Júpiter en Sagitario, tienes un contrapeso vital. Si fueras solo Tierra, serías una máquina de trabajar. El Fuego te da propósito, filosofía y ganas de vivir.

Resumen para Olivia: Eres una mujer "roble". Tu Sol y Saturno en Capricornio te dan una resistencia envidiable, pero tu Luna en Tauro te pide disfrutar de la vida. Tu gran conflicto interno puede ser la tensión entre el deber (Capricornio) y el deseo de libertad y aventura (Sagitario). Tu gran reto kármico es salir del caos emocional o el victimismo (Nodo Sur Piscis) y abrazar el orden, la rutina y el servicio tangible (Nodo Norte Virgo), todo mientras sanas tu sensación de no pertenencia (Quirón Acuario) aceptando que has venido a ser una autoridad única y diferente.`
    },
    gera: {
      title: 'Gerardo',
      relation: 'Cuñado',
      content: `1. La "Tríada de Personalidad" (Quién eres)
Este es el núcleo de tu ser. La base sobre la que construyes tu identidad.

El Sol en Leo (Casa 11): El Rey Generoso. Tu esencia vital es solar, radiante y creativa. En Leo, el Sol está en su casa ("regencia"), lo que te otorga una dignidad natural y una necesidad vital de brillar. No viniste a pasar desapercibido. Tu identidad se nutre cuando creas, cuando lideras y cuando recibes reconocimiento por tu autenticidad. Al estar en la Casa 11, este brillo no es egoísta; buscas brillar dentro de grupos, comunidades o redes. Eres el líder carismático entre tus amigos o en organizaciones sociales.

La Luna en Piscis (Casa 6): El Alma Mística. Aquí yace tu mundo emocional, y es profundamente sensible. Mientras tu Sol en Leo quiere escenario, tu Luna en Piscis anhela disolverse, soñar y conectar con lo invisible. Tienes una empatía casi psíquica; absorbes las emociones de los demás como una esponja. Tu seguridad emocional no depende de cosas materiales, sino de sentirte conectado espiritualmente o artísticamente. Necesitas momentos de soledad para "limpiar" tu energía.

El Ascendente en Libra: El Diplomático Encantador. Esta es la máscara que presentas al mundo y tu ruta de destino. La gente te percibe como alguien amable, estético, justo y equilibrado. Tu primera reacción ante la vida es buscar la armonía y evitar el conflicto directo. El Ascendente Libra te pide aprender a relacionarte con el "otro" sin perderte a ti mismo. Tu encanto es tu llave maestra para abrir puertas.

2. Los Planetas Personales (Tus Herramientas)
Cómo procesas la información, amas y actúas.

Mercurio en Virgo (Casa 11/12): El Arquitecto Mental. Tienes una de las mejores posiciones para Mercurio. Tu mente es analítica, crítica, detallista y extremadamente lógica. Mientras tu Luna sueña, tu mente aterriza. Eres capaz de ver el error que nadie más ve. Tienes un talento natural para organizar sistemas, la salud o la tecnología. Te comunicas de forma precisa, aunque a veces puedes ser un poco duro contigo mismo o con los demás por buscar la perfección.

Venus en Cáncer/Leo (Cúspide - Grado 2 de Leo): El Amante Leal. (Nota: Venus acababa de entrar en Leo). Tu forma de amar es dramática, cálida y demostrativa. En el amor, necesitas admirar a tu pareja y sentirte admirado (Leo), pero con un trasfondo de protección y clan (influencia de Cáncer cercana). Eres generoso con el dinero; te gustan el lujo y la calidad. En las relaciones, la lealtad es innegociable para ti; ofreces el corazón entero y esperas lo mismo a cambio.

Marte en Tauro (Casa 8): La Fuerza Imparable. Tu motor de acción no es explosivo, es de resistencia. Marte en Tauro es como una aplanadora: tarda en arrancar, pero una vez que toma inercia, nada lo detiene. Eres obstinado y persigues tus metas con paciencia y sentido práctico. Tienes una gran resistencia física y una sensualidad muy marcada y terrenal. No luchas por luchar, luchas para construir algo sólido y duradero.

3. Los Puntos Kármicos y Evolutivos (El Alma)
Aquí entramos en el terreno de tu misión de vida y lo que tu alma viene a sanar.

Los Nodos Lunares (El Eje Leo-Acuario):

Nodo Sur en Leo (Tu pasado): En vidas pasadas o en tu infancia, ya fuiste "el rey", el centro de atención, alguien especial. Traes un talento innato para el liderazgo y la autoexpresión, pero también una tendencia al drama, al orgullo y a necesitar aplausos constantes. Esa es tu zona de confort: "Yo soy el importante".

Nodo Norte en Acuario (Tu misión): Tu evolución depende de dejar de pensar en "mí" para pensar en "nosotros". Tu alma viene a aprender el desapego, la igualdad y la colaboración. Tu misión es usar ese liderazgo de Leo no para que te aplaudan a ti, sino para impulsar causas humanitarias, tecnológicas o grupales. Debes ser un "primus inter pares" (primero entre iguales).

Quirón en Cáncer (Casa 10): La Herida de Pertenencia. Tu herida profunda tiene que ver con la familia, las raíces o la madre. Puede que hayas sentido una desconexión emocional temprana o una sensación de "no tener nido". Al estar en la Casa 10 (la vida pública), intentas compensar esa inseguridad emocional buscando éxito profesional o estatus. Tu sanación (tu don) llega cuando te conviertes en el "padre/madre" protector de otros, creando espacios seguros para los demás, quizás en tu entorno laboral.

Lilith en Sagitario: La Rebeldía de la Verdad. Tu sombra se manifiesta en tus creencias. No soportas los dogmas impuestos ni que te digan qué pensar. Tienes un deseo salvaje de libertad intelectual y de exploración. Puedes tener miedo a ser "enjaulado" por ideologías o filosofías restrictivas. Tu lado reprimido es el del "gurú rebelde" que desafía la moral establecida.

Saturno en Capricornio (Casa 4): El Maestro Constructor. Saturno está en su casa (Domicilio), lo que es muy poderoso. Sugiere una infancia con responsabilidades tempranas o un entorno familiar estricto/exigente. Sientes una carga kármica con respecto al hogar y las bases de tu vida. Tu lección es construir tu propia estructura interna y tu propia seguridad, sin depender de la estructura heredada de tus padres. Eres el arquitecto de tu propio refugio; la madurez te llegará construyendo cimientos sólidos (bienes raíces, hogar propio).

4. Los Planetas Sociales y Transpersonales (El Contexto)
Júpiter en Cáncer (Exaltado): Tienes una protección "divina" en temas de familia, bienes raíces y vida emocional. Júpiter aquí expande tu intuición y te da suerte cuando actúas desde la nutrición y el cuidado. Es una posición de "ángel guardián".

Generación Capricornio/Escorpio:

Con Urano y Neptuno en Capricornio, formas parte de la generación que vino a disolver las viejas estructuras de poder político y económico para crear nuevas realidades empresariales más espirituales o tecnológicas.

Con Plutón en Escorpio, posees una intensidad regenerativa brutal. Tu generación entiende que para transformar algo, a veces hay que destruirlo primero. Tienes una capacidad innata para la psicología profunda y la gestión de crisis.

5. Las Casas Astrológicas (El Escenario)
Énfasis en Casa 11 (Amigos, Grupos y Futuro): Con el Sol y posiblemente Venus/Mercurio activando esta zona, tu mayor éxito vendrá a través del networking, la tecnología o los proyectos comunitarios. No eres un lobo solitario; eres un catalizador social.

Casa 6 (Trabajo y Salud) con la Luna: Tu trabajo diario debe tener "alma". Si trabajas en algo frío o puramente mecánico, tu salud emocional sufrirá (somatización). Necesitas servir a otros o sentir que tu labor diaria ayuda a sanar o mejorar la vida de alguien.

Eje Casa 4 (Hogar) / Casa 10 (Éxito): Con Saturno en la 4 y Júpiter/Quirón influenciando la 10, hay una tensión constante entre tus deberes familiares/privados y tu ambición pública. El éxito profesional es probable (Quirón y Júpiter arriba), pero no debe ser a costa de tu estabilidad interna (Saturno abajo).

Resumen para Gerardo: Eres un líder carismático (Sol Leo) con un corazón de sanador (Luna Piscis) y una mente de ingeniero (Mercurio Virgo). Tu gran reto en esta vida es dejar de buscar validación personal para ti mismo y empezar a usar tu enorme talento y brillo para elevar a tu comunidad o equipo (Nodo Norte Acuario). Tienes la fuerza de voluntad para construir un imperio (Marte Tauro/Saturno Cap), pero solo serás feliz si ese imperio tiene un propósito humano y trascendente.`
    }
  }

  const currentContent = familyContent[activeTab]

  return (
    <div className="familia-screen">
      {/* Header with back button */}
      <div className="familia-screen-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft />
          <span>Volver</span>
        </button>
        <div className="familia-screen-title">
          <h2 className="title-section">Familia</h2>
          <p className="subtitle">Cartas Natales Familiares</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="familia-screen-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`family-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="familia-screen-content">
        <div className="container">
          <div className="glass-card">
            <div className="family-header mb-4">
              <h3 className="title-card accent-cyan">{currentContent.title}</h3>
              <p className="subtitle">{currentContent.relation}</p>
            </div>
            <div className="family-text">
              {currentContent.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="body-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const [showCover, setShowCover] = useState(true)
  const [activeSection, setActiveSection] = useState('inicio')
  const [currentScreen, setCurrentScreen] = useState('main')

  useEffect(() => {
    if (!unlocked || currentScreen !== 'main') return

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
  }, [unlocked, currentScreen])

  const handleFamiliaClick = () => {
    if (currentScreen === 'familia') {
      setCurrentScreen('main')
    } else {
      setCurrentScreen('familia')
      window.scrollTo(0, 0)
    }
  }

  if (!unlocked) {
    return (
      <>
        <CosmicBackground />
        <PinDialog onSuccess={() => setUnlocked(true)} />
      </>
    )
  }

  if (showCover) {
    return (
      <CoverScreen onEnter={() => {
        setShowCover(false)
        window.scrollTo(0, 0)
      }} />
    )
  }

  if (currentScreen === 'familia') {
    return (
      <div className="min-h-screen">
        <CosmicBackground />
        <Navigation
          activeSection={activeSection}
          onFamiliaClick={handleFamiliaClick}
          currentScreen={currentScreen}
        />
        <FamiliaScreen onBack={() => setCurrentScreen('main')} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <CosmicBackground />
      <Navigation
        activeSection={activeSection}
        onFamiliaClick={handleFamiliaClick}
        currentScreen={currentScreen}
      />

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
