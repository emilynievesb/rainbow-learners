import { Component, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface GameQuestion {
  /**
   * id: Identificador único de la pregunta (útil para trackBy y referencia).
   * image: Ruta al recurso de imagen que muestra el objeto/color.
   * audio: Ruta al archivo de audio con la pronunciación del color correcto.
   * correctColor: Cadena que contiene el nombre del color correcto.
   * options: Lista de cadenas con las posibles respuestas para el juego.
   */
  id: number;
  image: string;
  audio: string;
  correctColor: string;
  options: string[];
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MatCardModule, // Proporciona el componente <mat-card> para la tarjeta del juego
    MatButtonModule, // Proporciona los componentes de botón de Angular Material
    MatSnackBarModule, // Proporciona el servicio MatSnackBar para mostrar notificaciones
    MatIconModule, // Proporciona el componente <mat-icon> para íconos (volumen)
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  /**
   * Constructor
   * @param snackBar - Servicio para mostrar notificaciones emergentes (snack bars).
   * Diseño: Usamos MatSnackBar para feedback inmediato al usuario.
   */
  constructor(private snackBar: MatSnackBar) {}

  /**
   * questions
   * Arreglo estático de preguntas que define la lógica del juego.
   * Cada objeto GameQuestion describe:
   *  - id: para trackBy en la plantilla.
   *  - image, audio: recursos multimedia.
   *  - correctColor: valor de respuesta correcta.
   *  - options: lista completa de opciones a mostrar.
   */
  questions: GameQuestion[] = [
    {
      id: 1,
      image: 'assets/images/red.png',
      audio: 'assets/audio/red.mp3',
      correctColor: 'Red',
      options: ['Red', 'Green', 'Blue', 'Yellow'],
    },
    {
      id: 2,
      image: 'assets/images/blue.png',
      audio: 'assets/audio/blue.mp3',
      correctColor: 'Blue',
      options: ['Green', 'Blue', 'Red', 'Orange'],
    },
    // Más preguntas pueden añadirse aquí
  ];

  /**
   * currentQuestionIndex
   * Signal que lleva el índice de la pregunta actual dentro de `questions[]`.
   * Se usa para navegar entre preguntas de forma reactiva.
   */
  currentQuestionIndex = signal(0);

  /**
   * currentQuestion
   * Signal que almacena el objeto GameQuestion actual según `currentQuestionIndex`.
   * Proporciona acceso reactivo a los datos de la pregunta en la plantilla.
   */
  currentQuestion = signal(this.questions[0]);

  /**
   * correctAnswered
   * Signal booleana que indica si el usuario ha respondido correctamente la
   * pregunta actual. Controla el estado habilitado del botón “Siguiente”.
   */
  correctAnswered = signal(false);

  /**
   * playAudio
   * Propósito: Reproducir un archivo de audio dado su URL.
   * Lógica:
   *  1. Construye un nuevo objeto Audio con la ruta proporcionada.
   *  2. Llama a play() para iniciar la reproducción.
   * Decisión de diseño:
   *  - Usamos la API nativa Audio por su simplicidad y compatibilidad.
   * @param audioUrl - Ruta relativa al archivo de audio (e.g., 'assets/audio/red.mp3').
   */
  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }

  /**
   * selectOption
   * Propósito: Manejar la selección de una opción por parte del usuario.
   * Lógica:
   *  1. Reproducir el audio de la opción seleccionada, construyendo la ruta
   *     basándose en la cadena `option.toLowerCase()`.
   *  2. Comparar `option` con la propiedad `correctColor` de la pregunta actual.
   *  3. Si es correcta:
   *      - Marcar `correctAnswered` como true.
   *      - Mostrar snackBar de éxito.
   *     Si es incorrecta:
   *      - Mantener `correctAnswered` en false.
   *      - Mostrar snackBar de error.
   * @param option - Cadena de la opción seleccionada por el usuario.
   */
  selectOption(option: string) {
    // Paso 1: reproducir audio de la opción
    const optionAudio = `assets/audio/${option.toLowerCase()}.mp3`;
    this.playAudio(optionAudio);

    // Paso 2: validar si la opción es la correcta
    if (option === this.currentQuestion().correctColor) {
      this.correctAnswered.set(true);
      this.snackBar.open(
        '¡Correcto! Ahora puedes pasar a la siguiente.',
        'Cerrar',
        {
          duration: 1500,
        }
      );
    } else {
      this.snackBar.open('Incorrecto, inténtalo nuevamente.', 'Cerrar', {
        duration: 1500,
      });
      // correctAnswered permanece false, bloqueando "Siguiente"
    }
  }

  /**
   * nextQuestion
   * Propósito: Avanzar a la siguiente pregunta si y solo si la pregunta
   *            actual ha sido respondida correctamente.
   * Lógica:
   *  1. Verificar `correctAnswered`; si es false, mostrar mensaje y abortar.
   *  2. Incrementar `currentQuestionIndex` circulando al inicio si excede el largo.
   *  3. Actualizar `currentQuestion` con la nueva pregunta.
   *  4. Resetear `correctAnswered` a false para la siguiente pregunta.
   */
  nextQuestion() {
    if (!this.correctAnswered()) {
      this.snackBar.open(
        'Debes responder correctamente para continuar.',
        'Cerrar',
        {
          duration: 1500,
        }
      );
      return;
    }

    // Avanzar índice y circular al inicio si es necesario
    let nextIndex = this.currentQuestionIndex() + 1;
    if (nextIndex >= this.questions.length) {
      nextIndex = 0; // decisión de diseño: reiniciar el juego al terminar
    }

    // Actualizar señales para nueva pregunta
    this.currentQuestionIndex.set(nextIndex);
    this.currentQuestion.set(this.questions[nextIndex]);
    // Resetear estado de respuesta correcta
    this.correctAnswered.set(false);
  }

  /**
   * getOptionColor
   * Propósito: Devolver un valor CSS de color según el nombre de la opción.
   * Lógica: Utiliza un switch para mapear nombres de color a hexadecimales.
   * Diseño:
   *  - Facilita la creación de botones de opción con bordes y texto en el color
   *    correspondiente, reforzando la asociación visual.
   * @param option - Cadena con el nombre del color (e.g., 'Red').
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
      default:
        return '#424242';
    }
  }
}
