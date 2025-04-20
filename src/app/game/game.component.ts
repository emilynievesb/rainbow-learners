import { Component, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface GameQuestion {
  id: number;
  image: string;
  audio: string; // audio del color correcto (puedes seguir usándolo si lo deseas)
  correctColor: string;
  options: string[];
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  constructor(private snackBar: MatSnackBar) {}

  // Definición de preguntas
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
    // Más preguntas...
  ];

  // Señales de estado
  currentQuestionIndex = signal(0);
  currentQuestion = signal(this.questions[0]);
  correctAnswered = signal(false);

  /** Reproduce un archivo de audio dado */
  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }

  /**
   * Cuando seleccionan una opción:
   * 1) Suena el audio de esa opción
   * 2) Marca correctAnswered = true solo si es correcta
   * 3) Muestra el snackbar correspondiente
   */
  selectOption(option: string) {
    // 1) reproducir audio de la opción elegida
    const optionAudio = `assets/audio/${option.toLowerCase()}.mp3`;
    this.playAudio(optionAudio);

    // 2) validar si es correcta
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
      // correctAnswered permanece false
    }
  }

  /**
   * Avanza únicamente si se respondió correctamente.
   * Resetea correctAnswered para la siguiente pregunta.
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
    let nextIndex = this.currentQuestionIndex() + 1;
    if (nextIndex >= this.questions.length) {
      nextIndex = 0;
    }
    this.currentQuestionIndex.set(nextIndex);
    this.currentQuestion.set(this.questions[nextIndex]);
    this.correctAnswered.set(false);
  }

  /**
   * Devuelve un color para estilizar la opción.
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
