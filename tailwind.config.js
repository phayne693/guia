/** @type {import('tailwindcss').Config} */
export default {
  content: [    
    "./views/**/*.html",
    "./views/**/*.js",
    "./views/**/*.ejs",
    "./views/partials/**/*.ejs",
    "./views/admin/categories/**/*.ejs",
    "./views/components/*.ejs",
    "./views/admin/articles/**/*.ejs"
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#999'
      }
    },
  },
  plugins: [],
}

