import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-frames',
  standalone: true,
  imports: [NgIf],
  templateUrl: './frames.component.html',
  styleUrl: './frames.component.css'
})
export class FramesComponent {
  @ViewChild('canvas1') canvas1!: ElementRef<HTMLCanvasElement>;
  canvas1Context!: fabric.Canvas;

  imageSrc: string | ArrayBuffer | null = null;
  imageX: number = 0;
  imageY: number = 0;
  isDragging: boolean = false;

  no: number = 0;
  frameSrc: string[] = ['https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6eed28d6-e8da-4210-84ca-6971c6c8f053/da51a2p-6d2ba5ab-4882-4d4d-9a51-5ea937225d04.png/v1/fill/w_998,h_801,strp/pink_blue_frame_shape_by_lashonda1980_da51a2p-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODIyIiwicGF0aCI6IlwvZlwvNmVlZDI4ZDYtZThkYS00MjEwLTg0Y2EtNjk3MWM2YzhmMDUzXC9kYTUxYTJwLTZkMmJhNWFiLTQ4ODItNGQ0ZC05YTUxLTVlYTkzNzIyNWQwNC5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.0bBhA7jnjISRoyVSWQq-576HxRYmwRBLIcoGW-m5530',
    '../../../assets/5a358ce28f8dc2.329000951513458914588.png',
    '../../../assets/transparent-christmas-graphics-61ad80810041b7.1612230116387605770011.png',
    '../../../assets/—Pngtree—vector metal picture frame golden_5432883.png'
  ]; // Replace with the path to your frame image


  edit: boolean = false;

  canvasWidth: number = 0;
  canvasHeight: number = 0;



  // Add the following method to your component class
  mouseEnterHandler() {
    this.canvas1.nativeElement.focus(); // Focus on the canvas when mouse enters
  }

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {

    const overlayImage = new Image();
    overlayImage.src = this.frameSrc[this.no];
    overlayImage.onload = () => {
      this.canvasWidth = 500;
      this.canvasHeight = 600;
    };
  }

  ngAfterViewInit() {

    this.canvas1Context = new fabric.Canvas(this.canvas1.nativeElement, {
      selection: false, // Disable Fabric.js built-in selection mechanism
    });
  }

  handleFileInput(event: any) {
    this.canvas1Context.setWidth(this.canvasWidth);
    this.canvas1Context.setHeight(this.canvasHeight);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
        this.addImageToCanvas();
      };
      reader.readAsDataURL(file);
    }
  }

  private addImageToCanvas(): void {
    if (this.imageSrc)
      fabric.Image.fromURL(this.imageSrc.toString(), (img) => {
        let width = img.width ?? 1;
        let height = img.height ?? 1;

        // Calculate the scale factors to fit the image within the canvas
        const scaleFactorWidth = this.canvas1.nativeElement.width / width;
        const scaleFactorHeight = this.canvas1.nativeElement.height / height;
        const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

        // Set the scale factors to resize the image
        img.scaleToWidth(width * scaleFactor);
        img.scaleToHeight(height * scaleFactor);

        img.set({
          left: 0,
          top: 0,
          hasControls: true, // Enable Fabric.js controls for easy movement
          selectable: true    // Allow selection of the image
        });

        img.on('mousedown', (event) => {
          const target = event.target;
          console.log('Image selected:', target);
          if (target)
            this.canvas1Context.setActiveObject(target);
        });

        this.canvas1Context.add(img);
      });
  }

  mouseDownHandler(event: MouseEvent) {
    this.isDragging = true;
  }

  mouseMoveHandler(event: MouseEvent) {
    if (this.isDragging) {
      const rect = this.canvas1.nativeElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      this.imageX = mouseX;
      this.imageY = mouseY;

      this.canvas1Context.renderAll(); // Render canvas to reflect changes
    }
  }

  mouseUpHandler(event: MouseEvent) {
    this.isDragging = false;
  }

  captureScreenshot() {
    const elementToCapture = this.elementRef.nativeElement.querySelector('#canvas-container');

    html2canvas(elementToCapture).then(canvas => {
      // Convert canvas to a data URL
      const screenshotData = canvas.toDataURL('image/png');

      // Create a temporary anchor element
      const downloadLink = document.createElement('a');
      downloadLink.href = screenshotData;

      // Set the download attribute to specify the filename
      downloadLink.download = 'screenshot.png';

      // Append the anchor element to the DOM and trigger a click event to initiate download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Remove the anchor element from the DOM
      document.body.removeChild(downloadLink);
    });
  }
}