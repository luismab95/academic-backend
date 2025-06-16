import { EncryptedData } from "../../shared/helpers";

interface University {
  id_universidad: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  anio_fundacion: number;
  logo_url: string;
}

interface Faculty {
  id_facultad: number;
  nombre: string;
  descripcion: string;
  logo_url: string;
  id_universidad: number;
}

interface School {
  id_escuela: number;
  id_facultad: number;
  nombre: string;
  descripcion: string;
  logo_url: string;
  semestres: number;
  carrera: string;
}

interface Student {
  id_estudiante: number;
  nombre: string;
  apellido: string;
  matricula: string;
  correo: string;
  fecha_nacimiento: string;
  direccion: string;
  identificacion: string;
}

interface Course {
  code: number;
  name: string;
  grade: string;
  state: string;
}

interface Semester {
  semester: string;
  courses: Course[];
  average: string;
}

interface Authority {
  id_relacion: number;
  id_autoridad: number;
  id_universidad: number;
  id_facultad: number | null;
  id_escuela: number | null;
  cargo: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  foto_url: string;
}

export interface AcademicRecord {
  university: University;
  faculty: Faculty;
  school: School;
  student: Student;
  semesters: Semester[];
  average: string;
  autorities: Authority[];
  year: string;
}
