// shared/utils/validation.utils.ts
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  static isValidPhone(phone: string): boolean {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
  }
}