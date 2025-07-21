import type { SiteData, SitePageData, UserData } from '../types';
import JSZip from 'jszip';

export interface ExportOptions {
  includeBranding?: boolean;
  theme?: 'modern' | 'classic' | 'minimal';
  responsive?: boolean;
  seoOptimized?: boolean;
}

export interface ExportResult {
  html: string;
  css: string;
  js: string;
  assets: string[];
  metadata: {
    totalPages: number;
    exportDate: string;
    theme: string;
    responsive: boolean;
  };
}

export class ExportService {
  private static generateCSS(theme: string = 'modern', responsive: boolean = true): string {
    const baseCSS = `
/* ScopeStudio Export - ${theme} Theme */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Styles */
.header {
  background: ${theme === 'modern' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                theme === 'classic' ? '#2c3e50' : '#f8f9fa'};
  color: ${theme === 'minimal' ? '#333' : '#fff'};
  padding: 1rem 0;
  box-shadow: ${theme === 'minimal' ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'};
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.3s;
}

.nav-menu a:hover {
  opacity: 0.8;
}

/* Hero Section */
.hero {
  background: ${theme === 'modern' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
               theme === 'classic' ? '#34495e' : '#f8f9fa'};
  color: ${theme === 'minimal' ? '#333' : '#fff'};
  padding: 4rem 0;
  text-align: center;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: ${theme === 'modern' ? '3.5rem' : '2.5rem'};
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* Body Content */
.body-content {
  padding: 4rem 0;
  background: #fff;
}

.body-text {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
}

.body-text p {
  margin-bottom: 1.5rem;
}

.body-text ul {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.body-text li {
  margin-bottom: 0.5rem;
}

.body-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* Footer */
.footer {
  background: ${theme === 'modern' ? '#2c3e50' : 
                theme === 'classic' ? '#34495e' : '#f8f9fa'};
  color: ${theme === 'minimal' ? '#333' : '#fff'};
  padding: 2rem 0;
  text-align: center;
  margin-top: 4rem;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-brand {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.footer-tagline {
  opacity: 0.8;
  margin-bottom: 1rem;
}

.footer-credit {
  font-size: 0.875rem;
  opacity: 0.6;
}

/* Utility Classes */
.text-center { text-align: center; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }
`;

    const responsiveCSS = responsive ? `
/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .body-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
}
` : '';

    return baseCSS + responsiveCSS;
  }

  private static generateJavaScript(): string {
    return `
// ScopeStudio Export - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading animation for images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
  });

  // Add scroll-based animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.hero-content, .body-content');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // Mobile menu toggle (if needed)
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
});

// Add some basic SEO improvements
if (typeof window !== 'undefined') {
  // Update page title dynamically
  const pageTitle = document.querySelector('h1');
  if (pageTitle) {
    document.title = pageTitle.textContent + ' - ' + document.title;
  }
}
`;
  }

  private static generatePageHTML(page: SitePageData, allPages: SitePageData[], theme: string, includeBranding: boolean): string {
    const navigation = allPages.map(p => 
      `<li><a href="#${p.id}">${p.name}</a></li>`
    ).join('');

    const heroImage = page.heroImageUrl ? 
      `<img src="${page.heroImageUrl}" alt="${page.heroTitle}" class="hero-image">` : '';

    const bodyImage = page.bodyImageUrl ? 
      `<img src="${page.bodyImageUrl}" alt="${page.title}" class="body-image">` : '';

    const bodyContent = page.bodyContent ? 
      page.bodyContent.split('\n\n').map(paragraph => 
        paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
      ).join('') : '';

    const branding = includeBranding ? `
      <div class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">ScopeStudio</div>
            <div class="footer-tagline">The wireframing tool for modern development teams</div>
            <div class="footer-credit">Built with Quantum Climb</div>
          </div>
        </div>
      </div>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:type" content="website">
    ${page.heroImageUrl ? `<meta property="og:image" content="${page.heroImageUrl}">` : ''}
    <style>
      ${ExportService.generateCSS(theme, true)}
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="#" class="nav-brand">${page.title}</a>
                <ul class="nav-menu">
                    ${navigation}
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">${page.heroTitle}</h1>
                    <p class="hero-subtitle">${page.heroSubheading}</p>
                    ${heroImage}
                </div>
            </div>
        </section>

        <section class="body-content">
            <div class="container">
                <div class="body-text">
                    ${bodyContent}
                    ${bodyImage}
                </div>
            </div>
        </section>
    </main>

    ${branding}

    <script>
      ${ExportService.generateJavaScript()}
    </script>
</body>
</html>`;
  }

  private static generateIndexHTML(siteData: SiteData, theme: string, includeBranding: boolean): string {
    const homePage = siteData.pages.find(p => p.id === 'home') || siteData.pages[0];
    const navigation = siteData.pages.map(p => 
      `<li><a href="${p.id}.html">${p.name}</a></li>`
    ).join('');

    const branding = includeBranding ? `
      <div class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">ScopeStudio</div>
            <div class="footer-tagline">The wireframing tool for modern development teams</div>
            <div class="footer-credit">Built with Quantum Climb</div>
          </div>
        </div>
      </div>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${homePage.title}</title>
    <meta name="description" content="${homePage.description}">
    <meta property="og:title" content="${homePage.title}">
    <meta property="og:description" content="${homePage.description}">
    <meta property="og:type" content="website">
    ${homePage.heroImageUrl ? `<meta property="og:image" content="${homePage.heroImageUrl}">` : ''}
    <style>
      ${ExportService.generateCSS(theme, true)}
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="index.html" class="nav-brand">${homePage.title}</a>
                <ul class="nav-menu">
                    ${navigation}
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">${homePage.heroTitle}</h1>
                    <p class="hero-subtitle">${homePage.heroSubheading}</p>
                    ${homePage.heroImageUrl ? `<img src="${homePage.heroImageUrl}" alt="${homePage.heroTitle}" class="hero-image">` : ''}
                </div>
            </div>
        </section>

        <section class="body-content">
            <div class="container">
                <div class="body-text">
                    ${homePage.bodyContent ? homePage.bodyContent.split('\n\n').map(paragraph => 
                      paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
                    ).join('') : ''}
                    ${homePage.bodyImageUrl ? `<img src="${homePage.bodyImageUrl}" alt="${homePage.title}" class="body-image">` : ''}
                </div>
            </div>
        </section>
    </main>

    ${branding}

    <script>
      ${ExportService.generateJavaScript()}
    </script>
</body>
</html>`;
  }

  static async exportSite(siteData: SiteData, userData: UserData, options: ExportOptions = {}): Promise<ExportResult> {
    const {
      includeBranding = true,
      theme = 'modern',
      responsive = true,
      seoOptimized = true
    } = options;

    console.log('🚀 Starting site export with options:', { includeBranding, theme, responsive, seoOptimized });

    // Generate CSS
    const css = this.generateCSS(theme, responsive);
    
    // Generate JavaScript
    const js = this.generateJavaScript();

    // Generate HTML files for each page
    const htmlFiles: { [key: string]: string } = {};
    
    // Generate index.html (home page)
    htmlFiles['index.html'] = this.generateIndexHTML(siteData, theme, includeBranding);
    
    // Generate individual page files
    siteData.pages.forEach(page => {
      if (page.id !== 'home') {
        htmlFiles[`${page.id}.html`] = this.generatePageHTML(page, siteData.pages, theme, includeBranding);
      }
    });

    // Combine all HTML files into one string for the main export
    const html = htmlFiles['index.html'];

    // Collect all image assets
    const assets: string[] = [];
    siteData.pages.forEach(page => {
      if (page.heroImageUrl) assets.push(page.heroImageUrl);
      if (page.bodyImageUrl) assets.push(page.bodyImageUrl);
    });

    const result: ExportResult = {
      html,
      css,
      js,
      assets: [...new Set(assets)], // Remove duplicates
      metadata: {
        totalPages: siteData.pages.length,
        exportDate: new Date().toISOString(),
        theme,
        responsive
      }
    };

    console.log('✅ Site export completed:', {
      pages: siteData.pages.length,
      assets: assets.length,
      theme,
      includeBranding
    });

    return result;
  }

  static createDownloadableFiles(result: ExportResult, siteName: string = 'scopestudio-site'): void {
    try {
      // Create a zip file with all the files
      const zip = new JSZip();
      
      // Add HTML file
      zip.file('index.html', result.html);
      
      // Add CSS file
      zip.file('styles.css', result.css);
      
      // Add JavaScript file
      zip.file('script.js', result.js);
      
      // Add README file
      const readme = `# ${siteName}

This website was exported from ScopeStudio.

## Files included:
- index.html - Main page
- styles.css - All styles
- script.js - Interactive features

## Deployment:
You can deploy these files to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## Customization:
Edit the HTML, CSS, and JS files to customize your site further.

Generated on: ${result.metadata.exportDate}
Theme: ${result.metadata.theme}
Responsive: ${result.metadata.responsive}
`;
      zip.file('README.md', readme);

      // Generate and download the zip file
      zip.generateAsync({ type: 'blob' }).then((content) => {
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${siteName}-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });

    } catch (error) {
      console.error('❌ Error creating downloadable files:', error);
      throw error;
    }
  }
} 