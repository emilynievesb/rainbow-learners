import { Injectable, signal } from '@angular/core';

/**
 * Interface Color
 *
 * Define la estructura de datos para representar un color en la aplicación.
 */
export interface Color {
  /** Identificador único del color (usado para trackeo y consultas). */
  id: number;
  /** Nombre en español (puede usarse para futuras localizaciones). */
  name: string;
  /** Nombre en inglés, que se muestra al usuario. */
  english: string;
  /** Ruta al recurso de imagen que representa visualmente el color. */
  image: string;
  /** Ruta al archivo de audio con la pronunciación del color en inglés. */
  audio: string;
  /** Descripción opcional que aporta información adicional sobre el color. */
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  /**
   * _colors
   * Señal privada que almacena el arreglo de colores.
   * - Uso de `signal` para que cualquier componente que consuma esta señal
   *   se actualice automáticamente si los datos cambian.
   * - Inicializa la aplicación con tres colores de ejemplo.
   */
  private _colors = signal<Color[]>([
    {
      id: 1,
      name: 'Rojo',
      english: 'Red',
      image: 'assets/images/red.png',
      audio: 'assets/audio/red.mp3',
      description: 'El rojo es un color apasionado y vibrante.',
    },
    {
      id: 2,
      name: 'Verde',
      english: 'Green',
      image: 'assets/images/green.png',
      audio: 'assets/audio/green.mp3',
      description: 'El verde representa la naturaleza y la tranquilidad.',
    },
    {
      id: 3,
      name: 'Azul',
      english: 'Blue',
      image: 'assets/images/blue.png',
      audio: 'assets/audio/blue.mp3',
      description: 'El azul es un color calmante y refrescante.',
    },
    {
      id: 4,
      name: 'Amarillo',
      english: 'Yellow',
      image: 'assets/images/yellow.png',
      audio: 'assets/audio/yellow.mp3',
      description: 'El amarillo es alegre y lleno de energía.',
    },
    {
      id: 5,
      name: 'Naranja',
      english: 'Orange',
      image: 'assets/images/orange.png',
      audio: 'assets/audio/orange.mp3',
      description:
        'El naranja combina la energía del rojo con la alegría del amarillo.',
    },
    {
      id: 6,
      name: 'Negro',
      english: 'Black',
      image: 'assets/images/black.png',
      audio: 'assets/audio/black.mp3',
      description: 'El negro es elegante y poderoso.',
    },
    {
      id: 7,
      name: 'Marrón',
      english: 'Brown',
      image: 'assets/images/brown.png',
      audio: 'assets/audio/brown.mp3',
      description: 'El marrón evoca la tierra y la estabilidad.',
    },
    {
      id: 8,
      name: 'Fucsia',
      english: 'Fuchsia',
      image: 'assets/images/fuchsia.png',
      audio: 'assets/audio/fuchsia.mp3',
      description: 'El fucsia es vibrante y creativo.',
    },
    {
      id: 9,
      name: 'Gris',
      english: 'Gray',
      image: 'assets/images/gray.png',
      audio: 'assets/audio/gray.mp3',
      description: 'El gris es neutro y equilibrado.',
    },
    {
      id: 10,
      name: 'Rosa',
      english: 'Pink',
      image: 'assets/images/pink.png',
      audio: 'assets/audio/pink.mp3',
      description: 'El rosa es suave y lleno de ternura.',
    },
    {
      id: 11,
      name: 'Púrpura',
      english: 'Purple',
      image: 'assets/images/purple.png',
      audio: 'assets/audio/purple.mp3',
      description: 'El púrpura transmite misterio y creatividad.',
    },
  ]);

  /**
   * Getter colors
   *
   * Proporciona acceso de solo lectura a la lista de colores como señal.
   * Permite a los componentes suscribirse y reaccionar a cambios automáticamente.
   */
  get colors() {
    return this._colors;
  }

  /**
   * getColorById
   *
   * Busca y devuelve un objeto Color según su identificador.
   *
   * @param id - Identificador único del color que se desea obtener.
   * @returns El objeto Color correspondiente o undefined si no existe.
   *
   * Lógica:
   * 1. Llama a la señal `_colors()` para obtener el arreglo actual.
   * 2. Utiliza `find` para localizar el primer elemento con el id coincidente.
   */
  getColorById(id: number): Color | undefined {
    return this._colors().find((color) => color.id === id);
  }

  /**
   * getOptionColor
   *
   * Devuelve un valor CSS de color según el nombre en inglés.
   * Esto permite centralizar la paleta de colores en un solo lugar.
   *
   * @param option - Nombre del color en inglés (e.g., 'Red').
   * @returns Cadena de color CSS en formato hexadecimal.
   */
  getOptionColor(option: string): string {
    switch (option.toLowerCase()) {
      case 'red':
        return '#e53935';
      case 'green':
        return '#43a047';
      case 'blue':
        return '#1e88e5';
      case 'yellow':
        return '#fdd835';
      case 'orange':
        return '#fb8c00';
      case 'black':
        return '#212121';
      case 'white':
        return '#ffffff';
      case 'brown':
        return '#8d6e63';
      case 'fuchsia':
        return '#d81b60';
      case 'gray':
        return '#9e9e9e';
      case 'pink':
        return '#ec407a';
      case 'purple':
        return '#8e24aa';
      default:
        return '#424242';
    }
  }
}
