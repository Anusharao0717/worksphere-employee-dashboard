import { Injectable } from '@angular/core';
import { Employee, EmployeeDraft } from './employee.model';

const STORAGE_KEY = 'worksphere.employees.v1';

const SEED_EMPLOYEES: Employee[] = [
  { id: 1001, name: 'Olivia Rhye', email: 'olivia.rhye@example.com', role: 'Product Designer', department: 'Design', location: 'Bengaluru', status: 'Active', joined: '2023-04-18', initials: 'OR', color: 'lilac' },
  { id: 1002, name: 'Phoenix Baker', email: 'phoenix.baker@example.com', role: 'Engineering Manager', department: 'Engineering', location: 'Mangaluru', status: 'Active', joined: '2022-11-02', initials: 'PB', color: 'peach' },
  { id: 1003, name: 'Lana Steiner', email: 'lana.steiner@example.com', role: 'Frontend Developer', department: 'Engineering', location: 'Bengaluru', status: 'On leave', joined: '2024-01-15', initials: 'LS', color: 'mint' },
  { id: 1004, name: 'Demi Wilkinson', email: 'demi.wilkinson@example.com', role: 'HR Business Partner', department: 'Human Resources', location: 'Hyderabad', status: 'Active', joined: '2021-08-09', initials: 'DW', color: 'blue' },
  { id: 1005, name: 'Candice Wu', email: 'candice.wu@example.com', role: 'UX Researcher', department: 'Design', location: 'Bengaluru', status: 'Inactive', joined: '2020-06-22', initials: 'CW', color: 'rose' },
  { id: 1006, name: 'Natali Craig', email: 'natali.craig@example.com', role: 'Marketing Specialist', department: 'Marketing', location: 'Pune', status: 'Active', joined: '2023-09-11', initials: 'NC', color: 'gold' },
  { id: 1007, name: 'Drew Cano', email: 'drew.cano@example.com', role: 'Software Engineer', department: 'Engineering', location: 'Mangaluru', status: 'Active', joined: '2022-03-28', initials: 'DC', color: 'sky' },
  { id: 1008, name: 'Orlando Diggs', email: 'orlando.diggs@example.com', role: 'Financial Analyst', department: 'Finance', location: 'Chennai', status: 'On leave', joined: '2024-05-06', initials: 'OD', color: 'mint' },
  { id: 1009, name: 'Andi Lane', email: 'andi.lane@example.com', role: 'Recruiter', department: 'Human Resources', location: 'Bengaluru', status: 'Active', joined: '2023-12-04', initials: 'AL', color: 'peach' },
  { id: 1010, name: 'Kate Morrison', email: 'kate.morrison@example.com', role: 'Content Strategist', department: 'Marketing', location: 'Hyderabad', status: 'Active', joined: '2021-02-17', initials: 'KM', color: 'lilac' },
  { id: 1011, name: 'Rohan Shetty', email: 'rohan.shetty@example.com', role: 'QA Engineer', department: 'Engineering', location: 'Mangaluru', status: 'Active', joined: '2024-02-12', initials: 'RS', color: 'sky' },
  { id: 1012, name: 'Maya Patel', email: 'maya.patel@example.com', role: 'Finance Associate', department: 'Finance', location: 'Pune', status: 'Inactive', joined: '2022-07-19', initials: 'MP', color: 'rose' }
];

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = this.load();

  getAll(): Employee[] {
    return this.employees.map(employee => ({ ...employee }));
  }

  add(draft: EmployeeDraft): void {
    const id = Math.max(1000, ...this.employees.map(employee => employee.id)) + 1;
    this.employees = [{ ...draft, id, initials: this.makeInitials(draft.name), color: this.colorFor(id) }, ...this.employees];
    this.persist();
  }

  update(id: number, draft: EmployeeDraft): void {
    this.employees = this.employees.map(employee =>
      employee.id === id
        ? { ...employee, ...draft, initials: this.makeInitials(draft.name) }
        : employee
    );
    this.persist();
  }

  delete(id: number): void {
    this.employees = this.employees.filter(employee => employee.id !== id);
    this.persist();
  }

  reset(): void {
    this.employees = SEED_EMPLOYEES.map(employee => ({ ...employee }));
    this.persist();
  }

  private load(): Employee[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed as Employee[];
      }
    } catch {
      // If browser storage is unavailable or contains invalid JSON, start with sample records.
    }
    return SEED_EMPLOYEES.map(employee => ({ ...employee }));
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.employees));
    } catch {
      // The app remains usable for the current session if storage is blocked or full.
    }
  }

  private makeInitials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
  }

  private colorFor(id: number): string {
    return ['lilac', 'peach', 'mint', 'blue', 'rose', 'gold', 'sky'][id % 7];
  }
}
