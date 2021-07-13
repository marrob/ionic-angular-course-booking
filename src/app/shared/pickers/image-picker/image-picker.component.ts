import { AfterViewInit, Component, destroyPlatform, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Plugins,Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit, AfterViewInit {
  selectedImage:string;
  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('filePicker') filePicker:ElementRef<HTMLInputElement>
  @ViewChild('filePickerLabel') filePickerLabel:ElementRef<HTMLInputElement>
  usePicker = false;

  constructor( private platform:Platform) { }

  ngOnInit() {
   
  }

  ngAfterViewInit() 
  {
    console.log('Mobile', this.platform.is('mobile'));    
    console.log('Hybrid', this.platform.is('hybrid'));
    console.log('iOS', this.platform.is('ios'));
    console.log('Android', this.platform.is('android'));
    console.log('Desktop', this.platform.is('desktop'));
  
    if((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')){
      this.usePicker = true;
    }
  }

  onPickImage(){

    if(!Capacitor.isPluginAvailable('Camera') || this.usePicker){
      console.log('Picker', this.usePicker);
      console.log('there is no camera');
      this.filePickerLabel.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality:50,
      source:CameraSource.Prompt,
      correctOrientation:true,
      height:320,
      width:200,
      resultType:CameraResultType.DataUrl
    }).then(image=>{
      this.selectedImage = image.dataUrl;
      //console.log('selectedImage:',this.selectedImage);
      this.imagePick.emit(image.base64String);
    }).catch(error=>{
      console.log(error);
    })

  }

  onFileChosen(event:Event){
    console.log(event);

    const pickedFile = (event.target as HTMLInputElement).files[0];
    if(!pickedFile){
      return;
    }

    const fr= new FileReader();
    fr.onload  =() => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    }
    fr.readAsDataURL(pickedFile);
  }
}
