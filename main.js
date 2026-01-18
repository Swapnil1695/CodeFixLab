/**
 * CodeFixLab - Main JavaScript File
 * Contains all interactive functionality for the website
 * No external dependencies, pure vanilla JS
 */

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    console.log('CodeFixLab - Educational Coding Website');
    
    // Initialize current year in footer
    setCurrentYear();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize page-specific functionality
    initPageSpecificFunctions();
    
    // Initialize copy code buttons
    initCopyButtons();
    
    // Initialize code tester if on that page
    if (document.getElementById('codeTesterPage')) {
        initCodeTester();
    }
    
    // Initialize AI tools if on that page
    if (document.getElementById('aiToolsPage')) {
        initAITools();
    }
    
    // Initialize error fix accordions if on that page
    if (document.getElementById('errorFixPage')) {
        initErrorAccordions();
    }
    
    // Initialize contact form if on that page
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
});

/**
 * Set current year in footer copyright
 */
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Initialize page-specific functions based on current page
 */
function initPageSpecificFunctions() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Set active nav link based on current page
    setActiveNavLink(currentPage);
    
    // Initialize page-specific features
    switch(currentPage) {
        case 'error-fix.html':
            initErrorFixPage();
            break;
        case 'source-code.html':
            initSourceCodePage();
            break;
        case 'mini-projects.html':
            initMiniProjectsPage();
            break;
        case 'code-tester.html':
            initCodeTester();
            break;
        case 'ai-tools.html':
            initAITools();
            break;
    }
}

/**
 * Set active navigation link based on current page
 * @param {string} currentPage - Current page filename
 */
function setActiveNavLink(currentPage) {
    // Default to index.html if no page specified
    if (!currentPage || currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Get the page this link points to
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for index.html (home)
        if (currentPage === 'index.html' && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize copy code buttons functionality
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-container')?.querySelector('code') || 
                             this.closest('.code-block')?.querySelector('pre') ||
                             this.closest('.project-content')?.querySelector('.code-block');
            
            if (codeBlock) {
                const textToCopy = codeBlock.textContent;
                
                // Use Clipboard API if available
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            showCopyFeedback(this, true);
                        })
                        .catch(err => {
                            console.error('Failed to copy: ', err);
                            fallbackCopyText(textToCopy, this);
                        });
                } else {
                    fallbackCopyText(textToCopy, this);
                }
            }
        });
    });
}

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Copy button element
 */
function fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        showCopyFeedback(button, successful);
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        showCopyFeedback(button, false);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Show visual feedback when code is copied
 * @param {HTMLElement} button - Copy button element
 * @param {boolean} success - Whether copy was successful
 */
function showCopyFeedback(button, success) {
    const originalText = button.innerHTML;
    
    if (success) {
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    } else {
        button.innerHTML = '<i class="fas fa-times"></i> Failed';
        
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }
}

/**
 * Initialize error fix page functionality
 */
function initErrorFixPage() {
    // Error fix examples data
    const errorExamples = [
        {
            id: 'html-image-error',
            title: 'HTML Image Not Showing',
            icon: 'fas fa-image',
            problem: 'Images not displaying in HTML can be caused by incorrect file paths, missing images, or incorrect syntax.',
            mistakes: [
                'Wrong file path (e.g., "image.jpg" instead of "images/image.jpg")',
                'Missing file extension',
                'Incorrect attribute spelling (e.g., "scr" instead of "src")',
                'Case sensitivity issues on some servers'
            ],
            solution: 'Always use correct relative or absolute paths. Check file extensions and ensure the image file exists in the specified location.',
            code: `<!-- WRONG -->
<img scr="myimage.jpg" alt="My Image">

<!-- CORRECT -->
<img src="images/my-image.jpg" alt="My Image" width="300" height="200">`
        },
        {
            id: 'css-not-working',
            title: 'CSS Not Applying Styles',
            icon: 'fas fa-palette',
            problem: 'CSS styles not applying to HTML elements is a common issue for beginners.',
            mistakes: [
                'CSS file not linked properly',
                'Incorrect selector specificity',
                'Typos in property names or values',
                'Missing semicolons',
                'CSS cached in browser'
            ],
            solution: 'Check the link tag in HTML, verify selectors match HTML elements, use browser DevTools to inspect applied styles.',
            code: `/* WRONG - Missing semicolon, wrong property */
div {
    color: red
    background-color: blue;
}

/* CORRECT */
div {
    color: red;
    background-color: blue;
}

/* Check HTML link */
<!-- Correct link tag -->
<link rel="stylesheet" href="css/style.css">`
        },
        {
            id: 'js-console-error',
            title: 'JavaScript Console Errors',
            icon: 'fas fa-exclamation-triangle',
            problem: 'JavaScript errors in console can break functionality and are common during development.',
            mistakes: [
                'Undefined variables',
                'Missing parentheses or brackets',
                'Incorrect function names',
                'Trying to access null/undefined properties',
                'Syntax errors'
            ],
            solution: 'Always check browser console for errors. Use console.log() for debugging. Handle errors with try-catch blocks.',
            code: `// WRONG - undefined variable
function showMessage() {
    console.log(mesage); // typo: mesage instead of message
}

// CORRECT
function showMessage() {
    const message = "Hello World";
    console.log(message);
}

// Better with error handling
try {
    // code that might throw error
    const result = someFunction();
} catch (error) {
    console.error("Error occurred:", error);
}`
        },
        {
            id: 'responsive-issues',
            title: 'Responsive Design Not Working',
            icon: 'fas fa-mobile-alt',
            problem: 'Website not adapting properly to different screen sizes despite using responsive techniques.',
            mistakes: [
                'Missing viewport meta tag',
                'Using fixed widths instead of percentages',
                'Not testing on actual devices',
                'Missing media queries',
                'Using px instead of rem/em for fonts'
            ],
            solution: 'Always include viewport meta tag, use relative units (%, rem, em), implement mobile-first design, test with browser DevTools.',
            code: `<!-- ESSENTIAL for responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* CSS Media Queries Example */
/* Mobile First Approach */
.container {
    width: 100%;
    padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        width: 90%;
        margin: 0 auto;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        width: 1200px;
    }
}`
        }
    ];
    
    // Dynamically create error cards if container exists
    const errorContainer = document.getElementById('errorExamplesContainer');
    if (errorContainer) {
        errorExamples.forEach(error => {
            const errorCard = document.createElement('div');
            errorCard.className = 'error-card';
            errorCard.innerHTML = `
                <div class="error-header" data-error="${error.id}">
                    <h3><i class="${error.icon}"></i> ${error.title}</h3>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </div>
                <div class="error-content" id="${error.id}-content">
                    <div class="problem-section">
                        <h4><i class="fas fa-question-circle"></i> Problem</h4>
                        <p>${error.problem}</p>
                    </div>
                    <div class="solution-section">
                        <h4><i class="fas fa-lightbulb"></i> Common Mistakes</h4>
                        <ul>
                            ${error.mistakes.map(mistake => `<li>${mistake}</li>`).join('')}
                        </ul>
                        <h4><i class="fas fa-check-circle"></i> Solution</h4>
                        <p>${error.solution}</p>
                    </div>
                    <div class="code-section">
                        <h4><i class="fas fa-code"></i> Code Example</h4>
                        <div class="code-block">
                            <pre><code>${error.code}</code></pre>
                        </div>
                        <button class="btn copy-btn">
                            <i class="fas fa-copy"></i> Copy Code
                        </button>
                    </div>
                    <div class="preview-section">
                        <h4><i class="fas fa-eye"></i> Output Preview</h4>
                        <div class="preview-box" id="${error.id}-preview">
                            <!-- Preview will be generated by JavaScript -->
                        </div>
                    </div>
                </div>
            `;
            errorContainer.appendChild(errorCard);
            
            // Add click event to header
            const header = errorCard.querySelector('.error-header');
            header.addEventListener('click', function() {
                const contentId = this.getAttribute('data-error') + '-content';
                const content = document.getElementById(contentId);
                const icon = this.querySelector('.toggle-icon');
                
                content.classList.toggle('active');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
                
                // If opening, generate preview
                if (content.classList.contains('active')) {
                    generateErrorPreview(error.id, error.code);
                }
            });
        });
    }
}

/**
 * Generate preview for error examples
 * @param {string} errorId - Error ID
 * @param {string} code - Code to preview
 */
function generateErrorPreview(errorId, code) {
    const previewBox = document.getElementById(errorId + '-preview');
    if (!previewBox) return;
    
    // Clear previous content
    previewBox.innerHTML = '';
    
    // Create iframe for safe code execution
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '200px';
    iframe.style.border = '1px solid #ddd';
    iframe.style.borderRadius = '4px';
    iframe.style.backgroundColor = 'white';
    
    // Extract HTML from code block (simplified)
    let htmlContent = '';
    if (errorId === 'html-image-error') {
        htmlContent = `
            <!DOCTYPE html>
            <html>
            <head><style>body { padding: 20px; font-family: Arial; }</style></head>
            <body>
                <h3>Image Display Example</h3>
                <img src="https://via.placeholder.com/300x150/4a6bff/ffffff?text=Correct+Image+Path" 
                     alt="Sample Image" style="max-width:100%; border:1px solid #ddd;">
                <p style="color:green; margin-top:10px;">✓ Image displayed correctly</p>
            </body>
            </html>`;
    } else if (errorId === 'css-not-working') {
        htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { padding: 20px; font-family: Arial; }
                    .styled-box {
                        background-color: #4a6bff;
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                <h3>CSS Styling Example</h3>
                <div class="styled-box">
                    This box is styled with CSS
                </div>
                <p style="color:green;">✓ CSS is working correctly</p>
            </body>
            </html>`;
    } else if (errorId === 'js-console-error') {
        htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { padding: 20px; font-family: Arial; }
                    button { 
                        background-color: #4a6bff; 
                        color: white; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 4px; 
                        cursor: pointer; 
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                <h3>JavaScript Example</h3>
                <button onclick="showMessage()">Click Me</button>
                <div id="message" style="margin-top:10px;"></div>
                <script>
                    function showMessage() {
                        const message = "Hello from JavaScript!";
                        document.getElementById('message').innerHTML = 
                            '<p style="color:green;">' + message + '</p>';
                    }
                </script>
            </body>
            </html>`;
    } else if (errorId === 'responsive-issues') {
        htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { padding: 20px; font-family: Arial; margin: 0; }
                    .responsive-box {
                        width: 100%;
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: #4a6bff;
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                    }
                    @media (max-width: 600px) {
                        .responsive-box {
                            background-color: #00c853;
                        }
                    }
                </style>
            </head>
            <body>
                <h3>Responsive Design Example</h3>
                <div class="responsive-box">
                    This box is responsive. Try resizing the window!
                    <p style="font-size:0.9em; margin-top:10px;">
                        On mobile (<600px), background turns green
                    </p>
                </div>
            </body>
            </html>`;
    }
    
    // Write content to iframe
    previewBox.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(htmlContent);
    iframe.contentDocument.close();
}

/**
 * Initialize error accordions
 */
function initErrorAccordions() {
    const errorHeaders = document.querySelectorAll('.error-header');
    
    errorHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon');
            
            // Close all other open accordions
            document.querySelectorAll('.error-content.active').forEach(activeContent => {
                if (activeContent !== content) {
                    activeContent.classList.remove('active');
                    const activeIcon = activeContent.previousElementSibling.querySelector('.toggle-icon');
                    if (activeIcon) {
                        activeIcon.classList.remove('fa-chevron-up');
                        activeIcon.classList.add('fa-chevron-down');
                    }
                }
            });
            
            // Toggle current accordion
            content.classList.toggle('active');
            
            // Update icon
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    });
}

/**
 * Initialize source code page
 */
function initSourceCodePage() {
    // Source code projects data
    const sourceCodeProjects = [
        {
            id: 'login-page',
            title: 'Login Page with Validation',
            description: 'A complete login page with form validation, responsive design, and error handling. Perfect for beginner projects.',
            features: [
                'Email and password validation',
                'Responsive design for all devices',
                'Show/hide password toggle',
                'Form submission handling',
                'Error message display'
            ],
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
            padding: 40px;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .login-header h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .login-header p {
            color: #666;
            font-size: 14px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            transition: border 0.3s;
        }
        
        .form-group input:focus {
            border-color: #4a6bff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(74, 107, 255, 0.2);
        }
        
        .password-container {
            position: relative;
        }
        
        .toggle-password {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 14px;
        }
        
        .btn-login {
            width: 100%;
            padding: 12px;
            background: #4a6bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .btn-login:hover {
            background: #3a56cc;
        }
        
        .error-message {
            color: #f44336;
            font-size: 14px;
            margin-top: 5px;
            display: none;
        }
        
        .signup-link {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }
        
        .signup-link a {
            color: #4a6bff;
            text-decoration: none;
            font-weight: 500;
        }
        
        @media (max-width: 480px) {
            .login-container {
                padding: 30px 20px;
            }
            
            .login-header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
        </div>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter your email" required>
                <div class="error-message" id="emailError">Please enter a valid email address</div>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <div class="password-container">
                    <input type="password" id="password" placeholder="Enter your password" required>
                    <button type="button" class="toggle-password" id="togglePassword">Show</button>
                </div>
                <div class="error-message" id="passwordError">Password must be at least 6 characters</div>
            </div>
            
            <button type="submit" class="btn-login">Sign In</button>
        </form>
        
        <div class="signup-link">
            Don't have an account? <a href="#">Sign up here</a>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            let isValid = true;
            
            // Email validation
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('emailError').style.display = 'none';
            }
            
            // Password validation
            if (password.length < 6) {
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('passwordError').style.display = 'none';
            }
            
            if (isValid) {
                alert('Login successful! (This is a demo)');
                // In real application, submit form to server
            }
        });
        
        // Toggle password visibility
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    </script>
</body>
</html>`
        },
        {
            id: 'portfolio-website',
            title: 'Personal Portfolio Website',
            description: 'A clean, responsive portfolio template with sections for about, skills, projects, and contact.',
            features: [
                'Responsive navigation menu',
                'Skills section with progress bars',
                'Project gallery with filters',
                'Contact form with validation',
                'Dark/light mode toggle'
            ],
            code: `<!-- Portfolio template code would go here -->
<!-- This is a simplified version for demo -->`
        }
    ];
    
    // Dynamically create source code cards if container exists
    const sourceContainer = document.getElementById('sourceCodeContainer');
    if (sourceContainer) {
        // For demo, we'll just add the first project
        const project = sourceCodeProjects[0];
        
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-header">
                <h3><i class="fas fa-file-code"></i> ${project.title}</h3>
                <p>${project.description}</p>
            </div>
            <div class="project-content">
                <div class="project-features">
                    <h4><i class="fas fa-star"></i> Features</h4>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="code-actions">
                    <button class="copy-btn">
                        <i class="fas fa-copy"></i> Copy Code
                    </button>
                    <button class="download-btn" onclick="downloadSourceCode('${project.id}')">
                        <i class="fas fa-download"></i> Download HTML
                    </button>
                </div>
                <div class="code-block">
                    <pre><code>${project.code}</code></pre>
                </div>
            </div>
        `;
        sourceContainer.appendChild(projectCard);
    }
}

/**
 * Initialize mini projects page
 */
function initMiniProjectsPage() {
    // Mini projects data
    const miniProjects = [
        {
            id: 'todo-app',
            title: 'To-Do List App',
            features: [
                'Add new tasks',
                'Mark tasks as completed',
                'Delete tasks',
                'Filter tasks (all/active/completed)',
                'Local storage to save tasks'
            ],
            vivaQuestions: [
                'What data structure would you use to store tasks?',
                'How would you implement local storage?',
                'What event listeners would you need?',
                'How would you handle task deletion?',
                'What UX improvements could you add?'
            ]
        },
        {
            id: 'calculator',
            title: 'Calculator App',
            features: [
                'Basic arithmetic operations',
                'Clear and delete functions',
                'Keyboard support',
                'Error handling for invalid operations',
                'Responsive design'
            ],
            vivaQuestions: [
                'How would you handle operator precedence?',
                'What method would you use for evaluation?',
                'How to prevent multiple decimal points?',
                'How to handle division by zero?',
                'How to make it accessible?'
            ]
        }
    ];
    
    // Create live preview iframe for to-do app
    const todoPreview = document.getElementById('todoPreview');
    if (todoPreview) {
        const iframe = document.createElement('iframe');
        iframe.className = 'output-frame';
        iframe.style.height = '400px';
        
        const todoHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial; }
                    body { padding: 20px; background: #f5f7fa; }
                    .todo-container { max-width: 500px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                    h2 { color: #4a6bff; margin-bottom: 20px; text-align: center; }
                    .input-group { display: flex; margin-bottom: 20px; }
                    #taskInput { flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 4px 0 0 4px; font-size: 16px; }
                    #addTaskBtn { background: #4a6bff; color: white; border: none; padding: 10px 20px; border-radius: 0 4px 4px 0; cursor: pointer; font-size: 16px; }
                    .task-list { list-style: none; }
                    .task-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9f9f9; border-radius: 4px; margin-bottom: 8px; border-left: 4px solid #4a6bff; }
                    .task-item.completed { opacity: 0.7; border-left-color: #00c853; }
                    .task-text { flex: 1; }
                    .task-actions button { background: none; border: none; cursor: pointer; margin-left: 10px; font-size: 14px; }
                    .complete-btn { color: #00c853; }
                    .delete-btn { color: #f44336; }
                    .task-stats { margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
                </style>
            </head>
            <body>
                <div class="todo-container">
                    <h2>To-Do List Demo</h2>
                    <div class="input-group">
                        <input type="text" id="taskInput" placeholder="Add a new task...">
                        <button id="addTaskBtn">Add</button>
                    </div>
                    <ul class="task-list" id="taskList">
                        <li class="task-item">
                            <span class="task-text">Learn HTML & CSS</span>
                            <div class="task-actions">
                                <button class="complete-btn">✓</button>
                                <button class="delete-btn">✗</button>
                            </div>
                        </li>
                        <li class="task-item completed">
                            <span class="task-text">Create a portfolio</span>
                            <div class="task-actions">
                                <button class="complete-btn">✓</button>
                                <button class="delete-btn">✗</button>
                            </div>
                        </li>
                    </ul>
                    <div class="task-stats">
                        <span id="taskCount">2 tasks</span> | 
                        <span id="completedCount">1 completed</span>
                    </div>
                </div>
                <script>
                    const tasks = [
                        { id: 1, text: 'Learn HTML & CSS', completed: false },
                        { id: 2, text: 'Create a portfolio', completed: true }
                    ];
                    
                    function renderTasks() {
                        const taskList = document.getElementById('taskList');
                        taskList.innerHTML = '';
                        
                        tasks.forEach(task => {
                            const li = document.createElement('li');
                            li.className = 'task-item' + (task.completed ? ' completed' : '');
                            li.innerHTML = \`
                                <span class="task-text">\${task.text}</span>
                                <div class="task-actions">
                                    <button class="complete-btn" onclick="toggleTask(\${task.id})">✓</button>
                                    <button class="delete-btn" onclick="deleteTask(\${task.id})">✗</button>
                                </div>
                            \`;
                            taskList.appendChild(li);
                        });
                        
                        document.getElementById('taskCount').textContent = \`\${tasks.length} tasks\`;
                        const completed = tasks.filter(t => t.completed).length;
                        document.getElementById('completedCount').textContent = \`\${completed} completed\`;
                    }
                    
                    function addTask() {
                        const input = document.getElementById('taskInput');
                        const text = input.value.trim();
                        if (text) {
                            tasks.push({
                                id: Date.now(),
                                text: text,
                                completed: false
                            });
                            input.value = '';
                            renderTasks();
                        }
                    }
                    
                    function toggleTask(id) {
                        const task = tasks.find(t => t.id === id);
                        if (task) task.completed = !task.completed;
                        renderTasks();
                    }
                    
                    function deleteTask(id) {
                        const index = tasks.findIndex(t => t.id === id);
                        if (index > -1) tasks.splice(index, 1);
                        renderTasks();
                    }
                    
                    document.getElementById('addTaskBtn').addEventListener('click', addTask);
                    document.getElementById('taskInput').addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') addTask();
                    });
                    
                    renderTasks();
                </script>
            </body>
            </html>`;
        
        todoPreview.appendChild(iframe);
        iframe.contentDocument.open();
        iframe.contentDocument.write(todoHTML);
        iframe.contentDocument.close();
    }
}

/**
 * Initialize code tester functionality
 */
function initCodeTester() {
    const htmlEditor = document.getElementById('htmlCode');
    const cssEditor = document.getElementById('cssCode');
    const jsEditor = document.getElementById('jsCode');
    const runBtn = document.getElementById('runBtn');
    const clearBtn = document.getElementById('clearBtn');
    const outputFrame = document.getElementById('outputFrame');
    
    // Default code examples
    if (htmlEditor && htmlEditor.value.trim() === '') {
        htmlEditor.value = `<!DOCTYPE html>
<html>
<head>
    <title>My Test Page</title>
</head>
<body>
    <h1>Welcome to Code Tester</h1>
    <p>Edit the code and click "Run Code" to see changes.</p>
    <div id="demo">Try adding some CSS and JavaScript!</div>
    <button onclick="showAlert()">Click Me</button>
</body>
</html>`;
    }
    
    if (cssEditor && cssEditor.value.trim() === '') {
        cssEditor.value = `body {
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #f5f7fa;
}

h1 {
    color: #4a6bff;
    text-align: center;
}

p {
    color: #333;
    line-height: 1.6;
}

#demo {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

button {
    background-color: #4a6bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #3a56cc;
}`;
    }
    
    if (jsEditor && jsEditor.value.trim() === '') {
        jsEditor.value = `function showAlert() {
    document.getElementById('demo').innerHTML = 
        '<h3>JavaScript is working!</h3>' +
        '<p>You successfully executed JavaScript code.</p>' +
        '<p>Current time: ' + new Date().toLocaleTimeString() + '</p>';
    
    // Also show alert
    alert('Hello from JavaScript!');
}

// Call function on page load
window.onload = function() {
    console.log('Code tester initialized');
};`;
    }
    
    // Run code function
    if (runBtn) {
        runBtn.addEventListener('click', runCode);
    }
    
    // Clear code function
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCode);
    }
    
    // Auto-run on Ctrl+Enter
    if (htmlEditor && cssEditor && jsEditor) {
        [htmlEditor, cssEditor, jsEditor].forEach(editor => {
            editor.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'Enter') {
                    runCode();
                }
            });
        });
    }
}

/**
 * Run code in the tester
 */
function runCode() {
    const htmlCode = document.getElementById('htmlCode')?.value || '';
    const cssCode = document.getElementById('cssCode')?.value || '';
    const jsCode = document.getElementById('jsCode')?.value || '';
    const outputFrame = document.getElementById('outputFrame');
    
    if (!outputFrame) return;
    
    // Create the complete HTML document
    const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                ${cssCode}
            </style>
        </head>
        <body>
            ${htmlCode}
            <script>
                try {
                    ${jsCode}
                } catch(error) {
                    console.error('JavaScript Error:', error);
                    document.body.innerHTML += '<div style="color: red; padding: 10px; background: #ffe6e6; margin: 10px; border-radius: 4px;">JavaScript Error: ' + error.message + '</div>';
                }
            </script>
        </body>
        </html>`;
    
    // Write to iframe
    outputFrame.contentDocument.open();
    outputFrame.contentDocument.write(fullHTML);
    outputFrame.contentDocument.close();
    
    // Show success message
    const runBtn = document.getElementById('runBtn');
    if (runBtn) {
        const originalText = runBtn.innerHTML;
        runBtn.innerHTML = '<i class="fas fa-check"></i> Code Executed!';
        runBtn.style.backgroundColor = '#00c853';
        
        setTimeout(() => {
            runBtn.innerHTML = originalText;
            runBtn.style.backgroundColor = '';
        }, 1500);
    }
}

/**
 * Clear all code editors
 */
function clearCode() {
    if (confirm('Are you sure you want to clear all code?')) {
        document.getElementById('htmlCode').value = '';
        document.getElementById('cssCode').value = '';
        document.getElementById('jsCode').value = '';
        
        const outputFrame = document.getElementById('outputFrame');
        if (outputFrame) {
            outputFrame.contentDocument.open();
            outputFrame.contentDocument.write('');
            outputFrame.contentDocument.close();
        }
        
        // Show confirmation
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            const originalText = clearBtn.innerHTML;
            clearBtn.innerHTML = '<i class="fas fa-check"></i> Cleared!';
            
            setTimeout(() => {
                clearBtn.innerHTML = originalText;
            }, 1500);
        }
    }
}

/**
 * Initialize AI tools page
 */
function initAITools() {
    const askBtn = document.getElementById('askBtn');
    const clearQuestionBtn = document.getElementById('clearQuestionBtn');
    const aiQuestion = document.getElementById('aiQuestion');
    const aiResponse = document.getElementById('aiResponse');
    
    // Sample AI responses based on keywords
    const aiResponses = {
        'error': "For coding errors, try these steps:\n1. Read the error message carefully\n2. Check the line number mentioned\n3. Google the exact error message\n4. Check for typos or syntax errors\n5. Use console.log() to debug\n\nAI tools like ChatGPT can help explain errors in simple terms.",
        'html': "HTML best practices:\n1. Use semantic tags (header, nav, main, footer)\n2. Always include alt text for images\n3. Validate your HTML with W3C validator\n4. Use proper indentation\n5. Test in multiple browsers\n\nFor AI assistance, try: 'Explain HTML semantic elements' or 'Show me a responsive navbar example'",
        'css': "CSS troubleshooting tips:\n1. Use browser DevTools to inspect elements\n2. Check CSS specificity rules\n3. Verify class/ID names match\n4. Clear browser cache\n5. Test with simplified code\n\nAsk AI: 'How to center a div?' or 'Explain CSS flexbox with examples'",
        'javascript': "JavaScript debugging guide:\n1. Check browser console for errors\n2. Use debugger statement or breakpoints\n3. Console.log() variables at different points\n4. Check for undefined/null values\n5. Verify function names and parameters\n\nAI prompt example: 'Explain JavaScript closures with simple examples'",
        'responsive': "Responsive design checklist:\n1. Use viewport meta tag\n2. Implement mobile-first approach\n3. Use relative units (%, rem, em)\n4. Test on actual devices\n5. Use CSS media queries\n\nAsk AI: 'Create a responsive grid layout with CSS Grid'",
        'default': "For coding help with AI tools:\n1. Be specific about your problem\n2. Include error messages if any\n3. Share relevant code snippets\n4. Specify your programming language\n5. Ask for step-by-step explanations\n\nTry: 'Explain how to create a REST API in Node.js' or 'Help me fix this React component error'"
    };
    
    if (askBtn) {
        askBtn.addEventListener('click', function() {
            const question = aiQuestion.value.toLowerCase().trim();
            
            if (!question) {
                aiResponse.innerHTML = '<p style="color: #f44336;">Please enter a coding question first.</p>';
                return;
            }
            
            // Show loading state
            aiResponse.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Generating AI response...</p>';
            
            // Simulate AI thinking (in real app, this would be an API call)
            setTimeout(() => {
                let response = aiResponses.default;
                
                // Check for keywords
                if (question.includes('error') || question.includes('not working') || question.includes('bug')) {
                    response = aiResponses.error;
                } else if (question.includes('html')) {
                    response = aiResponses.html;
                } else if (question.includes('css')) {
                    response = aiResponses.css;
                } else if (question.includes('javascript') || question.includes('js')) {
                    response = aiResponses.javascript;
                } else if (question.includes('responsive') || question.includes('mobile')) {
                    response = aiResponses.responsive;
                }
                
                // Format response with line breaks
                const formattedResponse = response.split('\n').map(line => {
                    if (line.trim() === '') return '<br>';
                    return `<p>${line}</p>`;
                }).join('');
                
                aiResponse.innerHTML = `
                    <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #4a6bff;">
                        <h4 style="margin-top: 0; color: #4a6bff;"><i class="fas fa-robot"></i> AI Suggestion:</h4>
                        ${formattedResponse}
                        <hr style="margin: 15px 0;">
                        <p style="font-size: 0.9em; color: #666;">
                            <i class="fas fa-lightbulb"></i> 
                            <strong>Tip:</strong> For more detailed help, try asking ChatGPT or DeepSeek with your specific code example.
                        </p>
                    </div>
                `;
            }, 1000);
        });
    }
    
    if (clearQuestionBtn) {
        clearQuestionBtn.addEventListener('click', function() {
            aiQuestion.value = '';
            aiResponse.innerHTML = '<p>Your AI response will appear here...</p>';
        });
    }
    
    // Open AI tools in new window
    const chatGPTBtn = document.getElementById('chatGPTBtn');
    const deepSeekBtn = document.getElementById('deepSeekBtn');
    
    if (chatGPTBtn) {
        chatGPTBtn.addEventListener('click', function() {
            window.open('https://chat.openai.com/', '_blank');
        });
    }
    
    if (deepSeekBtn) {
        deepSeekBtn.addEventListener('click', function() {
            window.open('https://www.deepseek.com/', '_blank');
        });
    }
}

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            let isValid = true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Reset errors
            document.querySelectorAll('.error').forEach(el => el.remove());
            
            if (!name) {
                showError('name', 'Please enter your name');
                isValid = false;
            }
            
            if (!email || !emailRegex.test(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!subject) {
                showError('subject', 'Please enter a subject');
                isValid = false;
            }
            
            if (!message || message.length < 10) {
                showError('message', 'Please enter a message (at least 10 characters)');
                isValid = false;
            }
            
            if (isValid) {
                // In a real application, you would send this data to a server
                // For demo purposes, we'll just show a success message
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate API call delay
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.backgroundColor = '#00c853';
                    
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.innerHTML = `
                        <div style="background: #e8f5e9; color: #2e7d32; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                            <h4 style="margin-top: 0;"><i class="fas fa-check-circle"></i> Thank you for your message!</h4>
                            <p>We've received your inquiry and will respond within 24-48 hours.</p>
                            <p><strong>Demo Note:</strong> This is a demonstration. In a real website, this would connect to a backend server.</p>
                        </div>
                    `;
                    
                    contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
                    
                    // Reset form
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                        
                        // Scroll to success message
                        successMsg.scrollIntoView({ behavior: 'smooth' });
                    }, 2000);
                }, 1500);
            }
        });
    }
}

/**
 * Show error message for form validation
 * @param {string} fieldId - ID of the field with error
 * @param {string} message - Error message to display
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.style.color = '#f44336';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#f44336';
        
        // Remove error when field is focused
        field.addEventListener('focus', function() {
            errorDiv.remove();
            field.style.borderColor = '';
        });
    }
}

/**
 * Download source code as file
 * @param {string} projectId - Project ID to download
 */
function downloadSourceCode(projectId) {
    // This would normally fetch the actual code
    // For demo, we'll create a simple HTML file
    const content = `<!DOCTYPE html>
<html>
<head>
    <title>CodeFixLab - Login Page Template</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Login page styles would go here */
        body { font-family: Arial; background: #f5f7fa; }
        .container { max-width: 400px; margin: 50px auto; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Login Page Template</h1>
        <p>Downloaded from CodeFixLab - Free Educational Resource</p>
        <p>Visit <a href="https://codefixlab.com">CodeFixLab.com</a> for more free code.</p>
    </div>
</body>
</html>`;
    
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codefixlab-${projectId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) existingNotif.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);