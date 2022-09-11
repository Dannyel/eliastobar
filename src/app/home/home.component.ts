import { Component, OnInit, NgZone  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl  } from '@angular/forms';
import { EmpresaService } from '../empresa.service';
import { Router, ActivatedRoute } from '@angular/router';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Empresa } from '../modelos/empresa';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  submitted = false;
  empresaForm: FormGroup;
  encabezado = ["No.", "Estado", "Nombre", "E-mail", "NIT", "Opciones"];
  campos = ["No.", "Estado", "Nombre", "E-mail", "NIT", "Opciones"];
  empresasListado: any = [];
  faPen = faPen;
  faTrash = faTrash;
  esActualizar: boolean = true;
  empresa: Empresa = new Empresa;
  lblBoton: string = 'Guardar';
  idEmpresa:string = '';

  constructor(private formBuilder: FormBuilder, private ngZone: NgZone,
    private router: Router, private activater: ActivatedRoute, 
    public empresaService: EmpresaService) {
    
      this.empresaForm = this.formBuilder.group({
        nombre_comercial: ['', Validators.required],
        razon_social: ['', Validators.required],
        telefono: ['', Validators.required],
        correo: [{value:'', disabled: false}, [Validators.required, Validators.email]],
        nit: ['', Validators.required],
        estado: ['', Validators.required],
        direccion: ['', Validators.required]
      });

    if (activater.snapshot.params['id'] != undefined){
      this.idEmpresa = activater.snapshot.params['id'];
      this.esActualizar = false;
      this.lblBoton = 'Actualizar';

      this.empresaService.ObtenerEmpresa(activater.snapshot.params['id']).subscribe((data) => {
        this.empresa = data;
        this.empresaForm = this.formBuilder.group({

          nombre_comercial: [data.nombre_comercial, Validators.required],
          razon_social: [data.razon_social, Validators.required],
          telefono: [data.telefono, Validators.required],
          correo: [{value:data.correo, disabled: true}, [Validators.required, Validators.email]],
          nit: [data.nit, Validators.required],
          estado: [data.estado, Validators.required],
          direccion: [data.direccion, Validators.required]

        });
      })
    } 
  }

  ngOnInit(): void {
    this.cargaEmpresas();
  }

  get form(): { [key: string]: AbstractControl; }
  {
      return this.empresaForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    
    if(this.esActualizar){
      this.empresaService.CrearEmpresa(this.empresaForm.value).subscribe((res) => {
        this.cargaEmpresas();
        this.onReset();
      });
    }else{
      this.empresaService.ActualizaEmpresa(this.idEmpresa, this.empresaForm.value).subscribe(res => {
        this.router.navigate(['']);
      })
    }
    
    
  }

  cargaEmpresas() {
    this.empresasListado = [];
    return this.empresaService.ObtenerEmpresas().subscribe((data: {}) => {
      this.empresasListado = data;
    })
  }

  modificarEmpresa(event:any, datos:any){
    //this.router.navigateByUrl('/update/'+datos)
    this.router.navigate(['/update', datos]);
  }

  eliminarEmpresa(event:any, datos:any){
    return this.empresaService.EliminaEmpresa(datos).subscribe(res => {
      this.cargaEmpresas();
    })
    
  }

  limpiar(event:any){
    event.stopPropagation();
    this.onReset();
  }

  onReset() {
    this.submitted = false;
    this.empresaForm.reset();
}

}
