import hombreBlanca from '../assets/products/hombre-blanca.jpeg';
import hombreNegra from '../assets/products/hombre-negra.jpeg';
import hombreRoja from '../assets/products/hombre-roja.jpeg';
import hombreCamel from '../assets/products/hombre-camel.jpeg';
import hombreOlivo from '../assets/products/hombre-olivo.jpeg';
import hombrePalm from '../assets/products/hombre-palm.jpeg';
import hombreUsa from '../assets/products/hombre-usa.jpeg';
import hombreCupido from '../assets/products/hombre-cupido.jpeg';
import hombreFloralGold from '../assets/products/hombre-floral-gold.jpeg';
import hombreRosario from '../assets/products/hombre-rosario.jpeg';
import hombreCvltRojo from '../assets/products/hombre-cvlt-rojo.jpeg';
import hombreCvltNegro from '../assets/products/hombre-cvlt-negro.jpeg';
import hombreOnesBlanco from '../assets/products/hombre-ones-blanco.jpeg';
import hombreOnesNegro from '../assets/products/hombre-ones-negro.jpeg';
import hombreMotivation from '../assets/products/hombre-motivation.jpeg';
import hombreLegends from '../assets/products/hombre-legends.jpeg';
import hombreCeleste from '../assets/products/hombre-celeste.jpeg';
import hombreDusk from '../assets/products/hombre-dusk.jpeg';
import conjuntoClNegro from '../assets/products/conjunto-cl-negro.jpeg';
import conjuntoScriptNegro from '../assets/products/conjunto-script-negro.jpeg';
import mujerCrema from '../assets/products/mujer-crema.jpeg';
import mujerRoja from '../assets/products/mujer-roja.jpeg';
import mujerTerracota from '../assets/products/mujer-terracota.jpeg';
import mujerNegra from '../assets/products/mujer-negra.jpeg';
import mujerVerde from '../assets/products/mujer-verde.jpeg';
import mujerLima from '../assets/products/mujer-lima.jpeg';

export const CATEGORIES = ['Hombre', 'Mujer', 'Conjuntos'];

const TALLAS_CAMISETA = ['S', 'M', 'L', 'XL'];
const TALLAS_CROP = ['XS', 'S', 'M', 'L'];

export const PRODUCTS = [
  {
    id: 'classic-c',
    name: 'Playera Classic C',
    category: 'Hombre',
    price: 32,
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
    name: 'Playera Rosario',
    category: 'Hombre',
    price: 34,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreRosario }],
  },
  {
    id: 'calm-sun',
    name: 'Playera Calm Under The Sun',
    category: 'Hombre',
    price: 38,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombrePalm }],
  },
  {
    id: 'join-cvlt',
    name: 'Playera Join The Cvlt',
    category: 'Hombre',
    price: 38,
    sizes: TALLAS_CAMISETA,
    variants: [
      { color: 'Rojo', hex: '#b91c1c', img: hombreCvltRojo },
      { color: 'Negro', hex: '#18181b', img: hombreCvltNegro },
    ],
  },
  {
    id: 'floral-gold',
    name: 'Playera Floral Gold',
    category: 'Hombre',
    price: 35,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Camel', hex: '#b08d57', img: hombreFloralGold }],
  },
  {
    id: 'join-ones',
    name: 'Playera Join The Ones',
    category: 'Hombre',
    price: 36,
    sizes: TALLAS_CAMISETA,
    variants: [
      { color: 'Blanco', hex: '#f5f5f4', img: hombreOnesBlanco },
      { color: 'Negro', hex: '#18181b', img: hombreOnesNegro },
    ],
  },
  {
    id: 'motivation',
    name: 'Playera Motivation Shine',
    category: 'Hombre',
    price: 36,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreMotivation }],
  },
  {
    id: 'legends',
    name: 'Playera Legends',
    category: 'Hombre',
    price: 36,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreLegends }],
  },
  {
    id: 'celeste',
    name: 'Playera Join The Class Celeste',
    category: 'Hombre',
    price: 32,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Celeste', hex: '#93c5fd', img: hombreCeleste }],
  },
  {
    id: 'usa',
    name: 'Playera United States',
    category: 'Hombre',
    price: 38,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreUsa }],
  },
  {
    id: 'cupido',
    name: 'Playera Cupido',
    category: 'Hombre',
    price: 38,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreCupido }],
  },
  {
    id: 'dusk-shade',
    name: 'Playera Dusk Shade',
    category: 'Hombre',
    price: 36,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: hombreDusk }],
  },
  {
    id: 'conjunto-cl',
    name: 'Conjunto CL Print',
    category: 'Conjuntos',
    price: 58,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: conjuntoClNegro }],
  },
  {
    id: 'conjunto-script',
    name: 'Conjunto Join The Class Script',
    category: 'Conjuntos',
    price: 58,
    sizes: TALLAS_CAMISETA,
    variants: [{ color: 'Negro', hex: '#18181b', img: conjuntoScriptNegro }],
  },
  {
    id: 'crop-rosas',
    name: 'Crop Top Rosas',
    category: 'Mujer',
    price: 28,
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
