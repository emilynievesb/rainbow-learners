import { Component, signal, OnInit } from '@angular/core';
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
export class GameComponent implements OnInit {
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
      image: 'assets/images/black.png',
      audio: 'assets/audio/black.mp3',
      correctColor: 'Black',
      options: ['Black', 'Blue', 'Brown', 'Fuchsia'],
    },
    {
      id: 2,
      image: 'assets/images/blue.png',
      audio: 'assets/audio/blue.mp3',
      correctColor: 'Blue',
      options: ['Blue', 'Brown', 'Fuchsia', 'Gray'],
    },
    {
      id: 3,
      image: 'assets/images/brown.png',
      audio: 'assets/audio/brown.mp3',
      correctColor: 'Brown',
      options: ['Brown', 'Fuchsia', 'Gray', 'Green'],
    },
    {
      id: 4,
      image: 'assets/images/fuchsia.png',
      audio: 'assets/audio/fuchsia.mp3',
      correctColor: 'Fuchsia',
      options: ['Fuchsia', 'Gray', 'Green', 'Orange'],
    },
    {
      id: 5,
      image: 'assets/images/gray.png',
      audio: 'assets/audio/gray.mp3',
      correctColor: 'Gray',
      options: ['Gray', 'Green', 'Orange', 'Pink'],
    },
    {
      id: 6,
      image: 'assets/images/green.png',
      audio: 'assets/audio/green.mp3',
      correctColor: 'Green',
      options: ['Green', 'Orange', 'Pink', 'Purple'],
    },
    {
      id: 7,
      image: 'assets/images/orange.png',
      audio: 'assets/audio/orange.mp3',
      correctColor: 'Orange',
      options: ['Orange', 'Pink', 'Purple', 'Red'],
    },
    {
      id: 8,
      image: 'assets/images/pink.png',
      audio: 'assets/audio/pink.mp3',
      correctColor: 'Pink',
      options: ['Pink', 'Purple', 'Red', 'Yellow'],
    },
    {
      id: 9,
      image: 'assets/images/purple.png',
      audio: 'assets/audio/purple.mp3',
      correctColor: 'Purple',
      options: ['Purple', 'Red', 'Yellow', 'Black'],
    },
    {
      id: 10,
      image: 'assets/images/red.png',
      audio: 'assets/audio/red.mp3',
      correctColor: 'Red',
      options: ['Red', 'Yellow', 'Black', 'Blue'],
    },
    {
      id: 11,
      image: 'assets/images/yellow.png',
      audio: 'assets/audio/yellow.mp3',
      correctColor: 'Yellow',
      options: ['Yellow', 'Black', 'Blue', 'Brown'],
    },
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
   * INITIAL_TIME
   * Constante que define el tiempo inicial (en segundos) para cada pregunta.
   */
  readonly INITIAL_TIME = 15;

  /**
   * timeLeft
   * Signal que almacena los segundos restantes del temporizador.
   */
  timeLeft = signal(this.INITIAL_TIME);

  /**
   * timerId
   * Identificador del intervalo del temporizador para poder detenerlo.
   */
  private timerId: any;

  /**
   * lives
   * Signal que almacena las vidas restantes del jugador.
   * Funcionalidad añadida: Sistema de vidas para limitar intentos.
   */
  lives = signal(3);

  /**
   * gameOver
   * Signal booleana que indica si el juego ha terminado por agotamiento de vidas.
   */
  gameOver = signal(false);

  /**
   * livesArray
   * Getter que expone un array de índices [0..lives-1] para iterar en plantilla.
   * Permite usar: @for (life of livesArray; track life)
   */
  get livesArray(): number[] {
    return Array.from({ length: this.lives() }, (_, i) => i);
  }

  /**
   * ngOnInit
   * Ciclo de vida Angular que se ejecuta al inicializar el componente.
   * Inicia el temporizador para la primera pregunta.
   */
  ngOnInit() {
    this.startTimer(); // Iniciar contador al cargar
  }

  /**
   * startTimer
   * Propósito: Iniciar o reiniciar el temporizador de cuenta regresiva.
   * Lógica:
   *  1. Limpia cualquier intervalo previo.
   *  2. Resetea `timeLeft` al valor inicial.
   *  3. Crea un setInterval que decrementa `timeLeft` cada segundo.
   *  4. Al llegar a 0, detiene el intervalo y llama a onTimeOut().
   */
  private startTimer() {
    if (this.timerId) {
      clearInterval(this.timerId); // Limpiar intervalo anterior
    }
    this.timeLeft.set(this.INITIAL_TIME); // Reset del temporizador
    this.timerId = setInterval(() => {
      const t = this.timeLeft() - 1;
      this.timeLeft.set(t);
      if (t <= 0) {
        clearInterval(this.timerId); // Detener cuando llegue a 0
        this.onTimeOut(); // Manejar fin de tiempo
      }
    }, 1000);
  }

  /**
   * onTimeOut
   * Propósito: Gestionar la situación cuando el temporizador llega a 0.
   * Lógica:
   *  - Muestra un mensaje para indicar que el tiempo se acabó.
   *  - Las opciones quedan deshabilitadas hasta respuesta correcta.
   */
  private onTimeOut() {
    this.snackBar.open(
      'Se acabó el tiempo. ¡Responde correctamente para continuar!',
      'Cerrar',
      { duration: 2000 }
    );
  }

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
   *  1. Reproducir el audio de la opción seleccionada.
   *  2. Validar si la opción es la correcta.
   *  3. Si es correcta:
   *      - Marcar `correctAnswered` como true.
   *      - Detener el temporizador.
   *      - Mostrar snackBar de éxito.
   *     Si es incorrecta:
   *      - Decrementar `lives` en 1.
   *      - Si `lives` llega a 0:
   *          * Marcar `gameOver` como true.
   *          * Detener el temporizador y mostrar snackBar de Game Over.
   *        Si no:
   *          * Mostrar snackBar con vidas restantes.
   * Opciones se deshabilitan si `timeLeft` es 0, `correctAnswered` o `gameOver`.
   * @param option - Cadena de la opción seleccionada por el usuario.
   */
  selectOption(option: string) {
    const optionAudio = `assets/audio/${option.toLowerCase()}.mp3`;
    this.playAudio(optionAudio);

    if (option === this.currentQuestion().correctColor) {
      this.correctAnswered.set(true);
      clearInterval(this.timerId);
      this.snackBar.open(
        '¡Correcto! Ahora puedes pasar a la siguiente.',
        'Cerrar',
        { duration: 1500 }
      );
    } else {
      const remaining = this.lives() - 1;
      this.lives.set(remaining);
      if (remaining <= 0) {
        this.gameOver.set(true);
        clearInterval(this.timerId);
        this.snackBar.open('Game Over. Se acabaron tus vidas.', 'Cerrar', {
          duration: 2000,
        });
      } else {
        this.snackBar.open(
          `Incorrecto. Te quedan ${remaining} vidas.`,
          'Cerrar',
          { duration: 1500 }
        );
      }
    }
  }

  /**
   * nextQuestion
   * Propósito: Avanzar a la siguiente pregunta si y solo si la pregunta
   *            actual ha sido respondida correctamente o si el juego terminó.
   * Lógica:
   *  1. Si `gameOver` es true, reiniciar vidas y bandera de fin de juego.
   *  2. Verificar `correctAnswered`; si es false, mostrar mensaje y abortar.
   *  3. Incrementar `currentQuestionIndex` circulando al inicio si excede el largo.
   *  4. Actualizar `currentQuestion` con la nueva pregunta.
   *  5. Resetear `correctAnswered` a false.
   *  6. Reiniciar el temporizador para la nueva pregunta.
   */
  nextQuestion() {
    if (this.gameOver()) {
      this.lives.set(3);
      this.gameOver.set(false);
    }
    if (!this.correctAnswered()) {
      this.snackBar.open(
        'Debes responder correctamente para continuar.',
        'Cerrar',
        { duration: 1500 }
      );
      return;
    }

    let nextIndex = this.currentQuestionIndex() + 1;
    if (nextIndex >= this.questions.length) {
      nextIndex = 0;
      this.lives.set(3);
      this.gameOver.set(false);
    }

    this.currentQuestionIndex.set(nextIndex);
    this.currentQuestion.set(this.questions[nextIndex]);
    this.correctAnswered.set(false);
    this.startTimer();
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
