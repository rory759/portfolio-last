import os
import re

html_path = r'e:\Watson\Desktop\Modern Webpage\index.html'
css_path = r'e:\Watson\Desktop\Modern Webpage\styles.css'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the Video Sequence Section
video_tag = '<video id="hero-video" src="camaleon.mp4" muted playsinline preload="auto" autoplay loop></video>'
hero_section = '<!-- Hero Section -->'

if video_tag in html and hero_section in html:
    start_idx = html.find(video_tag) + len(video_tag)
    end_idx = html.find(hero_section)
    
    replacement = """
            <div class="scroll-indicator">
                <span class="mouse">
                    <span class="wheel"></span>
                </span>
            </div>
        </div>
    </section>

    """
    html = html[:start_idx] + replacement + html[end_idx:]

# Fix the navigation bar
nav_replacement = """    <nav id="navbar">
        <div class="container nav-container">
            <a href="#hero" class="logo">PORT<span>FOLIO</span></a>
            <ul class="nav-links">
                <li><a href="#hero" class="nav-link">Inicio</a></li>
                <li><a href="#skills" class="nav-link">Experiencia</a></li>
                <li><a href="#artworks" class="nav-link">Trabajo</a></li>
                <li><a href="#testimonials" class="nav-link">Clientes</a></li>
            </ul>
            <div class="nav-auth">
                <button id="theme-toggle" class="btn-icon" aria-label="Toggle Theme">
                    <i class="fa-solid fa-moon dark-icon"></i>
                    <i class="fa-solid fa-sun light-icon"></i>
                </button>
                <a href="#contact" class="btn-primary">Hablemos</a>
            </div>
            <div class="mobile-menu-btn">
                <i class="fa-solid fa-bars"></i>
            </div>
        </div>
    </nav>"""
    
# Find the start of the nav tag and end of nav tag
start_nav = html.find('    <nav id="navbar">')
end_nav = html.find('    </nav>') + len('    </nav>')

if start_nav != -1 and end_nav != -1:
    html = html[:start_nav] + nav_replacement + html[end_nav:]

# Remove inline styles from buttons
html = html.replace('style="background: var(--gradient-primary-blue); color: #fff;"', '')

# Fix Footer MI MARCA PERSONAL
html = html.replace('<a href="#hero" class="logo" style="color: #f7a055; text-transform: uppercase; letter-spacing: 1px;">MI MARCA PERSONAL</a>', '<a href="#hero" class="logo">PORT<span>FOLIO</span></a>')

# Fix other footer texts
html = html.replace('Facebook</a>', 'Twitter / X</a>').replace('<i class="fa-brands fa-facebook-f"></i>', '<i class="fa-brands fa-twitter"></i>')
html = html.replace('<a href="#"><i class="fa-brands fa-instagram"></i> Instagram</a>\\n', '')
html = html.replace('<a href="#"><i class="fa-brands fa-youtube"></i> YouTube</a>\\n', '')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# Fix CSS
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

hud_separator = '/* ---------- HUD Overlay ---------- */'
if hud_separator in css:
    css = css.split(hud_separator)[0].rstrip() + '\\n'

# Restore nav CSS back to original
nav_css_to_replace = """nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 0;
    z-index: 100;
    transition: var(--transition-smooth);
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-bottom: none;
}

nav.scrolled {
    padding: 1rem 0;
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-bottom: none;
}"""

nav_css_original = """nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 0;
    z-index: 100;
    transition: var(--transition-smooth);
    background: rgba(10, 10, 15, 0.4);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

nav.scrolled {
    padding: 1rem 0;
    background: var(--bg-nav);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}"""

css = css.replace(nav_css_to_replace, nav_css_original)

# Remove the container modification
css = css.replace(""".nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 100%;
    padding: 0 4rem;
}""", """.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}""")

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Hard revert completed")
