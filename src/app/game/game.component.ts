import { Component, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface GameQuestion {
  id: number;
  image: string;
  audio: string;
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

  // Array de preguntas (cada pregunta representa un color)
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
    // Puedes agregar más preguntas o colores
  ];

  // Signal para llevar la cuenta de la pregunta actual
  currentQuestionIndex = signal(0);
  currentQuestion = signal(this.questions[0]);

  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }

  selectOption(option: string) {
    if (option === this.currentQuestion().correctColor) {
      this.snackBar.open('¡Correcto!', 'Cerrar', {
        duration: 1500,
      });
      this.nextQuestion();
    } else {
      this.snackBar.open('Incorrecto, inténtalo nuevamente.', 'Cerrar', {
        duration: 1500,
      });
    }
  }

  nextQuestion() {
    let nextIndex = this.currentQuestionIndex() + 1;
    if (nextIndex >= this.questions.length) {
      nextIndex = 0; // Reinicia el juego o muestra mensaje de finalización
    }
    this.currentQuestionIndex.set(nextIndex);
    this.currentQuestion.set(this.questions[nextIndex]);
  }
}
