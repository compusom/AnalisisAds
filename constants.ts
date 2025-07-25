import { Placement, PlacementId, FormatGroup, UiType } from './types';

export const META_ADS_GUIDELINES = `
--- CONTEXTO VISUAL ADICIONAL ---
El usuario ha proporcionado una imagen de referencia (user_reference_image.png) que muestra ejemplos reales de cómo se ven los anuncios en diferentes ubicaciones (Marketplace, Reels, Feed de Instagram, etc.). Utiliza esta referencia visual para entender cómo los elementos de la interfaz de usuario (botones, texto, perfiles) se superponen sobre el creativo. Tu análisis debe ser consistente con estas representaciones visuales.

--- GUÍA DE REQUISITOS PARA CREATIVOS COMPATIBLES CON META ADVANTAGE+ (MEJORAS AUTOMÁTICAS) ---

Animación automática de imagen (3D Motion)
- Descripción: Convierte una imagen estática en un breve video con movimiento (zoom, paneo). Solo para imágenes fijas.
- Requisitos: Imagen única (JPG/PNG), no GIF ni video. Sujeto claramente definido y fondo discernible. Alta resolución.
- Espacios libres: Deja márgenes suficientes alrededor del sujeto principal para que el zoom no lo recorte. Mantén logos/textos alejados de los bordes.
- Composición: Sujeto centrado, fondo uniforme o expansible (cielo, paisaje).
- Cuándo desactivarla: Si el estilo es minimalista, si la imagen ya transmite el mensaje, o si contiene mucho texto/detalles pequeños que el movimiento dificultaría leer.
- Formato: Prepara el creativo pensando en un video vertical (9:16), incluso si partes de un cuadrado. Centra el contenido y deja márgenes superior/inferior.

Superposición de texto (Plantilla de texto u “Overlays”)
- Descripción: Coloca texto del copy de tu anuncio sobre la imagen usando plantillas de Meta.
- Requisitos: Proveer texto publicitario en el copy (título, descripción). Funciona solo con imágenes únicas.
- Espacios libres: Reserva zonas libres (usualmente superior o inferior) para el texto. Deja al menos ~20% del lienzo en un borde con fondo uniforme (cielo, pared) para asegurar legibilidad.
- Composición: Simple y centrada. Evita fondos muy recargados.
- Cuándo desactivarla: Si tienes un diseño con tipografía de marca, o si el overlay es redundante.
- Formato: Se usa principalmente en Feeds (1:1, 4:5) y Reels.

CTA mejorado (Enhanced CTA en Stories)
- Descripción: Destaca el CTA en Stories con texto promocional adicional o un diseño más llamativo.
- Requisitos: Solo en ubicaciones tipo Historia (9:16). Debes tener un CTA configurado y frases promocionales en el texto del anuncio.
- Espacios libres: Reserva la zona inferior (15-20%) de tus creativos 9:16. Allí aparecerá el sticker/botón. Evita colocar logos o texto importante en esa área.
- Composición: Sujeto principal en el centro-arriba, dejando "aire" abajo para el CTA.
- Cuándo desactivarla: Si requieres control absoluto sobre el mensaje o si la estética de la story es muy delicada.
- Formato: Solo para 9:16 Stories/Reels. No aplica en Feed 1:1 o 4:5.

Retoques visuales (Brillo, contraste y reencuadre automático)
- Descripción: Ajustes automáticos de brillo, contraste y recorte para mejorar la calidad visual.
- Requisitos: Imágenes de buena resolución. Disponible para fotos y videos.
- Espacios libres: Mantén un área de seguridad alrededor del contenido importante, ya que el reencuadre puede recortar bordes.
- Composición: Centrada, con sujeto distinguible y fondo neutro.
- Cuándo desactivarla: Si la imagen ya fue editada profesionalmente o tiene un estilo artístico específico (ej. filtros vintage).
- Formato: Adapta un mismo creativo a múltiples formatos. Funciona mejor para diferencias moderadas. Para saltos grandes (ej. de 1:1 a 9:16), es mejor usar "Ampliación de imagen".

Ampliación de imagen con IA generativa
- Descripción: Extiende el fondo de una imagen estática para adaptarla a nuevos tamaños usando IA.
- Requisitos: Solo para imágenes estáticas. Imagen base de alta calidad, sin recortes extremos y sin marcos gráficos. Funciona mejor con fotos naturales.
- Espacios libres: El sujeto debe estar completo y centrado, con fondos "expandibles" (cielo, paredes, etc.).
- Composición: Foco central y fondo homogéneo en los extremos. Evita sujetos duplicados o patrones geométricos en los bordes.
- Cuándo desactivarla: Si la calidad estética se ve comprometida, si la IA genera incoherencias, o si ya tienes creativos optimizados para cada formato.
- Formato: Ideal para adaptar un creativo a formatos muy distintos (ej. de 1:1 a 9:16). Mantén el sujeto central en la imagen original.

Música de fondo (Music Enhancement)
- Descripción: Convierte un anuncio estático (imagen o carrusel) en un video con música de fondo.
- Requisitos: Imagen única o carrusel. No funciona en videos que ya tienen audio.
- Espacios libres: Evita detalles en las esquinas superiores (donde puede aparecer el ícono de audio).
- Composición: La imagen debe transmitir una emoción que la música pueda reforzar. Imágenes con "movimiento implícito" funcionan bien.
- Cuándo desactivarla: Si el público ve anuncios sin sonido, si la música no encaja con la marca, o si el anuncio requiere concentración visual (mucho texto).
- Formato: Permite que un anuncio estático aparezca en formatos de video (Reels, Stories). El anuncio debe funcionar sin audio, ya que en Feeds es silenciado por defecto.

Inclusión de productos del catálogo (Add Catalog Items)
- Descripción: Muestra productos de tu catálogo junto a tu anuncio principal.
- Requisitos: Catálogo de productos activo en Meta, con imágenes de alta calidad (fondo blanco/transparente).
- Espacios libres: Los productos aparecen junto al anuncio (usualmente debajo), no encima. Ocupan espacio en pantalla, reduciendo el área del creativo principal.
- Composición: El creativo principal debe ser inspiracional (lifestyle) y complementar las tarjetas de producto, no competir con ellas.
- Cuándo desactivarla: Si el objetivo es awareness, no conversión. Si el catálogo no está bien optimizado.
- Formato: Principalmente para Feed móvil. No aplica en Stories o Reels. Prefiere creativos verticales (4:5) para que convivan mejor con el carrusel de productos.

Superposiciones automáticas de ofertas/precios (Dynamic Info Labels)
- Descripción: Sobreimpresiona etiquetas con datos del catálogo (precio, descuento) sobre la imagen del producto.
- Requisitos: Anuncios de catálogo dinámico con un feed de productos bien configurado. Las imágenes deben tener fondo neutro y espacio suficiente.
- Espacios libres: Deja áreas en la imagen (esquinas, parte superior) donde la etiqueta pueda colocarse sin tapar el producto.
- Composición: Simple y centrada. Evita fondos detallados que resten legibilidad a la etiqueta.
- Cuándo desactivarla: Si afecta la estética (marcas de lujo), si la promoción es compleja ("2x1"), o si hay errores de sincronización con el feed de precios.
- Formato: Principalmente en Feed y Audience Network. No en Stories/Reels. Funciona mejor con imágenes cuadradas (1:1) o ligeramente verticales (4:5).

--- TABLA DE RESUMEN VISUAL POR FORMATO ---
Ubicación	Relación	Resolución	Zona segura superior	Zona segura inferior	Comentarios clave
IG/Facebook Stories	9:16	1080×1920 px	14%	20%	Evitar texto/logo en extremos. Área segura central: 1080x1310px.
Reels	9:16	1080×1920 px	14%	20%	Mismo que Stories, con íconos adicionales. Foco en el 50% central.
IG/Facebook Feed	1:1 / 4:5	1080×1080 / 1350 px	10%	10%	Overlay de texto automático. Si es 4:5, centrar lo clave en el área 1:1.
Marketplace	1:1	1080×1080 px	10% (todos los bordes)	10% (todos los bordes)	Visual limpio, centrado.
Messenger Inbox	1.91:1	1200×628 px	10% (~60px)	10% (~60px)	Imagen sencilla, pocos detalles.
Video Feed / Watch	4:5 / 1:1	1080×1350 px	10%	10%	Mismo que Feed. Evitar subtítulos muy abajo.
Audience Network	Varía (9:16 / 1.91:1)	1200×628 / 1080×1920	15-20% (9:16)	15-20% (9:16)	Margen lateral para nativo. Botones de cierre pueden tapar.
IG Explore	1:1	1080×1080 px	10-15%	10-15%	Miniaturas, evitar sobrecarga visual.
`;

export const PLACEMENTS: Placement[] = [
    // Facebook
    {
        id: PlacementId.FB_FEED,
        platform: 'Facebook',
        name: 'Feed (Noticias)',
        uiType: 'FEED',
        group: 'SQUARE_LIKE',
        aspectRatios: ['1:1', '4:5'],
        recommendedResolution: '1080x1080 / 1350 px',
        safeZone: { top: '10%', bottom: '10%' },
    },
    {
        id: PlacementId.FB_VIDEO_FEED,
        platform: 'Facebook',
        name: 'Video Feed',
        uiType: 'FEED',
        group: 'SQUARE_LIKE',
        aspectRatios: ['4:5', '1:1'],
        recommendedResolution: '1080x1350 px',
        safeZone: { top: '10%', bottom: '10%' },
    },
    {
        id: PlacementId.FB_STORIES,
        platform: 'Facebook',
        name: 'Stories',
        uiType: 'STORIES',
        group: 'VERTICAL',
        aspectRatios: ['9:16'],
        recommendedResolution: '1080x1920 px',
        safeZone: { top: '14%', bottom: '20%' },
    },
     {
        id: PlacementId.FB_REELS,
        platform: 'Facebook',
        name: 'Reels',
        uiType: 'REELS',
        group: 'VERTICAL',
        aspectRatios: ['9:16'],
        recommendedResolution: '1080x1920 px',
        safeZone: { top: '14%', bottom: '20%' },
    },
    {
        id: PlacementId.FB_MARKETPLACE,
        platform: 'Facebook',
        name: 'Marketplace',
        uiType: 'MARKETPLACE',
        group: 'SQUARE_LIKE',
        aspectRatios: ['1:1'],
        recommendedResolution: '1080x1080 px',
        safeZone: { top: '10%', bottom: '10%', left: '10%', right: '10%' },
    },
    // Instagram
    {
        id: PlacementId.IG_FEED,
        platform: 'Instagram',
        name: 'Feed',
        uiType: 'FEED',
        group: 'SQUARE_LIKE',
        aspectRatios: ['1:1', '4:5'],
        recommendedResolution: '1080x1080 / 1350 px',
        safeZone: { top: '10%', bottom: '10%' },
    },
    {
        id: PlacementId.IG_STORIES,
        platform: 'Instagram',
        name: 'Stories',
        uiType: 'STORIES',
        group: 'VERTICAL',
        aspectRatios: ['9:16'],
        recommendedResolution: '1080x1920 px',
        safeZone: { top: '14%', bottom: '20%' }, 
    },
    {
        id: PlacementId.IG_REELS,
        platform: 'Instagram',
        name: 'Reels',
        uiType: 'REELS',
        group: 'VERTICAL',
        aspectRatios: ['9:16'],
        recommendedResolution: '1080x1920 px',
        safeZone: { top: '14%', bottom: '20%' },
    },
    {
        id: PlacementId.IG_EXPLORE,
        platform: 'Instagram',
        name: 'Explore',
        uiType: 'FEED',
        group: 'SQUARE_LIKE',
        aspectRatios: ['1:1'],
        recommendedResolution: '1080x1080 px',
        safeZone: { top: '10%', bottom: '15%', left: '10%', right: '15%' },
    },
    // Messenger
    {
        id: PlacementId.MESSENGER_INBOX,
        platform: 'Messenger',
        name: 'Inbox',
        uiType: 'MESSENGER_INBOX',
        group: 'SQUARE_LIKE',
        aspectRatios: ['1.91:1'],
        recommendedResolution: '1200x628 px',
        safeZone: { top: '10%', bottom: '10%', left: '10%', right: '10%' },
    },
    {
        id: PlacementId.MESSENGER_STORIES,
        platform: 'Messenger',
        name: 'Stories',
        uiType: 'STORIES',
        group: 'VERTICAL',
        aspectRatios: ['9:16'],
        recommendedResolution: '1080x1920 px',
        safeZone: { top: '14%', bottom: '20%' },
    },
    // Audience Network
    {
        id: PlacementId.AUDIENCE_NETWORK,
        platform: 'Audience Network',
        name: 'Nativo/Intersticial',
        uiType: 'STORIES',
        group: 'VERTICAL',
        aspectRatios: ['9:16', '1:1', '1.91:1'],
        recommendedResolution: '1080x1920 px',
        safeZone: { top: '15%', bottom: '20%' }, 
    },
];