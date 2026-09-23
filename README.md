WorkSphere — Employee Management Dashboard
A responsive Angular + TypeScript employee management dashboard created as an independent portfolio demonstration. It uses fictional employee records and browser local storage; it does not contain company code or data.
Features
- Dashboard cards for total, active, leave, and department counts
- Department distribution bars and workforce status visualization
- Employee directory with search across name, email, role, department, and ID
- Department and status filters
- Pagination
- Add, edit, and delete employee records
- Template-driven form validation (required fields, minimum name length, email format)
- CSV export of the currently filtered employee list
- Persistent changes using localStorage
- Restore sample data with Reset demo
- Responsive layout for desktop, tablet, and mobile
- Standalone Angular component, typed model, and injectable data service
Tech stack
- Angular 19
- TypeScript
- HTML5 templates
- SCSS
- Angular Forms
- Browser local storage
Requirements
- Node.js 20.11+ (Node 22 LTS recommended)
- npm (included with Node.js)
Run locally
1. Download and extract this project.
2. Open a terminal in the extracted worksphere-employee-dashboard folder.
3. Install dependencies:
   npm install
4. Start the Angular development server:
   npm start
5. Open the local URL printed by Angular CLI, normally http://localhost:4200.
Production build
npm run build
The production output is generated in dist/worksphere/browser.
Deploy to Vercel
1. Push this project folder to your GitHub repository.
2. Sign in to Vercel and choose Add New → Project.
3. Import worksphere-employee-dashboard from GitHub.
4. Use these settings if Vercel does not detect them automatically:
   - Framework preset: Angular
   - Build command: npm run build
   - Output directory: dist/worksphere/browser
5. Deploy. Vercel will provide a public HTTPS URL.
6. Open the deployed URL and test adding, editing, filtering, and deleting a record.
The included vercel.json configures the build output and a single-page-app fallback route.
Deploy to Netlify (alternative)
1. Push the source to GitHub and import the repository into Netlify.
2. Build command: npm run build
3. Publish directory: dist/worksphere/browser
4. Add a redirect rule for SPA routing if needed: /* /index.html 200.
5. Deploy and verify the live site.
Push to the repository you created
If the repository currently contains only the starter README and .gitignore, clone it first, then copy these project files into the cloned folder (replace the starter README and .gitignore when prompted):
git clone https://github.com/Anushara0717/worksphere-employee-dashboard.git
cd worksphere-employee-dashboard
# Copy the extracted project contents into this directory.
git add .
git commit -m "Build WorkSphere employee management dashboard"
git push origin main
Alternatively, use GitHub's Add file → Upload files for a small project, but uploading a complete folder via Git is more reliable.
Demo notes
- The records are fictional sample data.
- Changes are stored in the current browser's local storage, not in a shared database. Other visitors will have their own browser-local data.
- This is a portfolio demo, not a production HR system. Authentication, authorization, a server API, and a database would be needed for real employee information.
Interview walkthrough
1. Start with the dashboard metrics and explain that they are derived from the employee collection.
2. Demonstrate search, department/status filters, and pagination.
3. Add an employee and show form validation.
4. Edit the employee, then delete it with the confirmation dialog.
5. Refresh the page to demonstrate local-storage persistence.
6. Export the filtered directory as CSV.
7. Explain the separation between the employee model, service, and standalone component, plus responsive SCSS.
License
No license is included. Add one if you choose to publish or reuse the code under specific terms.
