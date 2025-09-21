# Auto Master - Maintenance Center

A mobile-first web application for auto workshop management, designed specifically for generating invoices and managing services.

## Features

### 🔐 Authentication
- Secure login system for workshop owners
- Demo credentials: `admin` / `admin123`

### 📄 Invoice Management
- **Create Invoices**: Add multiple services and spare parts with individual pricing
- **Real-time Preview**: See invoice preview while creating
- **Auto-calculation**: Automatic total calculation
- **Sequential Numbering**: Auto-generated S.No for each invoice

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface
- Clean, professional layout

### 📊 Invoice Gallery
- View all previously created invoices
- Search functionality by customer name, S.No, or date
- Quick actions: View, Export PDF, Share, Delete

### 📤 Export & Sharing
- **PDF Export**: Generate professional PDF invoices
- **Image Export**: Export invoices as PNG images
- **Share**: Share invoices via native sharing or copy to clipboard

### ⚙️ Settings
- Customize workshop information
- Update contact details
- Manage services offered
- Configure business numbers (Reference No, Vendor No, STRN)

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form
- **PDF Generation**: jsPDF with html2canvas
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auto-master
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Login
Use the demo credentials to access the application:
- **Username**: `admin`
- **Password**: `admin123`

## Usage

### Creating an Invoice
1. Login to the dashboard
2. Click "Create Invoice" or navigate to the dashboard
3. Enter customer name
4. Add services/parts with descriptions and rates
5. Review the preview
6. Click "Create Invoice" to save

### Managing Invoices
1. Navigate to "Invoice Gallery"
2. Search for specific invoices
3. Use action buttons to:
   - **View**: Open detailed invoice view
   - **Export PDF**: Download as PDF
   - **Share**: Share via native sharing or copy details
   - **Delete**: Remove invoice (with confirmation)

### Customizing Settings
1. Go to "Settings"
2. Update workshop information
3. Modify contact details
4. Configure services offered
5. Save changes

## Invoice Template

The application uses a professional invoice template that matches the provided design:
- Red header with workshop branding
- Customer information section
- Services table with rates and amounts
- Total calculation
- Contact information footer

## Data Persistence

All data is stored locally in the browser using Zustand's persistence middleware:
- Invoices are saved locally
- Settings are preserved between sessions
- Authentication state is maintained

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Project Structure
```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── Auth/             # Authentication components
│   ├── Invoice/          # Invoice-related components
│   ├── Layout/           # Layout components
│   └── Settings/         # Settings components
├── store/                # Zustand store
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.