import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  vacacionesPendientes = []; // Vacaciones pendientes de aprobación
  vacacionesAprobadas = []; // Vacaciones aprobadas
  vacacionesRechazadas = []; // Vacaciones rechazadas
  nuevaVacacion = { fechaInicio: '', fechaTermino: '' }; // Nueva vacación
  isModalOpen = false;

  constructor(private modalCtrl: ModalController) {}

  // Abre el modal para agregar vacaciones
  abrirModal() {
    this.isModalOpen = true;
  }

  // Cierra el modal
  cerrarModal() {
    this.isModalOpen = false;
    this.nuevaVacacion = { fechaInicio: '', fechaTermino: '' }; // Limpiar el formulario
  }

  // Agrega una vacación a la lista de pendientes
  agregarVacacion() {
    if (this.nuevaVacacion.fechaInicio && this.nuevaVacacion.fechaTermino) {
      this.vacacionesPendientes.push({ ...this.nuevaVacacion });
      this.cerrarModal();
    } else {
      console.log('Debe ingresar ambas fechas');
    }
  }

  // Aprueba una vacación
  aprobarVacacion(vacacion) {
    this.vacacionesPendientes = this.vacacionesPendientes.filter(v => v !== vacacion);
    this.vacacionesAprobadas.push(vacacion);
  }

  // Rechaza una vacación
  rechazarVacacion(vacacion) {
    this.vacacionesPendientes = this.vacacionesPendientes.filter(v => v !== vacacion);
    this.vacacionesRechazadas.push(vacacion);
  }

  // Elimina una vacación de la lista correspondiente
  eliminarVacacion(vacacion, tipo) {
    if (tipo === 'pendientes') {
      this.vacacionesPendientes = this.vacacionesPendientes.filter(v => v !== vacacion);
    } else if (tipo === 'aprobadas') {
      this.vacacionesAprobadas = this.vacacionesAprobadas.filter(v => v !== vacacion);
    } else if (tipo === 'rechazadas') {
      this.vacacionesRechazadas = this.vacacionesRechazadas.filter(v => v !== vacacion);
    }
  }

  // Genera un archivo PDF con las listas de vacaciones
  generarPDF() {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Reporte de Vacaciones', 10, 10);
    
    // Vacaciones Pendientes
    doc.setFontSize(14);
    doc.text('Vacaciones Pendientes:', 10, 20);
    this.vacacionesPendientes.forEach((vacacion, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. Inicio: ${vacacion.fechaInicio} - Término: ${vacacion.fechaTermino}`,
        10, 
        30 + index * 10
      );
    });

    // Vacaciones Aprobadas
    let startAprobadas = 40 + this.vacacionesPendientes.length * 10;
    doc.setFontSize(14);
    doc.text('Vacaciones Aprobadas:', 10, startAprobadas);
    this.vacacionesAprobadas.forEach((vacacion, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. Inicio: ${vacacion.fechaInicio} - Término: ${vacacion.fechaTermino}`,
        10, 
        startAprobadas + 10 + index * 10
      );
    });

    // Vacaciones Rechazadas
    let startRechazadas = startAprobadas + 20 + this.vacacionesAprobadas.length * 10;
    doc.setFontSize(14);
    doc.text('Vacaciones Rechazadas:', 10, startRechazadas);
    this.vacacionesRechazadas.forEach((vacacion, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. Inicio: ${vacacion.fechaInicio} - Término: ${vacacion.fechaTermino}`,
        10, 
        startRechazadas + 10 + index * 10
      );
    });

    // Descargar el PDF
    doc.save('vacaciones_reporte.pdf');
  }
}
