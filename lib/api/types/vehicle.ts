/**
 * Type definitions for vehicle API responses
 */

export interface VehicleBrand {
  codigo: string;
  nome: string;
}

export interface VehicleModel {
  codigo: string;
  nome: string;
}

export interface VehicleYear {
  codigo: string;
  nome: string;
}

export interface VehicleModelResponse {
  modelos: VehicleModel[];
  anos: VehicleYear[];
}

export interface VehicleDetails {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

// Vehicle types enum for FIPE API
export enum VehicleType {
  CARS = 'carros',
  MOTORCYCLES = 'motos',
  TRUCKS = 'caminhoes'
} 