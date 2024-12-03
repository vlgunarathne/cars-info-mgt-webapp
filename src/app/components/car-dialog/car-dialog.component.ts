import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-car-dialog',
  templateUrl: './car-dialog.component.html',
  styleUrls: ['./car-dialog.component.css'],
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormFieldModule,
    MatDialogActions,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class CarDialogComponent {
  isNewCar: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<CarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public car: Car,
    private carService: CarService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Check if this is a new car by verifying if the id is empty or undefined
    this.isNewCar = !this.car?.id || this.car.id.trim() === '';
  }

  saveCar(): void {
    if (this.isNewCar) {
      this.carService.createCar(this.car).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open('Car created successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error creating car:', error);
          this.snackBar.open('Error creating new car', 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      this.carService.updateCar(this.car.id, this.car).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open('Car updated successfully', 'Close', {
            duration: 3000
          })
        },
        error: (error) => {
          console.error('Error updating car:', error);
          this.snackBar.open('Error updating the car', 'Close', {
            duration: 3000
          })
        }
      });
    }
  }

  deleteCar(): void {
    this.carService.deleteCar(this.car.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.snackBar.open('Car deleted successfully', 'Close', {
          duration: 3000
        })
      },
      error: (error) => {
        console.error('Error updating car:', error);
        this.snackBar.open('Error deleting the car', 'Close', {
          duration: 3000
        })
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
