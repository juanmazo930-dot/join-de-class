import hombreBlanca from '../assets/products/hombre-blanca.webp';
import hombreNegra from '../assets/products/hombre-negra.webp';
import hombreRoja from '../assets/products/hombre-roja.webp';
import hombreCamel from '../assets/products/hombre-camel.webp';
import hombreOlivo from '../assets/products/hombre-olivo.webp';
import hombrePalm from '../assets/products/hombre-palm.webp';
import hombrePalmBack from '../assets/products/hombre-palm-back.webp';
import hombreUsa from '../assets/products/hombre-usa.webp';
import hombreUsaBack from '../assets/products/hombre-usa-back.webp';
import hombreCupido from '../assets/products/hombre-cupido.webp';
import hombreCupidoBack from '../assets/products/hombre-cupido-back.webp';
import hombreFloralGold from '../assets/products/hombre-floral-gold.webp';
import hombreFloralGoldBack from '../assets/products/hombre-floral-gold-back.webp';
import hombreRosario from '../assets/products/hombre-rosario.webp';
import hombreRosarioBack from '../assets/products/hombre-rosario-back.webp';
import hombreCvltRojo from '../assets/products/hombre-cvlt-rojo.webp';
import hombreCvltRojoBack from '../assets/products/hombre-cvlt-rojo-back.webp';
import hombreCvltNegro from '../assets/products/hombre-cvlt-negro.webp';
import hombreCvltNegroBack from '../assets/products/hombre-cvlt-negro-back.webp';
import hombreOnesBlanco from '../assets/products/hombre-ones-blanco.webp';
import hombreOnesNegro from '../assets/products/hombre-ones-negro.webp';
import hombreMotivation from '../assets/products/hombre-motivation.webp';
import hombreMotivationBack from '../assets/products/hombre-motivation-back.webp';
import hombreLegends from '../assets/products/hombre-legends.webp';
import hombreLegendsBack from '../assets/products/hombre-legends-back.webp';
import hombreCeleste from '../assets/products/hombre-celeste.webp';
import hombreDusk from '../assets/products/hombre-dusk.webp';
import hombreDuskBack from '../assets/products/hombre-dusk-back.webp';
import conjuntoClNegro from '../assets/products/conjunto-cl-negro.webp';
import conjuntoScriptNegro from '../assets/products/conjunto-script-negro.webp';
import mujerCrema from '../assets/products/mujer-crema.webp';
import mujerRoja from '../assets/products/mujer-roja.webp';
import mujerTerracota from '../assets/products/mujer-terracota.webp';
import mujerNegra from '../assets/products/mujer-negra.webp';
import mujerVerde from '../assets/products/mujer-verde.webp';
import mujerLima from '../assets/products/mujer-lima.webp';

export const CATEGORIES = ['Hombre', 'Mujer', 'Conjuntos'];

const TALLAS_CAMISETA = ['S', 'M', 'L', 'XL'];
const TALLAS_CROP = ['XS', 'S', 'M', 'L'];

export const PRODUCTS = [
  {
    id: 'classic-c',
    name: 'Camiseta Classic C',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [
      { color: 'Blanco', hex: '#f5f5f4', img: hombreBlanca },
      { color: 'Negro', hex: '#18181b', img: hombreNegra },
      { color: 'Rojo', hex: '#b91c1c', img: hombreRoja },
      { color: 'Camel', hex: '#b08d57', img: hombreCamel },
      { color: 'Olivo', hex: '#6b7f3a', img: hombreOlivo },
    ],
  },
  {
    id: 'rosario',
    name: 'Camiseta Rosario',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreRosario, back: hombreRosarioBack }],
  },
  {
    id: 'calm-sun',
    name: 'Camiseta Calm Under The Sun',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombrePalm, back: hombrePalmBack }],
  },
  {
    id: 'join-cvlt',
    name: 'Camiseta Join The Cvlt',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [
      { color: 'Rojo', hex: '#b91c1c', img: hombreCvltRojo, back: hombreCvltRojoBack },
      { color: 'Negro', hex: '#18181b', img: hombreCvltNegro, back: hombreCvltNegroBack },
    ],
  },
  {
    id: 'floral-gold',
    name: 'Camiseta Floral Gold',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Camel', hex: '#b08d57', img: hombreFloralGold, back: hombreFloralGoldBack }],
  },
  {
    id: 'join-ones',
    name: 'Camiseta Join The Ones',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [
      { color: 'Blanco', hex: '#f5f5f4', img: hombreOnesBlanco },
      { color: 'Negro', hex: '#18181b', img: hombreOnesNegro },
    ],
  },
  {
    id: 'motivation',
    name: 'Camiseta Motivation Shine',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreMotivation, back: hombreMotivationBack }],
  },
  {
    id: 'legends',
    name: 'Camiseta Legends',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreLegends, back: hombreLegendsBack }],
  },
  {
    id: 'celeste',
    name: 'Camiseta Join The Class Celeste',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Celeste', hex: '#93c5fd', img: hombreCeleste }],
  },
  {
    id: 'usa',
    name: 'Camiseta United States',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreUsa, back: hombreUsaBack }],
  },
  {
    id: 'cupido',
    name: 'Camiseta Cupido',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreCupido, back: hombreCupidoBack }],
  },
  {
    id: 'dusk-shade',
    name: 'Camiseta Dusk Shade',
    category: 'Hombre',
    type: 'single',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreDusk, back: hombreDuskBack }],
  },
  {
    id: 'conjunto-cl',
    name: 'Conjunto CL Print',
    category: 'Conjuntos',
    type: 'set',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: conjuntoClNegro }],
  },
  {
    id: 'conjunto-script',
    name: 'Conjunto Join The Class Script',
    category: 'Conjuntos',
    type: 'set',
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: conjuntoScriptNegro }],
  },
  {
    id: 'crop-rosas',
    name: 'Crop Top Rosas',
    category: 'Mujer',
    type: 'single',
    sizes: TALLAS_CROP,
    variants: [
      { color: 'Crema', hex: '#efe4cf', img: mujerCrema },
      { color: 'Rojo', hex: '#b91c1c', img: mujerRoja },
      { color: 'Terracota', hex: '#c1694f', img: mujerTerracota },
      { color: 'Negro', hex: '#18181b', img: mujerNegra },
      { color: 'Verde', hex: '#0f9960', img: mujerVerde },
      { color: 'Lima', hex: '#a3d92b', img: mujerLima },
    ],
  },
];
