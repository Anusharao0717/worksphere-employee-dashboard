export type EmployeeStatus = 'Active' | 'On leave' | 'Inactive';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  status: EmployeeStatus;
  joined: string;
  initials: string;
  color: string;
}

export type EmployeeDraft = Omit<Employee, 'id' | 'initials' | 'color'>;
