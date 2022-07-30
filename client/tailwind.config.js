/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    colors : {
      lblue : '#F8FAFC' , 
      dblue : '#426FB7' , 
      owhite : '#FFFFFF' , 
      ogray : '#6C6C6C' , 
      lwhite : '#F9FAFC' , 
      ogray : '#8B8686' , 
      ored : '#FF0000'
    } , 
    extend: {
      fontFamily : {
        a : ["'Alex Brush'" , "cursive"] ,  
        inter : ['Inter' , 'sans-serif']
      }
    },
  },
  plugins: [],
}
