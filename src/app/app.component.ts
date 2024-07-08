import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart') private chartRef!: ElementRef;
  title = 'Ng7ChartJs By DotNet Techy';
  LineChart: any;
  BarChart: any;
  PieChart: any;
  labels = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',]
  data: any[] = [];
  lineChart: Chart | undefined;
  barChart: Chart | undefined;
  pieChart: Chart | undefined;
  selectedContainer: HTMLDivElement | null = null;

  constructor(private renderer: Renderer2){}

  ngOnInit(): void {
      
  }

  changeData() {
    this.data = [
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1,
      Math.floor(Math.random() * 100) + 1
    ];
    console.log(this.data);
    this.initializeLineChart();
  }





  





  









  ngAfterViewInit() {
    // Delay initialization to ensure DOM elements are fully rendered
    setTimeout(() => {
      this.initializeCharts();
      this.makeCanvasDraggableAndResizable('lineChartContainer', this.initializeLineChart.bind(this));
      this.makeCanvasDraggableAndResizable('barChartContainer', this.initializeBarChart.bind(this));
      this.makeCanvasDraggableAndResizable('pieChartContainer', this.initializePieChart.bind(this));

      // Add event listener to document for deselecting container
      document.addEventListener('click', this.handleDocumentClick.bind(this));
    }, 0);
  }

  initializeCharts() {
    this.initializeLineChart();
    this.initializeBarChart();
    this.initializePieChart();
  }

  initializeLineChart() {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Line Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        }]
      }
    });
  }

  initializeBarChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    if (this.barChart) {
      this.barChart.destroy();
    }
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Bar Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: 'rgb(75, 192, 192)'
        }]
      }
    });
  }

  initializePieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
          label: 'Pie Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ]
        }]
      }
    });
  }

  makeCanvasDraggableAndResizable(containerId: string, onResize: () => void) {
    const container = document.getElementById(containerId) as HTMLDivElement;
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const resizeHandles = container.querySelectorAll('.resize-handle') as NodeListOf<HTMLDivElement>;

    // Logic for selecting the container
    container.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent triggering document click event
      if (this.selectedContainer) {
        this.renderer.removeClass(this.selectedContainer, 'selected');
      }
      this.renderer.addClass(container, 'selected');
      this.selectedContainer = container;
    });

    // Logic for dragging
    let isDragging = false;
    let offsetX: number;
    let offsetY: number;

    container.addEventListener('mousedown', (e) => {
      if (e.target === canvas) {
        isDragging = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
        console.log(offsetX, offsetY, 'soy');
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Logic for resizing
    resizeHandles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        const handleClass = handle.classList.contains('top-left') ? 'top-left' :
                            handle.classList.contains('top-right') ? 'top-right' :
                            handle.classList.contains('bottom-left') ? 'bottom-left' : 'bottom-right';
        
        let isResizing = true;
        let initialWidth = container.offsetWidth;
        let initialHeight = container.offsetHeight;
        let initialX = e.clientX;
        let initialY = e.clientY;

        const onMouseMove = (event: MouseEvent) => {
          if (isResizing) {
            let newWidth = initialWidth;
            let newHeight = initialHeight;

            switch(handleClass) {
              case 'top-left':
                newWidth = initialWidth - (event.clientX - initialX);
                newHeight = initialHeight - (event.clientY - initialY);
                container.style.left = `${event.clientX}px`;
                container.style.top = `${event.clientY}px`;
                break;
              case 'top-right':
                newWidth = initialWidth + (event.clientX - initialX);
                newHeight = initialHeight - (event.clientY - initialY);
                container.style.top = `${event.clientY}px`;
                break;
              case 'bottom-left':
                newWidth = initialWidth - (event.clientX - initialX);
                newHeight = initialHeight + (event.clientY - initialY);
                container.style.left = `${event.clientX}px`;
                break;
              case 'bottom-right':
                newWidth = initialWidth + (event.clientX - initialX);
                newHeight = initialHeight + (event.clientY - initialY);
                break;
            }

            container.style.width = `${newWidth}px`;
            container.style.height = `${newHeight}px`;
            canvas.width = newWidth;
            canvas.height = newHeight;
            onResize();
          }
        };

        const onMouseUp = () => {
          isResizing = false;
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });
  }

  handleDocumentClick() {
    if (this.selectedContainer) {
      this.renderer.removeClass(this.selectedContainer, 'selected');
      this.selectedContainer = null;
    }
  }













  logCanvasPositions() {
    const containers = document.querySelectorAll('.canvas-container');
    containers.forEach(container => {
      const rect = container.getBoundingClientRect();
      console.log(`ID: ${container.id}, Left: ${rect.left}, Top: ${rect.top}, Width: ${rect.width}, Height: ${rect.height}`);
    });
  }
}
