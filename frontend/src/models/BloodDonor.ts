export interface BloodDonor {
  id?: number,
  dni: string,
  firstName: string,
  lastName: string,
  gender: string,
  bloodType?: string,
  email: string,
  phoneNumber: string,
  dateOfBirth: string,
  password?: string
}