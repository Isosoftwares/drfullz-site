/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10b981", // Emerald-500
        dark: "#0f172a", // Slate-950
        dark2: "#1e293b", // Slate-800
        dark3: "#334155", // Slate-700
        light: "#f8fafc", // Slate-50
        accent: "#34d399", // Emerald-400
        secondary: "#475569", // Slate-600
        tertiary: "#020617", // Extra dark
      },
      fontFamily: {
        sans: ["Poppins"],
        serif: ["ui-serif", "Georgia"],
        mono: ["ui-monospace", "SFMono-Regular"],
        display: ["Oswald"],
        body: ['"Open Sans"'],
      },
      backgroundImage: {
        chatBg: "url('/src/assets/graphics/chat2.jpg')",
        heroBg: "url('/src/assets/graphics/hero5.jpg')",
        loginBg:
          "url('https://raw.githubusercontent.com/peter514/Portfolio/main/src/assets/graphics/login.avif')",
        coverAboutUs: "url('/src/assets/graphics/coverabout.jpg')",
        faqs: "url('/src/assets/graphics/faqs.jpg')",
        coverProjects: "url('/src/assets/graphics/cover-projects.jpg')",
        thirdParty:
          "url('https://www.designveloper.com/wp-content/themes/designveloper/images/badge_bg.png')",
        serviceHero:
          "url('https://www.designveloper.com/wp-content/themes/designveloper/images/services/cover-services-2.png')",
        careerHero:
          "url('https://www.designveloper.com/wp-content/themes/designveloper/images/cover-careers.jpg')",
        contactHero:
          "url('https://www.designveloper.com/wp-content/themes/designveloper/images/cover-contact-us.jpg')",
      },
    },
  },
  plugins: [],
};
