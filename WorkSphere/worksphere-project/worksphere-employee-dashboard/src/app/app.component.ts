import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeDraft, EmployeeStatus } from './employee.model';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  readonly Math = Math;
  readonly employees = signal<Employee[]>(this.employeeService.getAll());
  readonly searchTerm = signal('');
  readonly departmentFilter = signal('All departments');
  readonly statusFilter = signal('All statuses');
  readonly activePage = signal('Overview');
  readonly modalOpen = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly deletingId = signal<number | null>(null);
  readonly toast = signal('');
  readonly pageSize = 6;
  readonly page = signal(1);
  private toastTimer: ReturnType<typeof setTimeout> | undefined;

  readonly departments = ['All departments', 'Engineering', 'Design', 'Human Resources', 'Marketing', 'Finance'];
  readonly statuses = ['All statuses', 'Active', 'On leave', 'Inactive'];
  draft: EmployeeDraft = this.emptyDraft();

  readonly filteredEmployees = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.employees().filter(employee => {
      const values = [employee.name, employee.email, employee.role, employee.department, String(employee.id)];
      const matchesSearch = !term || values.some(value => value.toLowerCase().includes(term));
      const matchesDepartment = this.departmentFilter() === 'All departments' || employee.department === this.departmentFilter();
      const matchesStatus = this.statusFilter() === 'All statuses' || employee.status === this.statusFilter();
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredEmployees().length / this.pageSize)));
  readonly visibleEmployees = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredEmployees().slice(start, start + this.pageSize);
  });
  readonly activeCount = computed(() => this.employees().filter(employee => employee.status === 'Active').length);
  readonly leaveCount = computed(() => this.employees().filter(employee => employee.status === 'On leave').length);
  readonly inactiveCount = computed(() => this.employees().filter(employee => employee.status === 'Inactive').length);
  readonly departmentCount = computed(() => new Set(this.employees().map(employee => employee.department)).size);

  constructor(private readonly employeeService: EmployeeService) {}

  setPage(pageName: string): void {
    this.activePage.set(pageName);
  }

  openAdd(): void {
    this.editingId.set(null);
    this.draft = this.emptyDraft();
    this.modalOpen.set(true);
  }

  openEdit(employee: Employee): void {
    this.editingId.set(employee.id);
    const { name, email, role, department, location, status, joined } = employee;
    this.draft = { name, email, role, department, location, status, joined };
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  saveEmployee(): void {
    if (!this.draft.name.trim() || !this.draft.email.trim() || !this.draft.role.trim()) return;
    const editing = this.editingId();
    if (editing === null) {
      this.employeeService.add(this.draft);
      this.notify('Employee added successfully');
    } else {
      this.employeeService.update(editing, this.draft);
      this.notify('Employee details updated');
    }
    this.refresh();
    this.closeModal();
  }

  requestDelete(id: number): void {
    this.deletingId.set(id);
  }

  confirmDelete(): void {
    const id = this.deletingId();
    if (id === null) return;
    this.employeeService.delete(id);
    this.deletingId.set(null);
    this.refresh();
    this.notify('Employee removed');
  }

  cancelDelete(): void {
    this.deletingId.set(null);
  }

  changePage(nextPage: number): void {
    this.page.set(Math.min(this.totalPages(), Math.max(1, nextPage)));
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.departmentFilter.set('All departments');
    this.statusFilter.set('All statuses');
    this.page.set(1);
  }

  refresh(): void {
    this.employees.set(this.employeeService.getAll());
    this.page.set(1);
  }

  resetDemo(): void {
    this.employeeService.reset();
    this.refresh();
    this.notify('Demo data restored');
  }

  exportCsv(): void {
    const header = ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Location', 'Status', 'Joined'];
    const rows = this.filteredEmployees().map(employee => [
      employee.id, employee.name, employee.email, employee.role,
      employee.department, employee.location, employee.status, employee.joined
    ]);
    const csv = [header, ...rows]
      .map(row => row.map(value => '"' + String(value).replaceAll('"', '""') + '"').join(','))
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'worksphere-employees.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    this.notify('Employee CSV exported');
  }

  statusClass(status: EmployeeStatus): string {
    return status === 'Active' ? 'status-active' : status === 'On leave' ? 'status-leave' : 'status-inactive';
  }

  departmentEmployees(department: string): number {
    return this.employees().filter(employee => employee.department === department).length;
  }

  private emptyDraft(): EmployeeDraft {
    return {
      name: '', email: '', role: '', department: 'Engineering',
      location: 'Bengaluru', status: 'Active',
      joined: new Date().toISOString().slice(0, 10)
    };
  }

  private notify(message: string): void {
    this.toast.set(message);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(''), 2600);
  }
}
