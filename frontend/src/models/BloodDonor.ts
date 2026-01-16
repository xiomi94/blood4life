import type { BloodType } from '../types/common.types';

export interface BloodDonor {
  id?: number,
  dni: string,
  firstName: string,
  lastName: string,
  gender: string,
  bloodType?: BloodType,
  email: string,
  phoneNumber: string,
  dateOfBirth: string,
  password?: string
}