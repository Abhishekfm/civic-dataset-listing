# Civic Dataset Listing

A modern, responsive web application for browsing and filtering civic datasets with advanced search capabilities, URL-based filtering, and real-time updates.

[Live Web App](https://civic-dataset-listing-abhishekfms-projects.vercel.app/)

## 🚀 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Shadcn ui** - Component Library

### State Management

- **React Hooks** - useState, useEffect, useCallback
- **URL State Management** - Custom hooks for URL-based filtering

### Development Tools

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 🛠️ Tools & Libraries

### Core Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "lucide-react": "^0.300.0"
}
```

### Development Dependencies

```json
{
  "eslint": "^8.0.0",
  "postcss": "^8.0.0",
  "autoprefixer": "^10.0.0"
}
```

## 📋 Features

### Core Functionality

- **Dataset Browsing** - View datasets in list and grid layouts
- **Advanced Filtering** - Filter by sectors, time periods, data types, tags, geography, and licenses
- **Real-time Search** - Debounced search with 500ms delay
- **URL-based State** - Shareable URLs with applied filters (Extra Feature)
- **Sorting Options** - Sort by latest updated or alphabetical order
- **Responsive Design** - Works on desktop, tablet, and mobile

### User Experience

- **Loading States** - Smooth loading indicators
- **Error Handling** - Graceful error display
- **Pagination** - Navigate through large datasets
- **View Modes** - Toggle between list and grid views
- **Share Functionality** - Copy current URL with filters

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abhishekfms/civic-dataset-listing.git
   cd civic-dataset-listing
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

1. **Build the application**

   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Start the production server**
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
civic-dataset-listing/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Main page component
│   ├── globals.css       # Global styles
│   └── favicon.ico       # App icon
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── dataset/          # Dataset-specific components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run tsc   # Run TypeScript type checking
```

## 🎨 Customization

### Styling

- Modify `app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize component styles in individual component files

### Components

- Add new components in the `components/` directory
- Follow the existing component structure and naming conventions
- Use TypeScript for type safety

### API Integration

- Update API endpoints in `utils/api.ts`
- Modify data fetching logic in `app/page.tsx`
- Add new filter types in `utils/urlFilters.ts`

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
